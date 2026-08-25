<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SymptomMap extends ContentModel
{
    public array $translatable = ['label', 'keywords'];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
