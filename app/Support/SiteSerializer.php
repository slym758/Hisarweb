<?php

namespace App\Support;

use App\Models\BlogPost;
use App\Models\Department;
use App\Models\Disease;
use App\Models\Doctor;
use App\Models\EventItem;
use App\Models\HealthPackage;
use App\Models\Hospital;
use App\Models\PressItem;
use App\Models\Technology;
use App\Models\Treatment;
use App\Models\Video;

/**
 * Serializes a full content record (with its nested detail/cv, locale-resolved via loc())
 * into the exact shape the frontend `site-data.ts` types expect. Detail pages pass this as
 * the `record` Inertia prop; the matching getXBySlug/getDoctorById returns it.
 */
class SiteSerializer
{
    /** @var array<string, array<string, string>> locale → (canonical dept slug → localized slug) */
    private static array $deptSlugCache = [];

    /**
     * Translate an array of canonical department slugs to their localized slugs for the active
     * locale (so technology dept references match the localized department slugs). Cached.
     *
     * @param  array<int, string>  $slugs
     * @return array<int, string>
     */
    private static function localizedDeptSlugs(array $slugs): array
    {
        if (empty($slugs)) {
            return [];
        }

        $locale = app()->getLocale();
        $map = self::$deptSlugCache[$locale] ?? [];

        if (array_diff($slugs, array_keys($map))) {
            foreach (Department::whereIn('slug', $slugs)->get() as $d) {
                $map[$d->slug] = $d->localizedSlug($locale);
            }
            self::$deptSlugCache[$locale] = $map;
        }

        return array_map(fn ($s) => $map[$s] ?? $s, $slugs);
    }

    /* ── "Light" card shapes (no heavy detail) for related-content sections. Mirror the
       CatalogService list shapes so the frontend related cards render identically. ── */

    public static function treatmentLight(Treatment $x): array
    {
        return [
            'slug' => $x->localizedSlug(),
            'name' => $x->loc('name'),
            'summary' => $x->loc('summary') ?? '',
            'department' => $x->department?->loc('name') ?? '',
            'deptSlug' => $x->department?->localizedSlug() ?? '',
            'cover' => Media::url($x->cover_path, $x->cover_url) ?? '',
        ];
    }

    public static function diseaseLight(Disease $x): array
    {
        return [
            'slug' => $x->localizedSlug(),
            'name' => $x->loc('name'),
            'summary' => $x->loc('summary') ?? '',
            'deptSlug' => $x->department?->localizedSlug() ?? '',
            'cover' => Media::url($x->cover_path, $x->cover_url) ?? '',
        ];
    }

    public static function technologyLight(Technology $x): array
    {
        return [
            'slug' => $x->localizedSlug(),
            'name' => $x->loc('name'),
            'desc' => $x->loc('description') ?? '',
            'deptSlugs' => self::localizedDeptSlugs($x->dept_slugs ?? []),
            'cover' => Media::url($x->cover_path, $x->cover_url) ?? '',
        ];
    }

    public static function hospitalLight(Hospital $h): array
    {
        return [
            'slug' => $h->localizedSlug(),
            'name' => $h->loc('name'),
            'area' => $h->loc('area') ?? '',
            'phone' => $h->loc('phone') ?? '',
            'address' => $h->loc('address') ?? '',
            'cover' => Media::url($h->cover_path, $h->cover_url) ?? '',
            'comingSoon' => (bool) $h->coming_soon,
        ];
    }

    public static function departmentLight(Department $d): array
    {
        return [
            'slug' => $d->localizedSlug(),
            'name' => $d->loc('name'),
            'blurb' => $d->loc('blurb') ?? '',
            'icon' => $d->icon,                       // lucide name string → iconFor() on the client
            'iconImage' => Media::url($d->icon_path),  // uploaded custom icon (wins over lucide)
            'pinned' => (bool) $d->pinned,
        ];
    }

    public static function doctorLight(Doctor $d): array
    {
        return [
            'id' => $d->code,
            'name' => $d->loc('name'),
            'title' => $d->loc('title') ?? '',
            'department' => $d->department?->loc('name') ?? '',
            'departmentSlug' => $d->department?->localizedSlug() ?? '',
            'hospitalSlug' => $d->hospital?->localizedSlug() ?? '',
            'hospitalSlugs' => $d->hospitals->map(fn (Hospital $h) => $h->localizedSlug())->values()->all(),
            'photo' => Media::url($d->photo_path, $d->photo_url),
            'subspecialties' => $d->loc('subspecialties') ?? [],
        ];
    }

    public static function blogLight(BlogPost $b): array
    {
        return [
            'slug' => $b->localizedSlug(),
            'title' => $b->loc('title'),
            'excerpt' => $b->loc('excerpt') ?? '',
            'category' => $b->department?->localizedSlug() ?? '',
            'cover' => Media::url($b->cover_path, $b->cover_url) ?? '',
            'date' => $b->published_at?->toDateString() ?? '',
        ];
    }

    public static function videoLight(Video $v): array
    {
        return [
            'id' => $v->code,
            'title' => $v->loc('title'),
            'youtubeId' => $v->youtube_id,
            'deptSlug' => $v->department?->localizedSlug(),
            'category' => $v->loc('category') ?? '',
            'duration' => $v->duration ?? '',
        ];
    }

    public static function doctor(Doctor $d): array
    {
        return [
            'id' => $d->code,
            'name' => $d->loc('name'),
            'title' => $d->loc('title') ?? '',
            'bio' => $d->loc('bio') ?? '',
            'department' => $d->department?->loc('name') ?? '',
            'departmentSlug' => $d->department?->localizedSlug() ?? '',
            'hospitalSlug' => $d->hospital?->localizedSlug() ?? '',
            'hospitalSlugs' => $d->hospitals->map(fn (Hospital $h) => $h->localizedSlug())->values()->all(),
            'photo' => Media::url($d->photo_path, $d->photo_url),
            'subspecialties' => $d->loc('subspecialties') ?? [],
            'email' => $d->email,
            'languages' => $d->loc('languages') ?? [],
            'cv' => $d->loc('cv') ?: null,
            'appointmentUrl' => $d->appointment_url ?: null,
            'appointmentNote' => $d->loc('appointment_note') ?: null,
        ];
    }

    public static function disease(Disease $x): array
    {
        return [
            'slug' => $x->localizedSlug(),
            'name' => $x->loc('name'),
            'summary' => $x->loc('summary') ?? '',
            'deptSlug' => $x->department?->localizedSlug() ?? '',
            'cover' => Media::url($x->cover_path, $x->cover_url) ?? '',
            'detail' => $x->loc('detail') ?: null,
        ];
    }

    public static function treatment(Treatment $x): array
    {
        return [
            'slug' => $x->localizedSlug(),
            'name' => $x->loc('name'),
            'summary' => $x->loc('summary') ?? '',
            'department' => $x->department?->loc('name') ?? '',
            'deptSlug' => $x->department?->localizedSlug() ?? '',
            'cover' => Media::url($x->cover_path, $x->cover_url) ?? '',
            'detail' => $x->loc('detail') ?: null,
        ];
    }

    public static function technology(Technology $x): array
    {
        return [
            'slug' => $x->localizedSlug(),
            'name' => $x->loc('name'),
            'desc' => $x->loc('description') ?? '',
            'deptSlugs' => self::localizedDeptSlugs($x->dept_slugs ?? []),
            'cover' => Media::url($x->cover_path, $x->cover_url) ?? '',
            'detail' => $x->loc('detail') ?: null,
        ];
    }

    public static function hospital(Hospital $h): array
    {
        // Gallery: caption from the active locale, image from the default locale (authored once):
        // an uploaded image_path wins over a plain image URL.
        $galActive = $h->loc('gallery') ?? [];
        $galDefault = $h->getTranslation('gallery', LocaleService::default(), false) ?? [];
        $gallery = [];
        foreach ($galActive as $i => $g) {
            $d = $galDefault[$i] ?? [];
            $gallery[] = [
                'image' => Media::url($d['image_path'] ?? null, $g['image'] ?? ($d['image'] ?? null)) ?? '',
                'caption' => $g['caption'] ?? '',
            ];
        }

        return [
            'slug' => $h->localizedSlug(),
            'name' => $h->loc('name'),
            'area' => $h->loc('area') ?? '',
            'phone' => $h->loc('phone') ?? '',
            'address' => $h->loc('address') ?? '',
            'cover' => Media::url($h->cover_path, $h->cover_url) ?? '',
            'comingSoon' => (bool) $h->coming_soon,
            'detail' => [
                'about' => $h->loc('about') ?? [],
                'features' => $h->loc('features') ?? [],
                'technologies' => $h->loc('technologies') ?? [],
                'gallery' => $gallery,
                'rooms' => $h->rooms->map(fn ($r) => [
                    'name' => $r->loc('name'),
                    'desc' => $r->loc('description') ?? '',
                    'image' => Media::url($r->image_path, $r->image_url) ?? '',
                ])->all(),
                'transport' => $h->loc('transport') ?? [],
                'emergency' => $h->loc('emergency') ?? '',
                'workingHours' => $h->loc('working_hours') ?? '',
                'mapQuery' => $h->map_query ?? '',
            ],
        ];
    }

    public static function departmentDetail(Department $d): ?array
    {
        $about = $d->loc('about');
        $techActive = $d->loc('technologies') ?? [];
        $techDefault = $d->getTranslation('technologies', LocaleService::default(), false) ?? [];

        if (empty($about) && empty($techActive)) {
            return null;
        }

        $technologies = [];
        foreach ($techActive as $i => $item) {
            $technologies[] = [
                'name' => $item['name'] ?? '',
                'desc' => $item['desc'] ?? '',
                // Image is authored once in the default-locale tab; fall back to it.
                'image' => Media::url($item['image'] ?? ($techDefault[$i]['image'] ?? null)),
            ];
        }

        return [
            'about' => $about ?? [],
            'technologies' => $technologies,
        ];
    }

    public static function event(EventItem $e): array
    {
        return [
            'slug' => $e->localizedSlug(),
            'title' => $e->loc('title'),
            'excerpt' => $e->loc('excerpt') ?? '',
            'body' => $e->loc('body') ?? '',
            'date' => $e->starts_at?->toDateString() ?? '',
            'place' => $e->loc('place') ?? '',
            'cover' => Media::url($e->cover_path, $e->cover_url) ?? '',
        ];
    }

    public static function package(HealthPackage $p): array
    {
        return [
            'slug' => $p->localizedSlug(),
            'name' => $p->loc('name'),
            'summary' => $p->loc('summary') ?? '',
            'scope' => $p->loc('scope') ?? [],
            'cover' => Media::url($p->cover_path, $p->cover_url) ?? '',
        ];
    }

    public static function press(PressItem $p): array
    {
        return [
            'slug' => $p->localizedSlug(),
            'title' => $p->loc('title'),
            'excerpt' => $p->loc('excerpt') ?? '',
            'source' => $p->source ?? '',
            'date' => $p->published_at?->toDateString() ?? '',
            'cover' => Media::url($p->cover_path, $p->cover_url) ?? '',
        ];
    }
}
