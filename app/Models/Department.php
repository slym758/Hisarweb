<?php

namespace App\Models;

use App\Models\Concerns\HasRelatedContent;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends ContentModel
{
    use HasRelatedContent;

    public array $translatable = ['name', 'blurb', 'about', 'technologies'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected function casts(): array
    {
        return array_merge(parent::casts(), [
            'pinned' => 'boolean',
        ]);
    }

    public function doctors(): HasMany
    {
        return $this->hasMany(Doctor::class);
    }

    public function diseases(): HasMany
    {
        return $this->hasMany(Disease::class);
    }

    public function treatments(): HasMany
    {
        return $this->hasMany(Treatment::class);
    }

    public function blogPosts(): HasMany
    {
        return $this->hasMany(BlogPost::class);
    }

    public function videos(): HasMany
    {
        return $this->hasMany(Video::class);
    }

    public function symptomMaps(): HasMany
    {
        return $this->hasMany(SymptomMap::class);
    }

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class)
            ->withPivot('position')
            ->orderByPivot('position');
    }

    /** Hospitals that offer this department (inverse of {@see Hospital::departments()}). */
    public function hospitals(): BelongsToMany
    {
        return $this->belongsToMany(Hospital::class)->orderBy('hospitals.order_column');
    }
}
