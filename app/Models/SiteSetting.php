<?php

namespace App\Models;

use App\Support\SettingsService;
use Illuminate\Database\Eloquent\Model;

/**
 * A single site setting (key → value). `value` may be a scalar or a translatable
 * {tr,en,…} map. Managed from the admin "Site Ayarları" page; read everywhere via
 * {@see SettingsService} (which caches the whole set). The cache is flushed
 * automatically on any change here.
 */
class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    protected $casts = [
        'value' => 'array',
    ];

    protected static function booted(): void
    {
        static::saved(fn () => SettingsService::flush());
        static::deleted(fn () => SettingsService::flush());
    }
}
