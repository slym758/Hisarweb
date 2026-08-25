<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Doctor extends ContentModel
{
    public array $translatable = ['title', 'bio', 'subspecialties', 'languages', 'cv'];

    /** Public route key stays `code` (d1…) so existing /doktor/{id} URLs are unchanged. */
    public function getRouteKeyName(): string
    {
        return 'code';
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function hospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class);
    }
}
