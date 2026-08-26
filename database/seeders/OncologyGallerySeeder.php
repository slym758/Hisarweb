<?php

namespace Database\Seeders;

use App\Models\OncologyGalleryItem;
use Illuminate\Database\Seeder;

/**
 * Seeds the "Bütünleşik Onkoloji Merkezi Turu" gallery from the values that used to be
 * hard-coded on the butunlesik-onkoloji page, so the section stays identical and editors get
 * editable starting data (placeholder Unsplash imagery until real photos are uploaded).
 * Idempotent: only seeds when the table is empty, so it never disturbs edits made in admin.
 */
class OncologyGallerySeeder extends Seeder
{
    private function ph(string $id): string
    {
        return "https://images.unsplash.com/photo-{$id}?auto=format&fit=crop&w=1600&q=80";
    }

    public function run(): void
    {
        if (OncologyGalleryItem::exists()) {
            return; // already populated / edited — do not touch
        }

        $items = [
            ['img' => '1516549655169-df83a0774514', 'tr_t' => 'Merkez Girişi', 'tr_d' => 'Comprehensive Cancer Center — özel giriş.', 'en_t' => 'Center Entrance', 'en_d' => 'Comprehensive Cancer Center — private entrance.'],
            ['img' => '1587351021759-3e566b6af7cc', 'tr_t' => 'Karşılama & Danışma', 'tr_d' => 'Ferah lobi ve hasta yönlendirme birimi.', 'en_t' => 'Reception & Information', 'en_d' => 'A spacious lobby and patient guidance unit.'],
            ['img' => '1579165466741-7f35e4755660', 'tr_t' => 'Bekleme Lounge', 'tr_d' => 'Hastalarımız ve refakatçileri için sakin bekleme alanı.', 'en_t' => 'Waiting Lounge', 'en_d' => 'A calm waiting area for our patients and their companions.'],
            ['img' => '1512678080530-7760d81faba6', 'tr_t' => 'Poliklinik Bekleme', 'tr_d' => 'Poliklinik katlarında sessiz, konforlu bölümler.', 'en_t' => 'Outpatient Waiting', 'en_d' => 'Quiet, comfortable sections on the outpatient floors.'],
            ['img' => '1582719508461-905c673771fd', 'tr_t' => 'Kemoterapi Üniteleri', 'tr_d' => 'Bireysel kabinlerde güvenli ve mahremiyet odaklı uygulama.', 'en_t' => 'Chemotherapy Units', 'en_d' => 'Safe, privacy-focused administration in individual cabins.'],
            ['img' => '1512678080530-7760d81faba6', 'tr_t' => 'MR-LINAC Radyoterapi', 'tr_d' => 'Görüntü kılavuzluğunda milimetrik doğrulukta ışın tedavisi.', 'en_t' => 'MR-LINAC Radiotherapy', 'en_d' => 'Image-guided radiation therapy with millimetric accuracy.'],
            ['img' => '1631815589968-fdb09a223b1e', 'tr_t' => 'Robotik İlaç Hazırlama', 'tr_d' => 'Sitotoksik ilaçların steril, robotik hazırlanması.', 'en_t' => 'Robotic Drug Preparation', 'en_d' => 'Sterile, robotic preparation of cytotoxic drugs.'],
            ['img' => '1576091160399-112ba8d25d1d', 'tr_t' => 'Yatış Odaları', 'tr_d' => 'Doğal ışık alan konforlu tek kişilik hasta odaları.', 'en_t' => 'Inpatient Rooms', 'en_d' => 'Comfortable single patient rooms with natural light.'],
        ];

        foreach ($items as $i => $it) {
            OncologyGalleryItem::create([
                'title' => ['tr' => $it['tr_t'], 'en' => $it['en_t']],
                'desc' => ['tr' => $it['tr_d'], 'en' => $it['en_d']],
                'image_url' => $this->ph($it['img']),
                'status' => 'published',
                'order_column' => $i + 1,
            ]);
        }
    }
}
