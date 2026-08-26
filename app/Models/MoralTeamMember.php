<?php

namespace App\Models;

class MoralTeamMember extends ContentModel
{
    public array $translatable = ['role'];

    protected function casts(): array
    {
        return array_merge(parent::casts(), [
            'gallery' => 'array',
        ]);
    }
}
