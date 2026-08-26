<?php

namespace Database\Seeders;

use App\Models\Campaign;
use Illuminate\Database\Seeder;

/**
 * Seeds ONE sample campaign (slug 'kis-check-up') so the /kampanya/{slug} landing page
 * has content out of the box. Idempotent & non-destructive: firstOrCreate keyed by slug
 * never duplicates the row nor overwrites later admin edits.
 */
class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        Campaign::firstOrCreate(
            ['slug' => 'kis-check-up'],
            [
                'title' => [
                    'tr' => 'Kış Check-Up Kampanyası',
                    'en' => 'Winter Check-Up',
                ],
                'subtitle' => [
                    'tr' => 'Soğuk aylara sağlıkla girin — kapsamlı kış check-up paketimizle ayrıcalıklı fırsatları kaçırmayın.',
                    'en' => 'Step into the colder months in good health — enjoy exclusive offers with our comprehensive winter check-up.',
                ],
                'hero_image_url' => 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80',
                'body' => [
                    'tr' => [
                        'Kış Check-Up Kampanyamız, mevsim geçişlerinde bağışıklık sisteminizi ve genel sağlık durumunuzu değerlendirmek için tasarlanmış kapsamlı bir tetkik paketidir. Kan tahlilleri, kardiyoloji ve dahiliye değerlendirmeleri tek randevuda tamamlanır.',
                        'Uzman hekim kadromuz ve ileri teknoloji altyapımızla, sonuçlarınız aynı gün değerlendirilir ve size özel bir sağlık yol haritası sunulur. Kampanya süresince geçerli özel fiyatlarımızdan yararlanmak için hemen randevu oluşturun.',
                    ],
                    'en' => [
                        'Our Winter Check-Up is a comprehensive screening package designed to assess your immune system and overall health during the seasonal transition. Blood tests, cardiology and internal medicine evaluations are completed in a single appointment.',
                        'With our expert physicians and advanced technology, your results are reviewed the same day and a personalised health roadmap is prepared for you. Book now to take advantage of the special pricing available throughout the campaign period.',
                    ],
                ],
                'cta_label' => [
                    'tr' => 'Randevu Al',
                    'en' => 'Book Now',
                ],
                'cta_link' => '/randevu-al',
                'seo_title' => [
                    'tr' => 'Kış Check-Up Kampanyası — Hisar Hospital',
                    'en' => 'Winter Check-Up Campaign — Hisar Hospital',
                ],
                'seo_description' => [
                    'tr' => 'Kapsamlı kış check-up paketiyle sağlığınızı kontrol altına alın. Uzman kadro, ileri teknoloji ve kampanyaya özel fiyatlar Hisar Hospital\'da.',
                    'en' => 'Take control of your health with our comprehensive winter check-up package. Expert team, advanced technology and special campaign pricing at Hisar Hospital.',
                ],
                'is_active' => true,
            ],
        );
    }
}
