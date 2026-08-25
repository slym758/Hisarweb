<?php

namespace App\Models;

use App\Models\Concerns\SerializesLocale;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Spatie\Translatable\HasTranslations;

/**
 * Per-record SEO metadata, attached polymorphically to any content model or page.
 */
class SeoMeta extends Model
{
    use HasTranslations;
    use SerializesLocale;

    protected $table = 'seo_meta';

    protected $guarded = [];

    public array $translatable = ['meta_title', 'meta_description'];

    protected function casts(): array
    {
        return [
            'noindex' => 'boolean',
        ];
    }

    public function seoable(): MorphTo
    {
        return $this->morphTo();
    }
}
