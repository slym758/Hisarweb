<?php

namespace App\Models\Concerns;

/**
 * Reads a translatable attribute for a locale with fallback, regardless of whether the
 * value is a string or an array/object. Use `loc('name')` when serializing to the
 * frontend so the resolved value always matches the active locale (or its fallback).
 *
 * Requires spatie/laravel-translatable's HasTranslations on the model.
 */
trait SerializesLocale
{
    public function loc(string $attribute, ?string $locale = null): mixed
    {
        return $this->getTranslation($attribute, $locale ?? app()->getLocale(), true);
    }
}
