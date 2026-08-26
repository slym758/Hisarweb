<?php

namespace App\Models;

use App\Models\Concerns\HasPublishing;
use App\Models\Concerns\SerializesLocale;
use App\Support\CatalogService;
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
        ];
    }

    protected static function booted(): void
    {
        // Any content edit invalidates the cached light catalog shared to the frontend.
        static::saved(fn () => CatalogService::flush());
        static::deleted(fn () => CatalogService::flush());
    }
}
