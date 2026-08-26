<?php

namespace App\Models;

use App\Models\Concerns\HasRelatedContent;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Technology extends ContentModel
{
    use HasRelatedContent;

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

    public function departments(): BelongsToMany
    {
        return $this->belongsToMany(Department::class)
            ->withPivot('position')
            ->orderByPivot('position');
    }
}
