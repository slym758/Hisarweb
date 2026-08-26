<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\PageContent;
use Illuminate\Database\Seeder;

/**
 * Registers the editable pages and, for the three EXAMPLE pages (kurumsal, vizyon-misyon,
 * kalite-calismalari), transcribes their current inline COPY into `page_contents` so those
 * pages demonstrably render from the DB while staying visually identical.
 *
 * Idempotent + non-destructive:
 *   - pages: updateOrCreate by slug, with an admin `title` label but EMPTY SEO (the editor
 *     fills SEO later) — re-running never wipes editor SEO edits (only the label is set).
 *   - page_contents: seeded ONLY when a (page_slug, section, key) row is absent, so editor
 *     copy edits are never overwritten on re-run.
 */
class PageSeeder extends Seeder
{
    /**
     * Editable pages: slug => bilingual admin label. Empty SEO is filled by the editor later.
     */
    private const PAGES = [
        'home' => ['tr' => 'Ana Sayfa', 'en' => 'Home'],
        'kurumsal' => ['tr' => 'Kurumsal', 'en' => 'Corporate'],
        'vizyon-misyon' => ['tr' => 'Vizyonumuz ve Misyonumuz', 'en' => 'Vision & Mission'],
        'kalite-calismalari' => ['tr' => 'Kalite Çalışmaları', 'en' => 'Quality Work'],
        'hastanelerimiz' => ['tr' => 'Hastanelerimiz', 'en' => 'Our Hospitals'],
        'doktorlarimiz' => ['tr' => 'Doktorlarımız', 'en' => 'Our Doctors'],
        'bolumlerimiz' => ['tr' => 'Bölümlerimiz', 'en' => 'Our Departments'],
        'hastaliklar' => ['tr' => 'Hastalıklar', 'en' => 'Diseases'],
        'tedavi-yontemleri' => ['tr' => 'Tedavi Yöntemleri', 'en' => 'Treatments'],
        'teknolojilerimiz' => ['tr' => 'Teknolojilerimiz', 'en' => 'Our Technologies'],
        'saglikli-hayat-rehberi' => ['tr' => 'Sağlıklı Hayat Rehberi', 'en' => 'Healthy Life Guide'],
        'etkinlikler' => ['tr' => 'Etkinlikler', 'en' => 'Events'],
        'paketler' => ['tr' => 'Check-Up Paketleri', 'en' => 'Check-Up Packages'],
        'videolar' => ['tr' => 'Videolar', 'en' => 'Videos'],
        'basinda-hastanemiz' => ['tr' => 'Basında Hastanemiz', 'en' => 'In the Press'],
        'iletisim' => ['tr' => 'İletişim', 'en' => 'Contact'],
        'insan-kaynaklari' => ['tr' => 'İnsan Kaynakları', 'en' => 'Human Resources'],
        'randevu-al' => ['tr' => 'Randevu Al', 'en' => 'Get an Appointment'],
    ];

    /**
     * Body copy transcribed from the 3 example pages' inline COPY (top sections only).
     * Shape: page_slug => [ [section, key, type, {tr,en}], ... ] in display order.
     */
    private const CONTENT = [
        'kurumsal' => [
            ['about', 'badge', 'text', ['tr' => 'Hakkımızda', 'en' => 'About Us']],
            ['about', 'title', 'text', [
                'tr' => 'Hayat boyu sağlık anlayışıyla yanınızdayız',
                'en' => 'By your side with a lifelong health approach',
            ]],
            ['about', 'p1', 'richtext', [
                'tr' => 'Hisar Hospital Intercontinental olarak ilk önceliğimiz her zaman hastalarımızı sağlığına kavuşturmaktır. Hastalarımızı ve onların değerli ailelerini hastanemizin kapısından girdikleri ilk andan itibaren tedavi ve sonrasındaki süreçlerinde özenle dinliyor; konfor ve memnuniyetlerini arttırmak için elimizden gelen tüm çabayı gösteriyoruz.',
                'en' => 'As Hisar Hospital Intercontinental, our first priority is always to restore our patients to health. From the very first moment our patients and their valued families step through our doors, we listen to them carefully throughout treatment and the processes that follow; we make every effort to increase their comfort and satisfaction.',
            ]],
            ['about', 'p2', 'richtext', [
                'tr' => 'Modern teknolojiyi akademik kadromuz ve hasta odaklı hizmet anlayışımızla birleştirerek; uluslararası kalite standartlarında, kişiselleştirilmiş bir sağlık deneyimi sunuyoruz.',
                'en' => 'By combining modern technology with our academic team and patient-focused service approach, we offer a personalized healthcare experience at international quality standards.',
            ]],
        ],
        'vizyon-misyon' => [
            ['vision', 'label', 'text', ['tr' => 'Vizyonumuz', 'en' => 'Our Vision']],
            ['vision', 'text', 'richtext', [
                'tr' => 'İnsan hayatına sonsuz saygı duyarak; dünya standartlarında modern, kapsamlı ve güvenilir hizmet veren referans sağlık kurumu olmak.',
                'en' => 'To be a reference healthcare institution that, with infinite respect for human life, provides modern, comprehensive and reliable service at world standards.',
            ]],
            ['mission', 'label', 'text', ['tr' => 'Misyonumuz', 'en' => 'Our Mission']],
            ['mission', 'text', 'richtext', [
                'tr' => 'Modern teknolojiyi kaliteli ve etkin bir hizmet anlayışıyla birleştirerek insanları sağlıklı yaşama kavuşturmak.',
                'en' => 'To restore people to healthy living by combining modern technology with a quality and effective service approach.',
            ]],
        ],
        'kalite-calismalari' => [
            ['approach', 'eyebrow', 'text', ['tr' => '— Kalite Yaklaşımımız', 'en' => '— Our Quality Approach']],
            ['approach', 'title', 'text', [
                'tr' => 'Ölçen, iyileştiren ve öğrenen bir hastane',
                'en' => 'A hospital that measures, improves and learns',
            ]],
            ['approach', 'body', 'richtext', [
                'tr' => 'Klinik sonuçlar, hasta deneyimi ve süreç göstergelerini bütüncül şekilde izleriz. Elde ettiğimiz veriler; ekip eğitimleri, süreç iyileştirme projeleri ve teknoloji yatırımlarımıza yön verir. Amacımız; uluslararası standartlarda ölçülebilir, güvenli ve sürdürülebilir sağlık hizmeti sunmaktır.',
                'en' => 'We monitor clinical outcomes, patient experience and process indicators holistically. The data we obtain guides our team trainings, process improvement projects and technology investments. Our aim is to provide measurable, safe and sustainable healthcare at international standards.',
            ]],
        ],
    ];

    public function run(): void
    {
        foreach (self::PAGES as $slug => $title) {
            // updateOrCreate keeps the admin label current WITHOUT touching editor SEO edits.
            Page::updateOrCreate(['slug' => $slug], ['title' => $title]);
        }

        foreach (self::CONTENT as $pageSlug => $blocks) {
            foreach ($blocks as $i => [$section, $key, $type, $value]) {
                $exists = PageContent::query()
                    ->where('page_slug', $pageSlug)
                    ->where('section', $section)
                    ->where('key', $key)
                    ->exists();

                // Seed only if absent — never overwrite an editor's copy edits.
                if ($exists) {
                    continue;
                }

                PageContent::create([
                    'page_slug' => $pageSlug,
                    'section' => $section,
                    'key' => $key,
                    'type' => $type,
                    'value' => $value,
                    'sort_order' => $i,
                ]);
            }
        }
    }
}
