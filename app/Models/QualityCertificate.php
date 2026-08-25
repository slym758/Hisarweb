<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QualityCertificate extends ContentModel
{
    public array $translatable = ['name', 'issuer'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected function casts(): array
    {
        return array_merge(parent::casts(), [
            'issued_at' => 'date',
            'valid_until' => 'date',
        ]);
    }

    public function hospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class);
    }
}
