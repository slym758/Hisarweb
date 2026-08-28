<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Department;
use App\Models\Disease;
use App\Models\Doctor;
use App\Models\EventItem;
use App\Models\HealthPackage;
use App\Models\Hospital;
use App\Models\MoralTeamMember;
use App\Models\OncologyGalleryItem;
use App\Models\PressItem;
use App\Models\Technology;
use App\Models\Treatment;
use App\Models\Video;
use App\Support\Media;
use App\Support\PageContentService;
use App\Support\SiteSerializer;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Detail pages, DB-backed. Each loads the full record (locale-resolved via the serializer)
 * and passes it as the `record` prop the page's getXBySlug/getDoctorById reads. An unknown
 * slug/code → firstOrFail() → a real 404.
 */
class SiteContentController extends Controller
{
    public function doctor(string $id): Response
    {
        $d = Doctor::where('code', $id)->published()->with(['department', 'hospital'])->firstOrFail();

        // Related content: manual editorial picks (related_items) override, otherwise auto
        // by the doctor's department. Serialized to the light card shapes the frontend uses;
        // the dept-scoped getters return these slices when the `related` prop is present.
        $related = [
            'treatments' => $d->relatedItems(Treatment::class)
                ->map(fn (Treatment $t) => SiteSerializer::treatmentLight($t))->values()->all(),
            'diseases' => $d->relatedItems(Disease::class)
                ->map(fn (Disease $x) => SiteSerializer::diseaseLight($x))->values()->all(),
            'technologies' => $d->relatedItems(Technology::class)
                ->map(fn (Technology $x) => SiteSerializer::technologyLight($x))->values()->all(),
            'videos' => $d->relatedItems(Video::class)
                ->map(fn (Video $v) => SiteSerializer::videoLight($v))->values()->all(),
            'blogPosts' => $d->relatedItems(BlogPost::class)
                ->map(fn (BlogPost $b) => SiteSerializer::blogLight($b))->values()->all(),
            'press' => $d->relatedItems(PressItem::class)
                ->map(fn (PressItem $p) => SiteSerializer::press($p))->values()->all(),
        ];

        return Inertia::render('site/doktor-detay', [
            'id' => $id,
            'record' => SiteSerializer::doctor($d),
            'related' => $related,
        ]);
    }

    public function department(string $slug): Response
    {
        $d = Department::whereLocalizedSlug($slug)->firstOrFail();

        // "Hangi Hastanelerimizde?": hospitals that explicitly offer this department (the
        // department_hospital pivot, backfilled from doctor assignments). count = doctors of
        // this department at each hospital (the card hides the count line when it is 0).
        $hospitals = $d->hospitals()
            ->where('hospitals.coming_soon', false)
            ->get()
            ->map(fn (Hospital $h) => [
                'hospital' => SiteSerializer::hospitalLight($h),
                'count' => $h->doctors()->where('department_id', $d->id)->count(),
            ])->values()->all();

        return Inertia::render('site/bolum-detay', [
            'slug' => $slug,
            'record' => SiteSerializer::departmentDetail($d),
            'related' => [
                'hospitals' => $hospitals,
                // Manual editorial picks (related_items) override, else auto by this department.
                'doctors' => $d->relatedItems(Doctor::class)
                    ->map(fn (Doctor $x) => SiteSerializer::doctorLight($x))->values()->all(),
                'treatments' => $d->relatedItems(Treatment::class)
                    ->map(fn (Treatment $t) => SiteSerializer::treatmentLight($t))->values()->all(),
                'diseases' => $d->relatedItems(Disease::class)
                    ->map(fn (Disease $x) => SiteSerializer::diseaseLight($x))->values()->all(),
                'technologies' => $d->relatedItems(Technology::class)
                    ->map(fn (Technology $t) => SiteSerializer::technologyLight($t))->values()->all(),
                'videos' => $d->relatedItems(Video::class)
                    ->map(fn (Video $v) => SiteSerializer::videoLight($v))->values()->all(),
                'blogPosts' => $d->relatedItems(BlogPost::class)
                    ->map(fn (BlogPost $b) => SiteSerializer::blogLight($b))->values()->all(),
            ],
        ]);
    }

    public function disease(string $slug): Response
    {
        $x = Disease::whereLocalizedSlug($slug)->published()->with('department')->firstOrFail();

        return Inertia::render('site/hastalik-detay', [
            'slug' => $slug,
            'record' => SiteSerializer::disease($x),
            'related' => [
                'doctors' => $x->relatedItems(Doctor::class)
                    ->map(fn (Doctor $d) => SiteSerializer::doctorLight($d))->values()->all(),
                'treatments' => $x->relatedItems(Treatment::class)
                    ->map(fn (Treatment $t) => SiteSerializer::treatmentLight($t))->values()->all(),
                'technologies' => $x->relatedItems(Technology::class)
                    ->map(fn (Technology $t) => SiteSerializer::technologyLight($t))->values()->all(),
                'blogPosts' => $x->relatedItems(BlogPost::class)
                    ->map(fn (BlogPost $b) => SiteSerializer::blogLight($b))->values()->all(),
            ],
        ]);
    }

    public function treatment(string $slug): Response
    {
        $x = Treatment::whereLocalizedSlug($slug)->published()->with('department')->firstOrFail();

        return Inertia::render('site/tedavi-detay', [
            'slug' => $slug,
            'record' => SiteSerializer::treatment($x),
            'related' => $this->treatmentRelated($x),
        ]);
    }

    public function treatmentMethod(string $slug): Response
    {
        $x = Treatment::whereLocalizedSlug($slug)->published()->with('department')->firstOrFail();

        return Inertia::render('site/tedavi-yontemi-detay', [
            'slug' => $slug,
            'record' => SiteSerializer::treatment($x),
            'related' => $this->treatmentRelated($x),
        ]);
    }

    public function technology(string $slug): Response
    {
        $x = Technology::whereLocalizedSlug($slug)->published()->firstOrFail();

        return Inertia::render('site/teknoloji-detay', [
            'slug' => $slug,
            'record' => SiteSerializer::technology($x),
            'related' => [
                'doctors' => $x->relatedItems(Doctor::class)
                    ->map(fn (Doctor $d) => SiteSerializer::doctorLight($d))->values()->all(),
                'diseases' => $x->relatedItems(Disease::class)
                    ->map(fn (Disease $d) => SiteSerializer::diseaseLight($d))->values()->all(),
                'treatments' => $x->relatedItems(Treatment::class)
                    ->map(fn (Treatment $t) => SiteSerializer::treatmentLight($t))->values()->all(),
                'blogPosts' => $x->relatedItems(BlogPost::class)
                    ->map(fn (BlogPost $b) => SiteSerializer::blogLight($b))->values()->all(),
            ],
        ]);
    }

    public function hospital(string $slug): Response
    {
        $h = Hospital::whereLocalizedSlug($slug)->with('rooms')->firstOrFail();

        // A hospital's departments: the explicit editorial links, else derived from its doctors.
        $deptModels = $h->departments()->exists()
            ? $h->departments()->published()->get()
            : Department::published()
                ->whereIn('id', $h->doctors()->whereNotNull('department_id')->distinct()->pluck('department_id'))
                ->ordered()->get();

        // "Bölümler" + "Tedavi Yöntemleri": manual editorial picks (related_items) override,
        // otherwise auto by the hospital's departments. No irrelevant padding.
        $related = [
            'departments' => $deptModels
                ->map(fn (Department $d) => SiteSerializer::departmentLight($d))->values()->all(),
            'treatments' => $h->relatedItems(Treatment::class, 'related', 6)
                ->map(fn (Treatment $t) => SiteSerializer::treatmentLight($t))->values()->all(),
        ];

        return Inertia::render('site/hastane-detay', [
            'slug' => $slug,
            'record' => SiteSerializer::hospital($h),
            'related' => $related,
        ]);
    }

    /** Manual (else auto-by-department) related content for a treatment detail page. */
    private function treatmentRelated(Treatment $x): array
    {
        return [
            'doctors' => $x->relatedItems(Doctor::class)
                ->map(fn (Doctor $d) => SiteSerializer::doctorLight($d))->values()->all(),
            'diseases' => $x->relatedItems(Disease::class)
                ->map(fn (Disease $d) => SiteSerializer::diseaseLight($d))->values()->all(),
            'technologies' => $x->relatedItems(Technology::class)
                ->map(fn (Technology $t) => SiteSerializer::technologyLight($t))->values()->all(),
            'blogPosts' => $x->relatedItems(BlogPost::class)
                ->map(fn (BlogPost $b) => SiteSerializer::blogLight($b))->values()->all(),
        ];
    }

    public function event(string $slug): Response
    {
        $e = EventItem::whereLocalizedSlug($slug)->published()->firstOrFail();

        return Inertia::render('site/etkinlik-detay', ['slug' => $slug, 'record' => SiteSerializer::event($e)]);
    }

    /**
     * Integrated Oncology overview ("Genel Bakış") — the page's copy tree + the editor-managed
     * "Merkez Turu" gallery (uploadable images with translatable captions). Falls back to the
     * page's bundled gallery when the prop is empty.
     */
    public function oncologyOverview(): Response
    {
        $gallery = OncologyGalleryItem::published()->ordered()->get()
            ->map(fn (OncologyGalleryItem $g) => [
                'image' => Media::url($g->image_path, $g->image_url) ?? '',
                'title' => $g->loc('title') ?? '',
                'desc' => $g->loc('desc') ?? '',
            ])->all();

        return Inertia::render('site/butunlesik-onkoloji', [
            'pageCopy' => (object) PageContentService::copyFor('butunlesik-onkoloji', app()->getLocale()),
            'gallery' => $gallery,
        ]);
    }

    /**
     * Integrated Oncology "Moral Takımı" — editor-managed members (DB) + the page's copy tree.
     * Members carry a resolved role, a portrait, and a visit-photo gallery; the page falls back
     * to its bundled list when this prop is empty (off-site / not yet seeded).
     */
    public function moralTeam(): Response
    {
        $members = MoralTeamMember::published()->ordered()->get()
            ->map(fn (MoralTeamMember $m) => [
                'name' => $m->name,
                'role' => $m->loc('role') ?? '',
                'photo' => Media::url($m->photo_path, $m->photo_url) ?? '',
                'gallery' => collect($m->gallery ?? [])
                    ->map(fn ($g) => Media::url($g))->filter()->values()->all(),
            ])->all();

        return Inertia::render('site/moral-takimi', [
            'pageCopy' => (object) PageContentService::copyFor('moral-takimi', app()->getLocale()),
            'members' => $members,
        ]);
    }

    public function package(string $slug): Response
    {
        $p = HealthPackage::whereLocalizedSlug($slug)->published()->firstOrFail();

        return Inertia::render('site/paket-detay', ['slug' => $slug, 'record' => SiteSerializer::package($p)]);
    }

    public function press(string $slug): Response
    {
        $p = PressItem::whereLocalizedSlug($slug)->published()->firstOrFail();

        return Inertia::render('site/basin-detay', ['slug' => $slug, 'record' => SiteSerializer::press($p)]);
    }
}
