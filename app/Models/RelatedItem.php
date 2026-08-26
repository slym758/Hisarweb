<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * Editorial link between a source content record and a target content record under a
 * named `relation`. Rows are authored in Filament (the "İlgili İçerikler" sections) and,
 * when present, override the automatic same-department resolution on detail pages.
 *
 * @property string $source_type
 * @property int $source_id
 * @property string $target_type
 * @property int $target_id
 * @property string $relation
 * @property int $position
 */
class RelatedItem extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'source_id' => 'integer',
            'target_id' => 'integer',
            'position' => 'integer',
        ];
    }

    public function source(): MorphTo
    {
        return $this->morphTo();
    }

    public function target(): MorphTo
    {
        return $this->morphTo();
    }
}
