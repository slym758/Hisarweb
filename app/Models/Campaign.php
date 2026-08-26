<?php

namespace App\Models;

use App\Models\Concerns\SerializesLocale;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;
use Spatie\Translatable\HasTranslations;

/**
 * A time-boxed marketing landing page served at /kampanya/{slug}. Copy fields
 * (title/subtitle/body/cta_label/seo_title/seo_description) are per-locale {tr,en,…}
 * maps (spatie/translatable), resolved via loc(). The hero image resolves through
 * App\Support\Media (uploaded `hero_image_path` wins, else `hero_image_url`). Ordered
 * via `sort_order` (eloquent-sortable). A campaign is public only when active() —
 * `is_active` AND inside its optional [starts_at, ends_at] window.
 */
class Campaign extends Model implements Sortable
{
    use HasTranslations;
    use SerializesLocale;
    use SortableTrait;

    protected $guarded = [];

    public array $translatable = ['title', 'subtitle', 'body', 'cta_label', 'seo_title', 'seo_description'];

    public array $sortable = [
        'order_column_name' => 'sort_order',
        'sort_when_creating' => true,
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    /** Live campaigns only: active flag on and within the optional date window. */
    public function scopeActive(Builder $query): Builder
    {
        return $query
            ->where('is_active', true)
            ->where(fn (Builder $q) => $q->whereNull('starts_at')->orWhere('starts_at', '<=', now()))
            ->where(fn (Builder $q) => $q->whereNull('ends_at')->orWhere('ends_at', '>=', now()));
    }
}
