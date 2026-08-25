<?php

namespace App\Models;

class EventItem extends ContentModel
{
    protected $table = 'events';

    public array $translatable = ['title', 'excerpt', 'body', 'place'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected function casts(): array
    {
        return array_merge(parent::casts(), [
            'starts_at' => 'date',
        ]);
    }
}
