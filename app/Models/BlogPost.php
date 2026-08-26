<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlogPost extends ContentModel
{
    public array $translatable = ['title', 'excerpt', 'body'];

    protected function casts(): array
    {
        return array_merge(parent::casts(), [
            'home_featured' => 'boolean',
        ]);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
