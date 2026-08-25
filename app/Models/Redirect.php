<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A single old-path → new-path redirect (default 301), applied by a middleware.
 */
class Redirect extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'status_code' => 'integer',
            'hits' => 'integer',
        ];
    }
}
