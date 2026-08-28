<?php

namespace App\Models;

use App\Models\Concerns\HasRelatedContent;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hospital extends ContentModel
{
    use HasRelatedContent;

    public array $translatable = [
        'name', 'area', 'phone', 'address', 'about', 'features', 'technologies', 'gallery',
        'transport', 'emergency', 'working_hours',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected function casts(): array
    {
        return array_merge(parent::casts(), [
            'coming_soon' => 'boolean',
        ]);
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(HospitalRoom::class);
    }

    public function doctors(): HasMany
    {
        return $this->hasMany(Doctor::class);
    }

    /**
     * The departments this hospital offers — an explicit editorial choice. When empty, the app
     * falls back to the departments derived from the hospital's doctors (AutoRelatedResolver /
     * the hospital controller). Ordered by the department's canonical order.
     */
    public function departments(): BelongsToMany
    {
        return $this->belongsToMany(Department::class)->orderBy('departments.order_column');
    }
}
