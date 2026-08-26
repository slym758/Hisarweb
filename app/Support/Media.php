<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

/**
 * Resolves a stored image reference to a usable URL. Admin uploads store a `public`-disk
 * path (e.g. "dept-tech/uuid.jpg"); seeded content stores a full Unsplash URL. This turns
 * a disk path into `/storage/...`, passes absolute URLs (http/https or root-relative)
 * through unchanged, and falls back to `$fallback` when empty.
 */
class Media
{
    public static function url(?string $value, ?string $fallback = null): ?string
    {
        if ($value === null || $value === '') {
            return $fallback;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://') || str_starts_with($value, '/')) {
            return $value;
        }

        return Storage::disk('public')->url($value);
    }
}
