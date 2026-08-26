<?php

namespace Database\Seeders;

use App\Models\Slide;
use App\Models\Slider;
use Illuminate\Database\Seeder;

/**
 * Seeds the `home_hero` slider to MATCH the hardcoded frontend hero exactly, so the home
 * page stays visually identical after the hero moves to the DB. Transcribed from
 * resources/js/pages/site/home.tsx:
 *   - media   ← HERO_SLIDE_MEDIA (image/mobileImage via the `ph()` Unsplash helper)
 *   - copy    ← COPY.tr/en.hero.slides[] (eyebrow/title/mobileTitle/desc/mobileDesc)
 *
 * Idempotent & non-destructive: the slider is updateOrCreate'd by placement, and slides are
 * only seeded when the slider has NO slides yet — re-running never duplicates rows nor
 * overwrites admin edits.
 */
class SliderSeeder extends Seeder
{
    /** Mirrors home.tsx `ph(id, w)` → the exact Unsplash URL string. */
    private function ph(string $id, int $w = 1600): string
    {
        return "https://images.unsplash.com/photo-{$id}?auto=format&fit=crop&w={$w}&q=80";
    }

    public function run(): void
    {
        $slider = Slider::updateOrCreate(
            ['placement' => 'home_hero'],
            ['autoplay' => true, 'interval_ms' => 3000, 'is_active' => true],
        );

        // Seed-if-empty: preserve any admin-managed slides on subsequent runs.
        if ($slider->slides()->exists()) {
            return;
        }

        foreach ($this->slides() as $sort => $slide) {
            Slide::create(array_merge($slide, [
                'slider_id' => $slider->id,
                'sort_order' => $sort,
                'is_active' => true,
            ]));
        }
    }

    /** @return array<int,array<string,mixed>> */
    private function slides(): array
    {
        return [
            [
                'image_url' => $this->ph('1538108149393-fbbd81895907'),
                'mobile_image_url' => $this->ph('1516841273335-e39b37888115', 800),
                'position' => '50% 78%',
                'mobile_position' => '50% 35%',
                'link' => '/kurumsal',
                'eyebrow' => ['tr' => 'Hisar Intercontinental', 'en' => 'Hisar Intercontinental'],
                'title' => [
                    'tr' => 'Hayat boyu sağlığınız için yanınızdayız',
                    'en' => 'By your side for lifelong health',
                ],
                'mobile_title' => [
                    'tr' => 'Hayat boyu sağlığınız için',
                    'en' => 'For your lifelong health',
                ],
                'desc' => [
                    'tr' => 'Uzman hekim kadromuz ve ileri teknoloji altyapımızla, sağlığınız için yanınızdayız.',
                    'en' => 'With our expert physicians and advanced technology, we are here for your health.',
                ],
                'mobile_desc' => [
                    'tr' => 'Uzman hekim kadromuz ve ileri teknolojiyle yanınızdayız.',
                    'en' => 'Expert physicians and advanced technology, by your side.',
                ],
            ],
            [
                'image_url' => $this->ph('1579154204601-01588f351e67'),
                'mobile_image_url' => $this->ph('1516574200030-89bf6d9f7f66', 800),
                'position' => '70% 50%',
                'mobile_position' => '72% 40%',
                'link' => '/tedavi-yontemleri',
                'eyebrow' => ['tr' => 'Robotik Cerrahi', 'en' => 'Robotic Surgery'],
                'title' => [
                    'tr' => 'Robotik cerrahi ile hizmetinizdeyiz',
                    'en' => 'At your service with robotic surgery',
                ],
                'mobile_title' => [
                    'tr' => 'Robotik cerrahi ile hizmetinizdeyiz',
                    'en' => 'At your service with robotic surgery',
                ],
                'desc' => [
                    'tr' => 'Milimetrik hassasiyet, daha küçük kesi ve hızlı iyileşme; cerrahide yeni nesil bir dönem.',
                    'en' => 'Millimetric precision, smaller incisions and faster recovery — a new era in surgery.',
                ],
                'mobile_desc' => [
                    'tr' => 'Milimetrik hassasiyet, küçük kesi, hızlı iyileşme.',
                    'en' => 'Millimetric precision, small incisions, fast recovery.',
                ],
            ],
            [
                'image_url' => $this->ph('1579684385127-1ef15d508118'),
                'mobile_image_url' => $this->ph('1587393855524-087f83d95bc9', 800),
                'position' => '70% 50%',
                'mobile_position' => '70% 35%',
                'link' => '/tedavi-yontemleri',
                'eyebrow' => [
                    'tr' => 'İleri Göz Tedavileri Kliniği',
                    'en' => 'Advanced Eye Treatments Clinic',
                ],
                'title' => [
                    'tr' => 'Göz sağlığında ileri teknoloji ve uzman yaklaşım',
                    'en' => 'Advanced technology and expert care in eye health',
                ],
                'mobile_title' => [
                    'tr' => 'Göz sağlığında uzman yaklaşım',
                    'en' => 'Expert care in eye health',
                ],
                'desc' => [
                    'tr' => 'Lazer, retina ve katarakt tedavilerinde uzman değerlendirme ve takip.',
                    'en' => 'Expert evaluation and follow-up in laser, retina and cataract treatments.',
                ],
                'mobile_desc' => [
                    'tr' => 'Lazer, retina ve katarakt tedavilerinde uzman değerlendirme ve takip.',
                    'en' => 'Expert evaluation and follow-up in laser, retina and cataract treatments.',
                ],
            ],
        ];
    }
}
