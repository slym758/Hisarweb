<?php

namespace App\Models;

use App\Models\Concerns\SerializesLocale;
use App\Support\PageContentService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Translatable\HasTranslations;

/**
 * One addressable block of page copy, keyed by (`page_slug`, `section`, `key`). `value`
 * is a translatable {tr,en,…} map — usually a string (text/richtext) but may hold a list
 * or link/image structure per `type`. Belongs to a {@see Page} by `page_slug`. Read
 * (cached, locale-resolved) via {@see PageContentService}; any change here flushes that
 * cache. When a key is missing the frontend `useContent()` hook falls back to inline COPY.
 */
class PageContent extends Model
{
    use HasTranslations;
    use SerializesLocale;

    protected $guarded = [];

    public array $translatable = ['value'];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'page_slug', 'slug');
    }

    protected static function booted(): void
    {
        static::saved(fn () => PageContentService::flush());
        static::deleted(fn () => PageContentService::flush());
    }
}
