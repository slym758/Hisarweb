<?php

namespace App\Models;

use App\Models\Concerns\SerializesLocale;
use App\Support\PageContentService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

/**
 * An editable public page (one per route). `slug` is the route key; `title` is the admin
 * label; `seo_title`/`seo_description` + og image drive the page's `<Head>` meta. All three
 * text attributes are translatable {tr,en,…} maps. Its body copy is the {@see PageContent}
 * set (linked by `page_slug`). Read (cached, locale-resolved) via {@see PageContentService};
 * any change here flushes that cache. Empty rows → the frontend keeps its inline COPY.
 */
class Page extends Model
{
    use HasTranslations;
    use SerializesLocale;

    protected $guarded = [];

    public array $translatable = ['title', 'seo_title', 'seo_description', 'copy'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function contents(): HasMany
    {
        return $this->hasMany(PageContent::class, 'page_slug', 'slug')->orderBy('sort_order');
    }

    protected static function booted(): void
    {
        static::saved(fn () => PageContentService::flush());
        static::deleted(fn () => PageContentService::flush());
    }
}
