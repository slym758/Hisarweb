<?php

namespace App\Support;

use App\Models\BlogPost;
use App\Models\Department;
use App\Models\Disease;
use App\Models\Doctor;
use App\Models\EventItem;
use App\Models\FaqCategory;
use App\Models\HealthPackage;
use App\Models\HomeCenter;
use App\Models\Hospital;
use App\Models\PressItem;
use App\Models\QualityCertificate;
use App\Models\SymptomMap;
use App\Models\Technology;
use App\Models\Treatment;
use App\Models\Video;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

/**
 * Builds the "light" content catalog (lists for index pages, header search, related
 * content and dept-scoped getters) resolved to a locale, mirroring the shapes the
 * frontend `site-data.ts` types expect. Heavy nested data (detail/cv/body/gallery/rooms)
 * is intentionally excluded — detail pages load a single full record via their controller.
 *
 * Cached per locale; flushed on any content-model change (see ContentModel::booted()).
 */
class CatalogService
{
    /** @return array<string,mixed> */
    public static function forLocale(string $locale): array
    {
        if (! Schema::hasTable('departments')) {
            return [];
        }

        return Cache::rememberForever("catalog.{$locale}", fn () => self::build($locale));
    }

    /** @return array<string,mixed> */
    private static function build(string $locale): array
    {
        $L = fn ($model, string $attr) => $model->loc($attr, $locale);

        $departments = Department::published()->ordered()->get();
        $deptNames = [];
        foreach ($departments as $d) {
            $deptNames[$d->slug] = $L($d, 'name');
        }

        return [
            'departments' => $departments->map(fn (Department $d) => [
                'slug' => $d->slug,
                'name' => $L($d, 'name'),
                'blurb' => $L($d, 'blurb') ?? '',
                'icon' => $d->icon,           // lucide name string → iconFor() on the client
                'iconImage' => Media::url($d->icon_path), // uploaded custom icon (wins over lucide)
                'pinned' => (bool) $d->pinned,
            ])->all(),

            'hospitals' => Hospital::ordered()->get()->map(fn (Hospital $h) => [
                'slug' => $h->slug,
                'name' => $L($h, 'name'),
                'area' => $L($h, 'area') ?? '',
                'phone' => $L($h, 'phone') ?? '',
                'address' => $L($h, 'address') ?? '',
                'cover' => Media::url($h->cover_path, $h->cover_url) ?? '',
                'comingSoon' => (bool) $h->coming_soon,
            ])->all(),

            'doctors' => Doctor::published()->ordered()->with(['department:id,slug', 'hospital:id,slug'])->get()
                ->map(fn (Doctor $d) => [
                    'id' => $d->code,
                    'name' => $d->name,
                    'title' => $L($d, 'title') ?? '',
                    'bio' => $L($d, 'bio') ?? '',
                    'department' => $deptNames[$d->department?->slug] ?? '',
                    'departmentSlug' => $d->department?->slug ?? '',
                    'hospitalSlug' => $d->hospital?->slug ?? '',
                    'photo' => Media::url($d->photo_path, $d->photo_url),
                    'subspecialties' => $L($d, 'subspecialties') ?? [],
                    'email' => $d->email,
                    'languages' => $L($d, 'languages') ?? [],
                ])->all(),

            'diseases' => Disease::published()->ordered()->with('department:id,slug')->get()
                ->map(fn (Disease $x) => [
                    'slug' => $x->slug,
                    'name' => $L($x, 'name'),
                    'summary' => $L($x, 'summary') ?? '',
                    'deptSlug' => $x->department?->slug ?? '',
                    'cover' => Media::url($x->cover_path, $x->cover_url) ?? '',
                ])->all(),

            'treatments' => Treatment::published()->ordered()->with('department:id,slug')->get()
                ->map(fn (Treatment $x) => [
                    'slug' => $x->slug,
                    'name' => $L($x, 'name'),
                    'summary' => $L($x, 'summary') ?? '',
                    'department' => $deptNames[$x->department?->slug] ?? '',
                    'deptSlug' => $x->department?->slug ?? '',
                    'cover' => Media::url($x->cover_path, $x->cover_url) ?? '',
                ])->all(),

            'technologies' => Technology::published()->ordered()->get()
                ->map(fn (Technology $x) => [
                    'slug' => $x->slug,
                    'name' => $L($x, 'name'),
                    'desc' => $L($x, 'description') ?? '',
                    'deptSlugs' => $x->dept_slugs ?? [],
                    'cover' => Media::url($x->cover_path, $x->cover_url) ?? '',
                ])->all(),

            'videos' => Video::published()->ordered()->with('department:id,slug')->get()
                ->map(fn (Video $v) => [
                    'id' => $v->code,
                    'title' => $L($v, 'title'),
                    'youtubeId' => $v->youtube_id,
                    'deptSlug' => $v->department?->slug,
                    'category' => $L($v, 'category') ?? '',
                    'duration' => $v->duration ?? '',
                ])->all(),

            'blogPosts' => BlogPost::published()->ordered()->with('department:id,slug')->get()
                ->map(fn (BlogPost $b) => [
                    'slug' => $b->slug,
                    'title' => $L($b, 'title'),
                    'excerpt' => $L($b, 'excerpt') ?? '',
                    'category' => $b->department?->slug ?? '',
                    'cover' => Media::url($b->cover_path, $b->cover_url) ?? '',
                    'date' => $b->published_at?->toDateString() ?? '',
                    'body' => $L($b, 'body') ?: null,
                    'homeFeatured' => (bool) $b->home_featured,
                ])->all(),

            'events' => EventItem::published()->ordered()->get()
                ->map(fn (EventItem $e) => [
                    'slug' => $e->slug,
                    'title' => $L($e, 'title'),
                    'excerpt' => $L($e, 'excerpt') ?? '',
                    'body' => $L($e, 'body') ?? '',
                    'date' => $e->starts_at?->toDateString() ?? '',
                    'place' => $L($e, 'place') ?? '',
                    'cover' => Media::url($e->cover_path, $e->cover_url) ?? '',
                ])->all(),

            'packages' => HealthPackage::published()->ordered()->get()
                ->map(fn (HealthPackage $p) => [
                    'slug' => $p->slug,
                    'name' => $L($p, 'name'),
                    'summary' => $L($p, 'summary') ?? '',
                    'scope' => $L($p, 'scope') ?? [],
                    'cover' => Media::url($p->cover_path, $p->cover_url) ?? '',
                ])->all(),

            'press' => PressItem::published()->ordered()->get()
                ->map(fn (PressItem $p) => [
                    'slug' => $p->slug,
                    'title' => $L($p, 'title'),
                    'excerpt' => $L($p, 'excerpt') ?? '',
                    'source' => $p->source ?? '',
                    'date' => $p->published_at?->toDateString() ?? '',
                    'cover' => Media::url($p->cover_path, $p->cover_url) ?? '',
                ])->all(),

            'faq' => FaqCategory::published()->ordered()->get()
                ->map(fn (FaqCategory $f) => [
                    'slug' => $f->slug,
                    'title' => $L($f, 'title'),
                    'items' => $L($f, 'items') ?? [],
                ])->all(),

            'homeCenters' => HomeCenter::published()->ordered()->get()
                ->map(fn (HomeCenter $m) => [
                    'name' => $L($m, 'name'),
                    'desc' => $L($m, 'desc') ?? '',
                    'accent' => $L($m, 'accent') ?? '',
                    'href' => $m->link ?: '/tedavi-yontemleri',
                    'image' => Media::url($m->image_path, $m->image_url) ?? '',
                ])->all(),

            'qualityCertificates' => QualityCertificate::published()->ordered()->get()
                ->map(fn (QualityCertificate $q) => [
                    'key' => $q->slug,
                    'title' => $L($q, 'name'),
                    'note' => $L($q, 'issuer') ?? '',
                    'alt' => $L($q, 'name'),
                    'img' => Media::url($q->logo_path ?? $q->cover_path, $q->logo_url ?? $q->cover_url),
                ])->all(),

            'symptomMap' => SymptomMap::ordered()->with('department:id,slug')->get()
                ->map(fn (SymptomMap $s) => [
                    'deptSlug' => $s->department?->slug ?? '',
                    'label' => $L($s, 'label'),
                    'keywords' => $L($s, 'keywords') ?? [],
                ])->all(),
        ];
    }

    public static function flush(): void
    {
        foreach (LocaleService::codes() as $code) {
            Cache::forget("catalog.{$code}");
        }
    }
}
