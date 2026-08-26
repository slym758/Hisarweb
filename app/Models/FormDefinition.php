<?php

namespace App\Models;

use Database\Seeders\FormDefinitionSeeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;
use Spatie\Translatable\HasTranslations;

/**
 * Admin-managed configuration for a single public form (see the `key` values seeded by
 * {@see FormDefinitionSeeder}). Translatable text (title, KVKK notice,
 * success/error messages, optional subject list) is stored as a {tr,en,…} map;
 * `recipients` is a plain array of e-mail addresses. Rows are looked up by `key` at
 * submit time; the resolved row is cached and flushed whenever a definition is saved.
 */
class FormDefinition extends Model
{
    use HasTranslations;

    protected $guarded = [];

    public array $translatable = ['title', 'subjects', 'kvkk_text', 'success_message', 'error_message'];

    protected function casts(): array
    {
        return [
            'recipients' => 'array',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saved(fn (FormDefinition $d) => Cache::forget(self::cacheKey($d->key)));
        static::deleted(fn (FormDefinition $d) => Cache::forget(self::cacheKey($d->key)));
    }

    /**
     * Resolve an active definition by key, cached forever (flushed on save). Returns null
     * for an unknown or inactive key.
     */
    public static function active(string $key): ?self
    {
        return Cache::rememberForever(
            self::cacheKey($key),
            fn () => self::query()->where('key', $key)->where('is_active', true)->first()
        );
    }

    private static function cacheKey(string $key): string
    {
        return "form_definition.{$key}";
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(FormSubmission::class);
    }
}
