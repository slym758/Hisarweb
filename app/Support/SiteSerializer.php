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
            'photo' => $d->photo_url,
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
            'cover' => $x->cover_url ?? '',
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
            'cover' => $x->cover_url ?? '',
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
            'cover' => $x->cover_url ?? '',
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
            'cover' => $h->cover_url ?? '',
            'comingSoon' => (bool) $h->coming_soon,
            'detail' => [
                'about' => $h->loc('about') ?? [],
                'features' => $h->loc('features') ?? [],
                'technologies' => $h->loc('technologies') ?? [],
                'gallery' => $h->loc('gallery') ?? [],
                'rooms' => $h->rooms->map(fn ($r) => [
                    'name' => $r->loc('name'),
                    'desc' => $r->loc('description') ?? '',
                    'image' => $r->image_url ?? '',
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
        $technologies = $d->loc('technologies');

        if (empty($about) && empty($technologies)) {
            return null;
        }

        return [
            'about' => $about ?? [],
            'technologies' => $technologies ?? [],
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
            'cover' => $e->cover_url ?? '',
        ];
    }

    public static function package(HealthPackage $p): array
    {
        return [
            'slug' => $p->slug,
            'name' => $p->loc('name'),
            'summary' => $p->loc('summary') ?? '',
            'scope' => $p->loc('scope') ?? [],
            'cover' => $p->cover_url ?? '',
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
            'cover' => $p->cover_url ?? '',
        ];
    }
}
