<?php

namespace App\Models;

use App\Models\Concerns\SerializesLocale;
use App\Support\MenuService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

/**
 * A single navigation entry in a {@see Menu}. Nestable via `parent_id` (header: group →
 * column → leaf). `label` and `badge` are per-locale {tr,en,…} maps (spatie/translatable).
 * `column_group` marks a mega-menu column header. `link_type` picks `route` (internal
 * Link) or `url` (external href). `matches` are active-state paths for a group.
 * Resolved to the frontend NavItem shape by {@see MenuService}; edits flush its cache.
 */
class MenuItem extends Model
{
    use HasTranslations;
    use SerializesLocale;

    protected $guarded = [];

    public array $translatable = ['label', 'badge'];

    protected function casts(): array
    {
        return [
            'matches' => 'array',
            'column_group' => 'bool',
            'is_active' => 'bool',
        ];
    }

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }

    protected static function booted(): void
    {
        // Children created via the admin `children` repeater only get `parent_id`; inherit
        // the parent's `menu_id` so the item stays part of the menu tree.
        static::saving(function (MenuItem $item): void {
            if ($item->parent_id && ! $item->menu_id) {
                $item->menu_id = static::query()->whereKey($item->parent_id)->value('menu_id');
            }
        });

        static::saved(fn () => MenuService::flush());
        static::deleted(fn () => MenuService::flush());
    }
}
