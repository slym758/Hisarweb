<?php

namespace App\Support;

use App\Models\Slide;
use App\Models\Slider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

/**
 * Cached, locale-resolved source of truth for admin-managed sliders/banners.
 *
 * `forPlacement('home_hero', $locale)` returns EXACTLY the shape the frontend Hero expects:
 *   { autoplay: bool, interval_ms: int, slides: [{ image, mobileImage, position,
 *     mobilePosition, href, eyebrow, title, mobileTitle, desc, mobileDesc }] }
 * Only active slides within their date window are included, ordered by `sort_order`. Images
 * resolve via {@see Media::url()} (uploaded path wins, else URL). Returns null when the
 * placement has no active slider or no active slides, so the frontend falls back to its
 * in-memory hero.
 *
 * Cached per placement+locale; flushed on any {@see Slider}/{@see Slide} change.
 * Defensive: before the tables exist (fresh install / migrating) it returns null.
 */
class SliderService
{
    /** @return array<string,mixed>|null */
    public static function forPlacement(string $placement, string $locale): ?array
    {
        if (! Schema::hasTable('sliders') || ! Schema::hasTable('slides')) {
            return null;
        }

        return Cache::rememberForever(
            "sliders.{$placement}.{$locale}",
            fn () => self::build($placement, $locale)
        );
    }

    /** @return array<string,mixed>|null */
    private static function build(string $placement, string $locale): ?array
    {
        $slider = Slider::query()
            ->where('placement', $placement)
            ->where('is_active', true)
            ->first();

        if (! $slider) {
            return null;
        }

        $now = now();

        $slides = $slider->slides()
            ->where('is_active', true)
            ->where(fn ($q) => $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now))
            ->where(fn ($q) => $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now))
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Slide $slide) => [
                'image' => Media::url($slide->image_path, $slide->image_url),
                'mobileImage' => Media::url($slide->mobile_image_path, $slide->mobile_image_url),
                'position' => $slide->position,
                'mobilePosition' => $slide->mobile_position,
                'href' => $slide->link,
                'eyebrow' => $slide->loc('eyebrow', $locale),
                'title' => $slide->loc('title', $locale),
                'mobileTitle' => $slide->loc('mobile_title', $locale),
                'desc' => $slide->loc('desc', $locale),
                'mobileDesc' => $slide->loc('mobile_desc', $locale),
            ])
            ->values()
            ->all();

        if (count($slides) === 0) {
            return null;
        }

        return [
            'autoplay' => (bool) $slider->autoplay,
            'interval_ms' => (int) $slider->interval_ms,
            'slides' => $slides,
        ];
    }

    public static function flush(): void
    {
        $placements = Schema::hasTable('sliders')
            ? Slider::query()->distinct()->pluck('placement')->all()
            : [];
        $placements = array_unique(array_merge($placements, ['home_hero']));

        $codes = array_unique(array_merge(LocaleService::codes(), ['tr', 'en']));

        foreach ($placements as $placement) {
            foreach ($codes as $code) {
                Cache::forget("sliders.{$placement}.{$code}");
            }
        }
    }
}
