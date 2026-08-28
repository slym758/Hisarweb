<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\Department;
use App\Models\Disease;
use App\Models\Doctor;
use App\Models\EventItem;
use App\Models\FaqCategory;
use App\Models\HealthPackage;
use App\Models\Hospital;
use App\Models\HospitalRoom;
use App\Models\PressItem;
use App\Models\SymptomMap;
use App\Models\Technology;
use App\Models\Treatment;
use App\Models\Video;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Mechanically imports the dummy catalog (exported from resources/js/lib/site-data.ts by
 * scripts/export-catalog.ts → database/seeders/data/site-catalog.json) into the DB, so
 * the DB-backed site renders identically to the in-memory version. Canonical importer:
 * clears content tables first, then inserts. Translatable fields become {tr,en} JSON;
 * temporary Unsplash URLs go into the *_url fallback columns (media library replaces them
 * in Faz 3). Re-runnable.
 */
class SiteCatalogSeeder extends Seeder
{
    /** @var array<string,mixed> */
    private array $data = [];

    /** @var array<string,int> slug => department id */
    private array $deptId = [];

    /** @var array<string,int> slug => hospital id */
    private array $hospId = [];

    public function run(): void
    {
        $path = database_path('seeders/data/site-catalog.json');
        if (! is_file($path)) {
            $this->command?->error("Catalog JSON missing: {$path} — run scripts/export-catalog.ts first.");

            return;
        }
        $this->data = json_decode((string) file_get_contents($path), true);

        DB::transaction(function () {
            $this->clear();
            $this->seedDepartments();
            $this->seedHospitals();
            $this->seedDoctors();
            $this->seedMedical();
            $this->seedContent();
            $this->seedSymptomMaps();
        });

        $this->command?->info('Site catalog seeded from site-data.ts export.');
    }

    /** Delete existing content (children → parents) for a clean canonical import. */
    private function clear(): void
    {
        foreach ([
            'symptom_maps', 'hospital_rooms', 'doctors', 'diseases', 'treatments',
            'technologies', 'blog_posts', 'videos', 'events', 'health_packages',
            'press_items', 'faq_categories', 'quality_certificates', 'hospitals', 'departments',
        ] as $table) {
            DB::table($table)->delete();
        }
    }

    /** Build a {tr,en} translation map for one field across the paired records. */
    private function pair(array $tr, array $en, string $field): array
    {
        return ['tr' => $tr[$field] ?? null, 'en' => $en[$field] ?? null];
    }

    private function seedDepartments(): void
    {
        [$tr, $en] = [$this->data['departments']['tr'], $this->data['departments']['en']];
        foreach ($tr as $i => $r) {
            $d = Department::create([
                'slug' => $r['slug'],
                'name' => $this->pair($tr[$i], $en[$i], 'name'),
                'blurb' => $this->pair($tr[$i], $en[$i], 'blurb'),
                'icon' => $r['icon'] ?? null,
                'pinned' => $r['pinned'] ?? false,
                'about' => $this->pair($tr[$i], $en[$i], 'about'),
                'technologies' => $this->pair($tr[$i], $en[$i], 'technologies'),
                'order_column' => $i,
                'status' => 'published',
                'published_at' => now(),
            ]);
            $this->deptId[$r['slug']] = $d->id;
        }
    }

    private function seedHospitals(): void
    {
        [$tr, $en] = [$this->data['hospitals']['tr'], $this->data['hospitals']['en']];
        foreach ($tr as $i => $r) {
            $h = Hospital::create([
                'slug' => $r['slug'],
                'name' => $this->pair($tr[$i], $en[$i], 'name'),
                'area' => $this->pair($tr[$i], $en[$i], 'area'),
                'phone' => $this->pair($tr[$i], $en[$i], 'phone'),
                'address' => $this->pair($tr[$i], $en[$i], 'address'),
                'coming_soon' => $r['comingSoon'] ?? false,
                'cover_url' => $r['cover'] ?? null,
                'about' => $this->pair($tr[$i], $en[$i], 'about'),
                'features' => $this->pair($tr[$i], $en[$i], 'features'),
                'technologies' => $this->pair($tr[$i], $en[$i], 'technologies'),
                'gallery' => $this->pair($tr[$i], $en[$i], 'gallery'),
                'transport' => $this->pair($tr[$i], $en[$i], 'transport'),
                'emergency' => $this->pair($tr[$i], $en[$i], 'emergency'),
                'working_hours' => $this->pair($tr[$i], $en[$i], 'workingHours'),
                'map_query' => $r['mapQuery'] ?? null,
                'order_column' => $i,
                'status' => 'published',
                'published_at' => now(),
            ]);
            $this->hospId[$r['slug']] = $h->id;

            foreach (($r['rooms'] ?? []) as $j => $room) {
                $enRoom = $en[$i]['rooms'][$j] ?? [];
                HospitalRoom::create([
                    'hospital_id' => $h->id,
                    'name' => ['tr' => $room['name'] ?? null, 'en' => $enRoom['name'] ?? null],
                    'description' => ['tr' => $room['desc'] ?? null, 'en' => $enRoom['desc'] ?? null],
                    'image_url' => $room['image'] ?? null,
                    'order_column' => $j,
                ]);
            }
        }
    }

    private function seedDoctors(): void
    {
        [$tr, $en] = [$this->data['doctors']['tr'], $this->data['doctors']['en']];
        foreach ($tr as $i => $r) {
            Doctor::create([
                'code' => $r['id'],
                'name' => $r['name'],
                'title' => $this->pair($tr[$i], $en[$i], 'title'),
                'bio' => $this->pair($tr[$i], $en[$i], 'bio'),
                'subspecialties' => $this->pair($tr[$i], $en[$i], 'subspecialties'),
                'languages' => $this->pair($tr[$i], $en[$i], 'languages'),
                'cv' => $this->pair($tr[$i], $en[$i], 'cv'),
                'department_id' => $this->deptId[$r['departmentSlug']] ?? null,
                'hospital_id' => $this->hospId[$r['hospitalSlug']] ?? null,
                'email' => $r['email'] ?? null,
                'photo_url' => $r['photo'] ?? null,
                'order_column' => $i,
                'status' => 'published',
                'published_at' => now(),
            ]);
        }
    }

    private function seedMedical(): void
    {
        [$dTr, $dEn] = [$this->data['diseases']['tr'], $this->data['diseases']['en']];
        foreach ($dTr as $i => $r) {
            Disease::create([
                'slug' => $r['slug'],
                'name' => $this->pair($dTr[$i], $dEn[$i], 'name'),
                'summary' => $this->pair($dTr[$i], $dEn[$i], 'summary'),
                'department_id' => $this->deptId[$r['deptSlug']] ?? null,
                'cover_url' => $r['cover'] ?? null,
                'detail' => $this->pair($dTr[$i], $dEn[$i], 'detail'),
                'order_column' => $i,
                'status' => 'published',
                'published_at' => now(),
            ]);
        }

        [$tTr, $tEn] = [$this->data['treatments']['tr'], $this->data['treatments']['en']];
        foreach ($tTr as $i => $r) {
            Treatment::create([
                'slug' => $r['slug'],
                'name' => $this->pair($tTr[$i], $tEn[$i], 'name'),
                'summary' => $this->pair($tTr[$i], $tEn[$i], 'summary'),
                'department_id' => $this->deptId[$r['deptSlug']] ?? null,
                'cover_url' => $r['cover'] ?? null,
                'detail' => $this->pair($tTr[$i], $tEn[$i], 'detail'),
                'order_column' => $i,
                'status' => 'published',
                'published_at' => now(),
            ]);
        }

        [$xTr, $xEn] = [$this->data['technologies']['tr'], $this->data['technologies']['en']];
        foreach ($xTr as $i => $r) {
            Technology::create([
                'slug' => $r['slug'],
                'name' => $this->pair($xTr[$i], $xEn[$i], 'name'),
                'description' => ['tr' => $xTr[$i]['desc'] ?? null, 'en' => $xEn[$i]['desc'] ?? null],
                'cover_url' => $r['cover'] ?? null,
                'detail' => $this->pair($xTr[$i], $xEn[$i], 'detail'),
                'dept_slugs' => $r['deptSlugs'] ?? [],
                'order_column' => $i,
                'status' => 'published',
                'published_at' => now(),
            ]);
        }
    }

    private function seedContent(): void
    {
        [$bTr, $bEn] = [$this->data['blogPosts']['tr'], $this->data['blogPosts']['en']];
        foreach ($bTr as $i => $r) {
            BlogPost::create([
                'slug' => $r['slug'],
                'title' => $this->pair($bTr[$i], $bEn[$i], 'title'),
                'excerpt' => $this->pair($bTr[$i], $bEn[$i], 'excerpt'),
                'department_id' => $this->deptId[$r['category']] ?? null,
                'cover_url' => $r['cover'] ?? null,
                'body' => $this->pair($bTr[$i], $bEn[$i], 'body'),
                'order_column' => $i,
                'status' => 'published',
                'published_at' => $r['date'] ?? now(),
            ]);
        }

        [$vTr, $vEn] = [$this->data['videos']['tr'], $this->data['videos']['en']];
        foreach ($vTr as $i => $r) {
            Video::create([
                'code' => $r['id'],
                'title' => $this->pair($vTr[$i], $vEn[$i], 'title'),
                'youtube_id' => $r['youtubeId'],
                'department_id' => isset($r['deptSlug']) ? ($this->deptId[$r['deptSlug']] ?? null) : null,
                'category' => $this->pair($vTr[$i], $vEn[$i], 'category'),
                'duration' => $r['duration'] ?? null,
                'order_column' => $i,
                'status' => 'published',
                'published_at' => now(),
            ]);
        }

        [$eTr, $eEn] = [$this->data['events']['tr'], $this->data['events']['en']];
        foreach ($eTr as $i => $r) {
            EventItem::create([
                'slug' => $r['slug'],
                'title' => $this->pair($eTr[$i], $eEn[$i], 'title'),
                'excerpt' => $this->pair($eTr[$i], $eEn[$i], 'excerpt'),
                'body' => $this->pair($eTr[$i], $eEn[$i], 'body'),
                'place' => $this->pair($eTr[$i], $eEn[$i], 'place'),
                'starts_at' => $r['date'] ?? null,
                'cover_url' => $r['cover'] ?? null,
                'order_column' => $i,
                'status' => 'published',
                'published_at' => now(),
            ]);
        }

        [$pTr, $pEn] = [$this->data['packages']['tr'], $this->data['packages']['en']];
        foreach ($pTr as $i => $r) {
            HealthPackage::create([
                'slug' => $r['slug'],
                'name' => $this->pair($pTr[$i], $pEn[$i], 'name'),
                'summary' => $this->pair($pTr[$i], $pEn[$i], 'summary'),
                'scope' => $this->pair($pTr[$i], $pEn[$i], 'scope'),
                'cover_url' => $r['cover'] ?? null,
                'order_column' => $i,
                'status' => 'published',
                'published_at' => now(),
            ]);
        }

        [$rTr, $rEn] = [$this->data['press']['tr'], $this->data['press']['en']];
        foreach ($rTr as $i => $r) {
            PressItem::create([
                'slug' => $r['slug'],
                'title' => $this->pair($rTr[$i], $rEn[$i], 'title'),
                'excerpt' => $this->pair($rTr[$i], $rEn[$i], 'excerpt'),
                'source' => $r['source'] ?? null,
                'cover_url' => $r['cover'] ?? null,
                'order_column' => $i,
                'status' => 'published',
                'published_at' => $r['date'] ?? now(),
            ]);
        }

        [$fTr, $fEn] = [$this->data['faq']['tr'], $this->data['faq']['en']];
        foreach ($fTr as $i => $r) {
            FaqCategory::create([
                'slug' => $r['slug'],
                'title' => $this->pair($fTr[$i], $fEn[$i], 'title'),
                'items' => $this->pair($fTr[$i], $fEn[$i], 'items'),
                'order_column' => $i,
                'status' => 'published',
                'published_at' => now(),
            ]);
        }
    }

    private function seedSymptomMaps(): void
    {
        [$tr, $en] = [$this->data['symptomMap']['tr'], $this->data['symptomMap']['en']];
        foreach ($tr as $i => $r) {
            if (! isset($this->deptId[$r['deptSlug']])) {
                continue;
            }
            SymptomMap::create([
                'department_id' => $this->deptId[$r['deptSlug']],
                'label' => $this->pair($tr[$i], $en[$i], 'label'),
                'keywords' => $this->pair($tr[$i], $en[$i], 'keywords'),
                'order_column' => $i,
            ]);
        }
    }
}
