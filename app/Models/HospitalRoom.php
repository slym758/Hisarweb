<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HospitalRoom extends ContentModel
{
    public array $translatable = ['name', 'description'];

    public function hospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class);
    }
}
