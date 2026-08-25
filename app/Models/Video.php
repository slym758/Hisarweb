<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Video extends ContentModel
{
    public array $translatable = ['title', 'category'];

    /** Keyed by `code` (v1…); no public detail route. */
    public function getRouteKeyName(): string
    {
        return 'code';
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
