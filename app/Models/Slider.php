<?php

namespace App\Models;

use App\Support\SliderService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A media slider/banner, identified by its `placement` (e.g. home_hero). Its ordered
 * {@see Slide} set is resolved and cached by {@see SliderService}; any change here flushes
 * that cache. The admin edits sliders and their slides; the frontend falls back to its
 * in-memory hero when a placement has no active slides.
 */
class Slider extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'autoplay' => 'boolean',
            'interval_ms' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function slides(): HasMany
    {
        return $this->hasMany(Slide::class)->orderBy('sort_order');
    }

    protected static function booted(): void
    {
        static::saved(fn () => SliderService::flush());
        static::deleted(fn () => SliderService::flush());
    }
}
