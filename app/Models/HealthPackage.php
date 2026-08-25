<?php

namespace App\Models;

class HealthPackage extends ContentModel
{
    public array $translatable = ['name', 'summary', 'scope'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
