<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Disease extends ContentModel
{
    public array $translatable = ['name', 'summary', 'detail'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
