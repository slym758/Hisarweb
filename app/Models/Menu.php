<?php

namespace App\Models;

use App\Support\MenuService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A site navigation menu, identified by its `location` (header, footer, rail,
 * bottom_nav). Its {@see MenuItem} tree is resolved and cached by {@see MenuService};
 * any change here flushes that cache. Fixed set of rows — the admin edits items, not
 * menus.
 */
class Menu extends Model
{
    protected $guarded = [];

    public function items(): HasMany
    {
        return $this->hasMany(MenuItem::class)->orderBy('sort_order');
    }

    /** Top-level items (roots of the tree) — used by the admin repeater. */
    public function topItems(): HasMany
    {
        return $this->hasMany(MenuItem::class)->whereNull('parent_id')->orderBy('sort_order');
    }

    protected static function booted(): void
    {
        static::saved(fn () => MenuService::flush());
        static::deleted(fn () => MenuService::flush());
    }
}
