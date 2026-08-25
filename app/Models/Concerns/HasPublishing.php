<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

/**
 * Draft/published workflow. `published()` limits a query to live records. Draft records
 * are only visible in the admin.
 */
trait HasPublishing
{
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }
}
