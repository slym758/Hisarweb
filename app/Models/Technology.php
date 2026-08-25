<?php

namespace App\Models;

class Technology extends ContentModel
{
    public array $translatable = ['name', 'description', 'detail'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected function casts(): array
    {
        return array_merge(parent::casts(), [
            // Plain (non-translatable) array preserved for the Faz 2 department_technology pivot.
            'dept_slugs' => 'array',
        ]);
    }
}
