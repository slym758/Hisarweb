<?php

namespace App\Models\Concerns;

use App\Support\LocaleService;

/**
 * Reads a translatable attribute for a locale, walking the admin-defined fallback chain
 * (e.g. ar → en → tr) and returning the first non-empty value — regardless of whether
 * the value is a string or an array/object. Use `loc('name')` when serializing to the
 * frontend so the resolved value matches the active locale (or its best fallback).
 *
 * Requires spatie/laravel-translatable's HasTranslations on the model.
 */
trait SerializesLocale
{
    public function loc(string $attribute, ?string $locale = null): mixed
    {
        $locale ??= app()->getLocale();

        foreach (array_merge([$locale], LocaleService::fallbackChain($locale)) as $code) {
            $value = $this->getTranslation($attribute, $code, false);
            if ($value !== null && $value !== '' && $value !== []) {
                return $value;
            }
        }

        // Last resort: spatie's own fallback (config app.fallback_locale / tr).
        return $this->getTranslation($attribute, $locale, true);
    }
}
