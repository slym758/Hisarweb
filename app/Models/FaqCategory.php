<?php

namespace App\Models;

class FaqCategory extends ContentModel
{
    public array $translatable = ['title', 'items'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
