<?php

namespace App\Models;

class PressItem extends ContentModel
{
    public array $translatable = ['title', 'excerpt'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
