<?php

namespace App\Models;

use App\Support\LocaleService;
use Illuminate\Database\Eloquent\Model;

/**
 * A site language. Managed by the admin; read everywhere via {@see LocaleService}
 * (which caches the active set). The cache is flushed automatically on any change here.
 */
class Language extends Model
{
    protected $fillable = [
        'code', 'name', 'native_name', 'is_active', 'is_default', 'is_rtl',
        'fallback_code', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_default' => 'boolean',
            'is_rtl' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        // Keep the cached locale set in sync with edits from the admin panel.
        static::saved(fn () => LocaleService::flush());
        static::deleted(fn () => LocaleService::flush());
    }
}
