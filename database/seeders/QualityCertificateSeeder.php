<?php

namespace Database\Seeders;

use App\Models\QualityCertificate;
use Illuminate\Database\Seeder;

/**
 * Seeds the quality certificates / accreditations from the values that used to be hard-coded in
 * the QualityCertificates component, so the homepage "Belgelerimiz ve akreditasyonlarımız"
 * section reads from the DB and editors can manage it. Placeholder Unsplash imagery until real
 * logos are uploaded. Idempotent: only seeds when the table is empty (never disturbs edits).
 */
class QualityCertificateSeeder extends Seeder
{
    private function ph(string $id): string
    {
        return "https://images.unsplash.com/photo-{$id}?auto=format&fit=crop&w=1200&q=80";
    }

    public function run(): void
    {
        if (QualityCertificate::exists()) {
            return;
        }

        $items = [
            ['slug' => 'jci-akreditasyon', 'tr_n' => 'JCI Akreditasyon Sertifikası', 'en_n' => 'JCI Accreditation Certificate', 'tr_i' => 'Uluslararası akreditasyon', 'en_i' => 'International accreditation', 'img' => '1589829545856-d10d557cf95f'],
            ['slug' => 'health-turkiye', 'tr_n' => 'Health Türkiye', 'en_n' => 'Health Türkiye', 'tr_i' => 'Sağlık Bakanlığı uluslararası sağlık turizmi markası', 'en_i' => 'Ministry of Health international healthcare brand', 'img' => '1576091160399-112ba8d25d1d'],
            ['slug' => 'turquality', 'tr_n' => 'TURQUALITY', 'en_n' => 'TURQUALITY', 'tr_i' => 'Devlet destekli markalaşma programı', 'en_i' => 'State-backed international branding programme', 'img' => '1554224155-6726b3ff858f'],
            ['slug' => 'iso-9001', 'tr_n' => 'ISO 9001 Kalite Yönetim Sistemi', 'en_n' => 'ISO 9001 Quality Management System', 'tr_i' => 'Kalite yönetim standardı', 'en_i' => 'Quality management standard', 'img' => '1450101499163-c8848c66ca85'],
            ['slug' => 'iso-27001', 'tr_n' => 'ISO 27001 Bilgi Güvenliği Yönetimi', 'en_n' => 'ISO 27001 Information Security Management', 'tr_i' => 'Bilgi güvenliği standardı', 'en_i' => 'Information security standard', 'img' => '1450101499163-c8848c66ca85'],
        ];

        foreach ($items as $i => $it) {
            QualityCertificate::create([
                'slug' => $it['slug'],
                'name' => ['tr' => $it['tr_n'], 'en' => $it['en_n']],
                'issuer' => ['tr' => $it['tr_i'], 'en' => $it['en_i']],
                'cover_url' => $this->ph($it['img']),
                'status' => 'published',
                'order_column' => $i + 1,
            ]);
        }
    }
}
