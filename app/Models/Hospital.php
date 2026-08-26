<?php

namespace App\Models;

use App\Models\Concerns\HasRelatedContent;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hospital extends ContentModel
{
    use HasRelatedContent;

    public array $translatable = [
        'name', 'area', 'address', 'about', 'features', 'technologies', 'gallery',
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
}
