<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A stored public-form submission (the admin inbox). `payload` is the submitted fields
 * (KVKK checkbox and honeypot excluded); `consent_at` is the recorded KVKK explicit
 * consent timestamp.
 */
class FormSubmission extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'consent_at' => 'datetime',
        ];
    }

    public function formDefinition(): BelongsTo
    {
        return $this->belongsTo(FormDefinition::class);
    }
}
