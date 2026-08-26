<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Disease;
use App\Models\Doctor;
use App\Models\EventItem;
use App\Models\HealthPackage;
use App\Models\Hospital;
use App\Models\MoralTeamMember;
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
        ];

        return Inertia::render('site/doktor-detay', [
            'id' => $id,
            'record' => SiteSerializer::doctor($d),
            'related' => $related,
        ]);
    }

    public function department(string $slug): Response
    {
        $d = Department::where('slug', $slug)->firstOrFail();

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
            'related' => ['hospitals' => $hospitals],
        ]);
    }

    public function disease(string $slug): Response
    {
        $x = Disease::where('slug', $slug)->published()->with('department')->firstOrFail();

        return Inertia::render('site/hastalik-detay', ['slug' => $slug, 'record' => SiteSerializer::disease($x)]);
    }

    public function treatment(string $slug): Response
    {
        $x = Treatment::where('slug', $slug)->published()->with('department')->firstOrFail();

        return Inertia::render('site/tedavi-detay', ['slug' => $slug, 'record' => SiteSerializer::treatment($x)]);
    }

    public function treatmentMethod(string $slug): Response
    {
        $x = Treatment::where('slug', $slug)->published()->with('department')->firstOrFail();

        return Inertia::render('site/tedavi-yontemi-detay', ['slug' => $slug, 'record' => SiteSerializer::treatment($x)]);
    }

    public function technology(string $slug): Response
    {
        $x = Technology::where('slug', $slug)->published()->firstOrFail();

        return Inertia::render('site/teknoloji-detay', ['slug' => $slug, 'record' => SiteSerializer::technology($x)]);
    }

    public function hospital(string $slug): Response
    {
        $h = Hospital::where('slug', $slug)->with('rooms')->firstOrFail();

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

    public function event(string $slug): Response
    {
        $e = EventItem::where('slug', $slug)->published()->firstOrFail();

        return Inertia::render('site/etkinlik-detay', ['slug' => $slug, 'record' => SiteSerializer::event($e)]);
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
        $p = HealthPackage::where('slug', $slug)->published()->firstOrFail();

        return Inertia::render('site/paket-detay', ['slug' => $slug, 'record' => SiteSerializer::package($p)]);
    }

    public function press(string $slug): Response
    {
        $p = PressItem::where('slug', $slug)->published()->firstOrFail();

        return Inertia::render('site/basin-detay', ['slug' => $slug, 'record' => SiteSerializer::press($p)]);
    }
}
