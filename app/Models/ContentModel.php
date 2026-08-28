<?php

namespace App\Models;

use App\Models\Concerns\HasPublishing;
use App\Models\Concerns\SerializesLocale;
use App\Support\CatalogService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;
use Spatie\Translatable\HasTranslations;

/**
 * Base for editor-managed content entities: per-field {tr,en,…} translations
 * (spatie/translatable), drag ordering via `order_column` (eloquent-sortable), a
 * draft/published scope, and a locale-resolving `loc()` helper. Concrete models declare
 * their own `$translatable` list, `casts()` and relations.
 */
abstract class ContentModel extends Model implements Sortable
{
    use HasPublishing;
    use HasTranslations;
    use SerializesLocale;
    use SortableTrait;

    protected $guarded = [];

    public array $sortable = [
        'order_column_name' => 'order_column',
        'sort_when_creating' => true,
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'slug_i18n' => 'array',
        ];
    }

    /**
     * The slug for a locale: the per-language override (slug_i18n[$locale]) when set, otherwise
     * the canonical slug. Used for building localized URLs and serialized output.
     */
    public function localizedSlug(?string $locale = null): ?string
    {
        $locale = $locale ?: app()->getLocale();
        $map = $this->slug_i18n ?? [];

        return (is_array($map) && ! empty($map[$locale])) ? $map[$locale] : ($this->slug ?? null);
    }

    /** Match a record by either its canonical slug or its localized slug for the given locale. */
    public function scopeWhereLocalizedSlug(Builder $query, string $slug, ?string $locale = null): Builder
    {
        $locale = $locale ?: app()->getLocale();

        return $query->where(function (Builder $w) use ($slug, $locale) {
            $w->where('slug', $slug)
                ->orWhereRaw('slug_i18n ->> ? = ?', [$locale, $slug]);
        });
    }

    protected static function booted(): void
    {
        // Any content edit invalidates the cached light catalog shared to the frontend.
        static::saved(fn () => CatalogService::flush());
        static::deleted(fn () => CatalogService::flush());
    }
}
