<?php

namespace App\Support;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

/**
 * Cached, locale-resolved source of truth for the admin-managed site navigation.
 *
 * `tree('header', $locale)` returns `NavItem[]` in EXACTLY the shape the frontend
 * `resources/js/lib/navigation.ts` expects (NavGroup with `columns`, or NavDirect) so the
 * header renders unchanged. `footer` returns grouped link columns; `rail`/`bottom_nav`
 * return a flat resolved list. When a location has no active items an empty array is
 * returned and the frontend falls back to its in-memory navigation.
 *
 * Cached per location+locale; flushed on any {@see Menu}/{@see MenuItem} change.
 * Defensive: before the tables exist (fresh install / migrating) it returns [].
 */
class MenuService
{
    /** The menu locations this service manages. */
    public const LOCATIONS = ['header', 'footer', 'footer_legal', 'rail', 'bottom_nav'];

    /** @return array<int,mixed> */
    public static function tree(string $location, string $locale): array
    {
        if (! Schema::hasTable('menus') || ! Schema::hasTable('menu_items')) {
            return [];
        }

        return Cache::rememberForever(
            "menus.{$location}.{$locale}",
            fn () => self::build($location, $locale)
        );
    }

    /** @return array<int,mixed> */
    private static function build(string $location, string $locale): array
    {
        $menu = Menu::query()->where('location', $location)->first();
        if (! $menu) {
            return [];
        }

        $all = MenuItem::query()
            ->where('menu_id', $menu->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        if ($all->isEmpty()) {
            return [];
        }

        /** @var Collection<int,Collection<int,MenuItem>> $byParent */
        $byParent = $all->groupBy(fn (MenuItem $i) => (int) ($i->parent_id ?? 0));
        $top = $byParent->get(0, collect());

        return match ($location) {
            'header' => self::buildHeader($top, $byParent, $locale),
            'footer' => self::buildFooter($top, $byParent, $locale),
            default => self::buildFlat($top, $locale),
        };
    }

    /**
     * NavItem[] matching navigation.ts: top items become a NavGroup (mega, with columns
     * built from their column children's leaves) when they have children, otherwise a
     * NavDirect.
     *
     * @param  Collection<int,MenuItem>  $top
     * @param  Collection<int,Collection<int,MenuItem>>  $byParent
     * @return array<int,array<string,mixed>>
     */
    private static function buildHeader(Collection $top, Collection $byParent, string $locale): array
    {
        $items = [];

        foreach ($top as $item) {
            $columns = $byParent->get($item->id, collect());

            if ($columns->isNotEmpty()) {
                $group = [
                    'key' => self::keyFor($item),
                    'label' => (string) $item->loc('label', $locale),
                    'matches' => self::matchesFor($item, $byParent),
                    'mega' => true,
                    'columns' => $columns->map(fn (MenuItem $col) => [
                        'title' => (string) $col->loc('label', $locale),
                        'items' => $byParent->get($col->id, collect())
                            ->map(fn (MenuItem $leaf) => self::leaf($leaf, $locale))
                            ->values()
                            ->all(),
                    ])->values()->all(),
                ];

                if ($item->link_type === 'internal' && $item->route) {
                    $group['to'] = $item->route;
                }

                $items[] = $group;

                continue;
            }

            $items[] = [
                'key' => self::keyFor($item),
                'label' => (string) $item->loc('label', $locale),
                'to' => $item->route ?? '/',
                'matches' => self::matchesFor($item, $byParent),
                'direct' => true,
            ];
        }

        return $items;
    }

    /**
     * Footer link columns: [{ title, links: [{label, to?|href?, badge?}] }].
     *
     * @param  Collection<int,MenuItem>  $top
     * @param  Collection<int,Collection<int,MenuItem>>  $byParent
     * @return array<int,array<string,mixed>>
     */
    private static function buildFooter(Collection $top, Collection $byParent, string $locale): array
    {
        return $top->map(fn (MenuItem $col) => [
            'title' => (string) $col->loc('label', $locale),
            'links' => $byParent->get($col->id, collect())
                ->map(fn (MenuItem $leaf) => self::leaf($leaf, $locale))
                ->values()
                ->all(),
        ])->values()->all();
    }

    /**
     * Flat resolved list (rail / bottom_nav): [{label, to?|href?, icon?, badge?}].
     *
     * @param  Collection<int,MenuItem>  $top
     * @return array<int,array<string,mixed>>
     */
    private static function buildFlat(Collection $top, string $locale): array
    {
        return $top->map(function (MenuItem $item) use ($locale) {
            $leaf = self::leaf($item, $locale);
            if ($item->icon) {
                $leaf['icon'] = $item->icon;
            }

            return $leaf;
        })->values()->all();
    }

    /**
     * A NavLeaf: label + `to` (internal) or `href` (external), plus optional `note`
     * (resolved badge — matches the in-memory nav's "Yakında"/"Coming Soon").
     *
     * @return array<string,mixed>
     */
    private static function leaf(MenuItem $item, string $locale): array
    {
        $leaf = ['label' => (string) $item->loc('label', $locale)];

        if ($item->link_type === 'internal') {
            if ($item->route) {
                $leaf['to'] = $item->route;
            }
        } elseif ($item->url) {
            $leaf['href'] = $item->url;
        }

        $badge = $item->loc('badge', $locale);
        if (is_string($badge) && $badge !== '') {
            $leaf['note'] = $badge;
        }

        if (! empty($item->page_types)) {
            $leaf['pageTypes'] = $item->page_types;
        }

        return $leaf;
    }

    /**
     * Active-state paths for a top-level item: stored `matches` if set, otherwise derived
     * from the item's own + every descendant's internal route.
     *
     * @param  Collection<int,Collection<int,MenuItem>>  $byParent
     * @return array<int,string>
     */
    private static function matchesFor(MenuItem $item, Collection $byParent): array
    {
        if (is_array($item->matches) && count($item->matches) > 0) {
            return array_values($item->matches);
        }

        $routes = [];
        if ($item->route) {
            $routes[] = $item->route;
        }

        $stack = [$item->id];
        while ($stack) {
            $parentId = array_pop($stack);
            foreach ($byParent->get($parentId, collect()) as $child) {
                if ($child->link_type === 'internal' && $child->route) {
                    $routes[] = $child->route;
                }
                $stack[] = $child->id;
            }
        }

        return array_values(array_unique($routes));
    }

    private static function keyFor(MenuItem $item): string
    {
        if ($item->key) {
            return $item->key;
        }

        return $item->route
            ? trim($item->route, '/')
            : 'item-'.$item->id;
    }

    public static function flush(): void
    {
        $codes = array_unique(array_merge(LocaleService::codes(), ['tr', 'en']));

        foreach (self::LOCATIONS as $location) {
            foreach ($codes as $code) {
                Cache::forget("menus.{$location}.{$code}");
            }
        }
    }
}
