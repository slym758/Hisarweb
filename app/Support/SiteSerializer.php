<?php

namespace App\Support;

use App\Models\Department;
use App\Models\Disease;
use App\Models\Doctor;
use App\Models\EventItem;
use App\Models\HealthPackage;
use App\Models\Hospital;
use App\Models\PressItem;
use App\Models\Technology;
use App\Models\Treatment;

/**
 * Serializes a full content record (with its nested detail/cv, locale-resolved via loc())
 * into the exact shape the frontend `site-data.ts` types expect. Detail pages pass this as
 * the `record` Inertia prop; the matching getXBySlug/getDoctorById returns it.
 */
class SiteSerializer
{
    public static function doctor(Doctor $d): array
    {
        return [
            'id' => $d->code,
            'name' => $d->name,
            'title' => $d->loc('title') ?? '',
            'bio' => $d->loc('bio') ?? '',
            'department' => $d->department?->loc('name') ?? '',
            'departmentSlug' => $d->department?->slug ?? '',
            'hospitalSlug' => $d->hospital?->slug ?? '',
            'photo' => Media::url($d->photo_path, $d->photo_url),
            'subspecialties' => $d->loc('subspecialties') ?? [],
            'email' => $d->email,
            'languages' => $d->loc('languages') ?? [],
            'cv' => $d->loc('cv') ?: null,
        ];
    }

    public static function disease(Disease $x): array
    {
        return [
            'slug' => $x->slug,
            'name' => $x->loc('name'),
            'summary' => $x->loc('summary') ?? '',
            'deptSlug' => $x->department?->slug ?? '',
            'cover' => Media::url($x->cover_path, $x->cover_url) ?? '',
            'detail' => $x->loc('detail') ?: null,
        ];
    }

    public static function treatment(Treatment $x): array
    {
        return [
            'slug' => $x->slug,
            'name' => $x->loc('name'),
            'summary' => $x->loc('summary') ?? '',
            'department' => $x->department?->loc('name') ?? '',
            'deptSlug' => $x->department?->slug ?? '',
            'cover' => Media::url($x->cover_path, $x->cover_url) ?? '',
            'detail' => $x->loc('detail') ?: null,
        ];
    }

    public static function technology(Technology $x): array
    {
        return [
            'slug' => $x->slug,
            'name' => $x->loc('name'),
            'desc' => $x->loc('description') ?? '',
            'deptSlugs' => $x->dept_slugs ?? [],
            'cover' => Media::url($x->cover_path, $x->cover_url) ?? '',
            'detail' => $x->loc('detail') ?: null,
        ];
    }

    public static function hospital(Hospital $h): array
    {
        return [
            'slug' => $h->slug,
            'name' => $h->loc('name'),
            'area' => $h->loc('area') ?? '',
            'phone' => $h->phone ?? '',
            'address' => $h->loc('address') ?? '',
            'cover' => Media::url($h->cover_path, $h->cover_url) ?? '',
            'comingSoon' => (bool) $h->coming_soon,
            'detail' => [
                'about' => $h->loc('about') ?? [],
                'features' => $h->loc('features') ?? [],
                'technologies' => $h->loc('technologies') ?? [],
                'gallery' => $h->loc('gallery') ?? [],
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
            'slug' => $e->slug,
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
            'slug' => $p->slug,
            'name' => $p->loc('name'),
            'summary' => $p->loc('summary') ?? '',
            'scope' => $p->loc('scope') ?? [],
            'cover' => Media::url($p->cover_path, $p->cover_url) ?? '',
        ];
    }

    public static function press(PressItem $p): array
    {
        return [
            'slug' => $p->slug,
            'title' => $p->loc('title'),
            'excerpt' => $p->loc('excerpt') ?? '',
            'source' => $p->source ?? '',
            'date' => $p->published_at?->toDateString() ?? '',
            'cover' => Media::url($p->cover_path, $p->cover_url) ?? '',
        ];
    }
}
