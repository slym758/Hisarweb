<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Disease;
use App\Models\Doctor;
use App\Models\Hospital;
use App\Models\SymptomMap;
use App\Models\Technology;
use App\Models\Treatment;
use App\Support\LocaleService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * DB-backed site search for the header SearchOverlay (Faz 8). Replaces the frontend's
 * in-memory filter + duplicated SYMPTOM_MAP with a single Postgres-powered endpoint.
 *
 * Matching is typo-tolerant: for each entity the active locale's name/title column is
 * matched with unaccent + ILIKE (substring) OR pg_trgm similarity (fuzzy), and the
 * default-locale column is tried too so Turkish content is still found from an English UI.
 * Results are ranked ILIKE-hits first, then by similarity, and capped per group.
 *
 * `to` paths are LOCALE-AGNOSTIC (e.g. /bolum/<slug>); the frontend localizes them.
 */
class SearchController extends Controller
{
    /** Max items returned per result group. */
    private const LIMIT = 5;

    /** pg_trgm similarity floor for a fuzzy (non-substring) match. */
    private const SIM_THRESHOLD = 0.3;

    public function index(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        $locale = (string) $request->query('locale', app()->getLocale());
        if (! LocaleService::isSupported($locale)) {
            $locale = LocaleService::default();
        }
        $default = LocaleService::default();

        // Guard: too-short queries never hit the DB.
        if (mb_strlen($q) < 2) {
            return response()->json([
                'query' => $q,
                'empty' => true,
                'emptyMessage' => $this->pick($this->emptyMessages(), $locale),
                'groups' => [],
            ]);
        }

        $groups = array_values(array_filter([
            $this->group('symptom', $this->symptomItems($q, $locale, $default), $locale),
            $this->group('departments', $this->departmentItems($q, $locale, $default), $locale),
            $this->group('doctors', $this->doctorItems($q, $locale, $default), $locale),
            $this->group('treatments', $this->treatmentItems($q, $locale, $default), $locale),
            $this->group('diseases', $this->diseaseItems($q, $locale, $default), $locale),
            $this->group('technologies', $this->technologyItems($q, $locale, $default), $locale),
            $this->group('hospitals', $this->hospitalItems($q, $locale, $default), $locale),
        ], fn ($g) => $g !== null));

        return response()->json([
            'query' => $q,
            'empty' => $groups === [],
            'emptyMessage' => $this->pick($this->emptyMessages(), $locale),
            'groups' => $groups,
        ]);
    }

    /* ─────────────────────────  ENTITY GROUPS  ───────────────────────── */

    /** Symptom / condition → department. Deduped by department. */
    private function symptomItems(string $q, string $locale, string $default): array
    {
        $rows = $this->run(
            SymptomMap::query()->with('department'),
            array_merge(
                $this->tcols('label', $locale, $default),
                $this->tcols('keywords', $locale, $default),
            ),
            $q,
        );

        $items = [];
        $seen = [];
        foreach ($rows as $sm) {
            $dept = $sm->department;
            if (! $dept || isset($seen[$dept->slug])) {
                continue;
            }
            $seen[$dept->slug] = true;
            $items[] = [
                'label' => $dept->loc('name', $locale),
                'to' => '/bolum/'.$dept->slug,
                'meta' => $this->pick($this->relatedDeptLabels(), $locale),
            ];
        }

        return $items;
    }

    private function departmentItems(string $q, string $locale, string $default): array
    {
        $rows = $this->run(
            Department::query()->published(),
            array_merge(
                $this->tcols('name', $locale, $default),
                $this->tcols('blurb', $locale, $default),
            ),
            $q,
        );

        return $rows->map(fn (Department $d) => [
            'label' => $d->loc('name', $locale),
            'to' => '/bolum/'.$d->slug,
            'meta' => $this->clip($d->loc('blurb', $locale)),
        ])->all();
    }

    private function doctorItems(string $q, string $locale, string $default): array
    {
        $rows = $this->run(
            Doctor::query()->published()->with('department'),
            array_merge(
                ['name'], // proper noun — plain (same across locales)
                $this->tcols('title', $locale, $default),
            ),
            $q,
        );

        return $rows->map(fn (Doctor $d) => [
            'label' => $d->name,
            'to' => '/doktor/'.$d->code,
            'meta' => $d->department?->loc('name', $locale) ?: $d->loc('title', $locale),
        ])->all();
    }

    private function treatmentItems(string $q, string $locale, string $default): array
    {
        $rows = $this->run(
            Treatment::query()->published()->with('department'),
            array_merge(
                $this->tcols('name', $locale, $default),
                $this->tcols('summary', $locale, $default),
            ),
            $q,
        );

        return $rows->map(fn (Treatment $t) => [
            'label' => $t->loc('name', $locale),
            'to' => '/tedavi/'.$t->slug,
            'meta' => $t->department?->loc('name', $locale),
        ])->all();
    }

    private function diseaseItems(string $q, string $locale, string $default): array
    {
        $rows = $this->run(
            Disease::query()->published()->with('department'),
            array_merge(
                $this->tcols('name', $locale, $default),
                $this->tcols('summary', $locale, $default),
            ),
            $q,
        );

        return $rows->map(fn (Disease $d) => [
            'label' => $d->loc('name', $locale),
            'to' => '/hastalik/'.$d->slug,
            'meta' => $d->department?->loc('name', $locale),
        ])->all();
    }

    private function technologyItems(string $q, string $locale, string $default): array
    {
        $rows = $this->run(
            Technology::query()->published(),
            array_merge(
                $this->tcols('name', $locale, $default),
                $this->tcols('description', $locale, $default),
            ),
            $q,
        );

        return $rows->map(fn (Technology $t) => [
            'label' => $t->loc('name', $locale),
            'to' => '/teknoloji/'.$t->slug,
        ])->all();
    }

    /** Hospitals have no draft/published gate in search — include all. */
    private function hospitalItems(string $q, string $locale, string $default): array
    {
        $rows = $this->run(
            Hospital::query(),
            array_merge(
                $this->tcols('name', $locale, $default),
                $this->tcols('area', $locale, $default),
            ),
            $q,
        );

        return $rows->map(fn (Hospital $h) => [
            'label' => $h->loc('name', $locale),
            'to' => '/hastane/'.$h->slug,
            'meta' => $h->loc('area', $locale),
        ])->all();
    }

    /* ─────────────────────────  QUERY ENGINE  ───────────────────────── */

    /**
     * Apply the typo-tolerant WHERE + ranking to a builder over the given SQL text
     * expressions and return the top rows. Expressions and column names are trusted
     * (whitelisted locale codes / hardcoded columns); only the query string is bound.
     *
     * @param  array<int,string>  $exprs  SQL fragments yielding searchable text
     */
    private function run(Builder $query, array $exprs, string $q): Collection
    {
        $exprs = array_values(array_unique($exprs));
        $like = '%'.$this->escapeLike($q).'%';

        $wheres = [];
        $whereBindings = [];
        $rankExprs = [];
        $rankBindings = [];
        $ilikeExprs = [];
        $ilikeBindings = [];

        foreach ($exprs as $e) {
            $wheres[] = "unaccent(lower(({$e}))) like unaccent(lower(?))";
            $whereBindings[] = $like;
            $wheres[] = "similarity(lower(({$e})), lower(?)) > ?";
            $whereBindings[] = $q;
            $whereBindings[] = self::SIM_THRESHOLD;

            $rankExprs[] = "coalesce(similarity(lower(({$e})), lower(?)), 0)";
            $rankBindings[] = $q;

            $ilikeExprs[] = "(unaccent(lower(({$e}))) like unaccent(lower(?)))::int";
            $ilikeBindings[] = $like;
        }

        return $query
            ->whereRaw('('.implode(' or ', $wheres).')', $whereBindings)
            ->orderByRaw('greatest('.implode(', ', $ilikeExprs).') desc', $ilikeBindings)
            ->orderByRaw('greatest('.implode(', ', $rankExprs).') desc', $rankBindings)
            ->limit(self::LIMIT)
            ->get();
    }

    /**
     * The locale + default-locale JSON text expressions for a translatable column,
     * e.g. name → ["name->>'en'", "name->>'tr'"].
     *
     * @return array<int,string>
     */
    private function tcols(string $column, string $locale, string $default): array
    {
        return array_values(array_unique([
            "{$column}->>'{$locale}'",
            "{$column}->>'{$default}'",
        ]));
    }

    private function escapeLike(string $value): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $value);
    }

    /* ─────────────────────────  LABELS  ───────────────────────── */

    /**
     * @param  array<int,array{label:string,to:string,meta?:?string}>  $items
     * @return array{type:string,label:string,items:array}|null
     */
    private function group(string $type, array $items, string $locale): ?array
    {
        if ($items === []) {
            return null;
        }

        return [
            'type' => $type,
            'label' => $this->pick($this->groupLabels()[$type], $locale),
            'items' => $items,
        ];
    }

    /** @return array<string,array<string,string>> */
    private function groupLabels(): array
    {
        return [
            'symptom' => ['tr' => 'Belirti / hastalık → bölüm', 'en' => 'Symptom / condition → department'],
            'departments' => ['tr' => 'Bölümler', 'en' => 'Departments'],
            'doctors' => ['tr' => 'Doktorlar', 'en' => 'Doctors'],
            'treatments' => ['tr' => 'Tedavi yöntemleri', 'en' => 'Treatment methods'],
            'diseases' => ['tr' => 'Hastalıklar', 'en' => 'Diseases'],
            'technologies' => ['tr' => 'Teknolojiler', 'en' => 'Technologies'],
            'hospitals' => ['tr' => 'Hastaneler', 'en' => 'Hospitals'],
        ];
    }

    /** @return array<string,string> */
    private function relatedDeptLabels(): array
    {
        return ['tr' => 'ilgili bölüm', 'en' => 'related department'];
    }

    /** @return array<string,string> */
    private function emptyMessages(): array
    {
        return ['tr' => 'Sonuç bulunamadı.', 'en' => 'No results found.'];
    }

    /**
     * Pick a localized string, walking the admin-defined fallback chain, then en/tr.
     *
     * @param  array<string,string>  $map
     */
    private function pick(array $map, string $locale): string
    {
        foreach (array_merge([$locale], LocaleService::fallbackChain($locale), ['en', 'tr']) as $code) {
            if (isset($map[$code]) && $map[$code] !== '') {
                return $map[$code];
            }
        }

        return (string) (reset($map) ?: '');
    }

    /** Clip a possibly-long value to a compact one-line meta string. */
    private function clip(mixed $value, int $max = 90): ?string
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        return mb_strlen($value) > $max ? mb_substr($value, 0, $max - 1).'…' : $value;
    }
}
