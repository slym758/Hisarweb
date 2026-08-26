<?php

namespace App\Models;

use App\Models\Concerns\SerializesLocale;
use App\Support\PopupService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

/**
 * An editor-managed pop-up / promo (Faz 6b): the mobile app-promo, plus generic
 * modals/banners/lead widgets (`type`). Copy fields (title/body/cta_label) are per-locale
 * {tr,en,…} maps (spatie/translatable), resolved via loc(). The image resolves through
 * App\Support\Media (uploaded `image_path` wins, else `image_url`). Visibility is scoped by
 * locale-agnostic path globs: `target_routes` (empty = all) minus `suppress_routes`. A popup
 * is live only when active() — `is_active` AND inside its optional [starts_at, ends_at]
 * window. The resolved, cached payload is built by {@see PopupService}; any change here
 * flushes that cache so the frontend never serves stale copy.
 */
class Popup extends Model
{
    use HasTranslations;
    use SerializesLocale;

    protected $guarded = [];

    public array $translatable = ['title', 'body', 'cta_label'];

    protected function casts(): array
    {
        return [
            'target_routes' => 'array',
            'suppress_routes' => 'array',
            'dismiss_days' => 'integer',
            'priority' => 'integer',
            'is_active' => 'boolean',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    /** Live popups only: active flag on and within the optional date window. */
    public function scopeActive(Builder $query): Builder
    {
        return $query
            ->where('is_active', true)
            ->where(fn (Builder $q) => $q->whereNull('starts_at')->orWhere('starts_at', '<=', now()))
            ->where(fn (Builder $q) => $q->whereNull('ends_at')->orWhere('ends_at', '>=', now()));
    }

    protected static function booted(): void
    {
        static::saved(fn () => PopupService::flush());
        static::deleted(fn () => PopupService::flush());
    }
}
