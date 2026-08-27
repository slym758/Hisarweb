<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Full application seed for a fresh install. Run once after `php artisan migrate`:
 *
 *     php artisan migrate
 *     php artisan db:seed
 *     php artisan storage:link   # so uploaded media resolves
 *
 * Order matters (dependencies noted below). Most seeders are idempotent (updateOrCreate /
 * exists-guarded) and safe to re-run.
 *
 * ⚠️ SiteCatalogSeeder is INITIAL-IMPORT ONLY: it clears + reimports the content catalog from
 * database/seeders/data/site-catalog.json. NEVER run it (or a blind `db:seed`) on a database
 * that already holds real editor content — it would overwrite it. For a fresh machine it's
 * exactly what you want.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // A default local login (idempotent). The real admin comes from SampleFilamentDataSeeder
        // or `php artisan make:filament-user`.
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')],
        );

        // 1) Foundation — languages/locales must exist before locale-aware content.
        $this->call(LanguageSeeder::class);

        // 2) Core content catalog (departments, doctors, hospitals, diseases, treatments,
        //    technologies, blog, events, packages, press, faq, videos, symptom maps) + relations.
        //    SiteCatalogSeeder is initial-import-only (see class note above).
        $this->call(SiteCatalogSeeder::class);
        $this->call(RelationSeeder::class);     // pivots + related_items — needs the catalog

        // 3) Site chrome & configuration.
        $this->call(SiteSettingsSeeder::class);
        $this->call(MenuSeeder::class);
        $this->call(FooterLegalMenuSeeder::class);
        $this->call(SliderSeeder::class);
        $this->call(FormDefinitionSeeder::class);

        // 4) Pages: SEO records → editable copy tree → admin management titles.
        $this->call(PageSeeder::class);
        $this->call(PageCopySeeder::class);     // needs pages; reads data/page-copy.json
        $this->call(PageTitleSeeder::class);    // needs pages + copy

        // 5) Campaigns & popups.
        $this->call(CampaignSeeder::class);
        $this->call(PopupSeeder::class);

        // 6) Homepage & oncology managed content (all exists-guarded / idempotent).
        $this->call(QualityCertificateSeeder::class);
        $this->call(HomeCenterSeeder::class);
        $this->call(MoralTeamSeeder::class);
        $this->call(OncologyGallerySeeder::class);

        // 7) Admin users / roles / organization (AAuth).
        $this->call(SampleFilamentDataSeeder::class);
    }
}
