<?php

namespace App\Models;

use App\Models\Concerns\SerializesLocale;
use App\Support\SliderService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;
use Spatie\Translatable\HasTranslations;

/**
 * A single slide within a {@see Slider}. Copy fields (eyebrow/title/mobile_title/desc/
 * mobile_desc) are per-locale {tr,en,…} maps (spatie/translatable). Ordered within its
 * slider via `sort_order` (eloquent-sortable). Images resolve through App\Support\Media
 * (uploaded `*_path` wins, else `*_url`). Only active slides inside their date window are
 * shown. Resolved to the frontend shape by {@see SliderService}; edits flush its cache.
 */
class Slide extends Model implements Sortable
{
    use HasTranslations;
    use SerializesLocale;
    use SortableTrait;

    protected $guarded = [];

    public array $translatable = ['eyebrow', 'title', 'mobile_title', 'desc', 'mobile_desc'];

    // Ordering is driven explicitly (Filament repeater / seeder), scoped per slider.
    public array $sortable = [
        'order_column_name' => 'sort_order',
        'sort_when_creating' => false,
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    public function slider(): BelongsTo
    {
        return $this->belongsTo(Slider::class);
    }

    /** Keep sort numbering independent per slider. */
    public function buildSortQuery(): Builder
    {
        return static::query()->where('slider_id', $this->slider_id);
    }

    protected static function booted(): void
    {
        static::saved(fn () => SliderService::flush());
        static::deleted(fn () => SliderService::flush());
    }
}
