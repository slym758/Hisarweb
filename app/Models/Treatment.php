<?php

namespace App\Models;

use App\Models\Concerns\HasRelatedContent;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Treatment extends ContentModel
{
    use HasRelatedContent;

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
