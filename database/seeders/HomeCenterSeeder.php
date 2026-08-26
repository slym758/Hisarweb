<?php

namespace Database\Seeders;

use App\Models\HomeCenter;
use Illuminate\Database\Seeder;

/**
 * Seeds the homepage "Özel Merkezler" cards from the values that used to be hard-coded on the
 * home page, so editors can control which centers appear and their order. Placeholder Unsplash
 * imagery until real photos are uploaded. Idempotent: only seeds when the table is empty.
 */
class HomeCenterSeeder extends Seeder
{
    private function ph(string $id): string
    {
        return "https://images.unsplash.com/photo-{$id}?auto=format&fit=crop&w=1200&q=80";
    }

    public function run(): void
    {
        if (HomeCenter::exists()) {
            return;
        }

        $items = [
            ['img' => '1551190822-a9333d879b1f', 'tr_n' => 'Robotik Kalp Cerrahisi', 'en_n' => 'Robotic Heart Surgery', 'tr_d' => 'Da Vinci robotik sistemi ile milimetrik hassasiyet, küçük kesi ve hızlı iyileşme.', 'en_d' => 'Millimetric precision, small incisions and fast recovery with the Da Vinci robotic system.', 'tr_a' => 'Robotik Cerrahi', 'en_a' => 'Robotic Surgery'],
            ['img' => '1576091160399-112ba8d25d1d', 'tr_n' => 'Prostat Sağlığı Kliniği', 'en_n' => 'Prostate Health Clinic', 'tr_d' => 'Akademik kadro ve ileri teknolojik donanımla prostat sağlığına bütünsel yaklaşım.', 'en_d' => 'A holistic approach to prostate health with academic staff and advanced technology.', 'tr_a' => 'Üroloji', 'en_a' => 'Urology'],
            ['img' => '1579684385127-1ef15d508118', 'tr_n' => 'İleri Göz Tedavileri Kliniği', 'en_n' => 'Advanced Eye Treatments Clinic', 'tr_d' => 'Modern tedavi yöntemleri ve uzman kadromuzla sağlıklı, net bir görüş için.', 'en_d' => 'For healthy, clear vision with modern treatment methods and our expert team.', 'tr_a' => 'Göz Sağlığı', 'en_a' => 'Eye Health'],
            ['img' => '1582719508461-905c673771fd', 'tr_n' => 'Baş ve Boyun Kanser Cerrahisi', 'en_n' => 'Head and Neck Cancer Surgery', 'tr_d' => 'Multidisipliner yaklaşım ve güncel tedavi yöntemleriyle kişiye özel çözümler.', 'en_d' => 'Personalized solutions with a multidisciplinary approach and current treatment methods.', 'tr_a' => 'Onkolojik Cerrahi', 'en_a' => 'Oncologic Surgery'],
        ];

        foreach ($items as $i => $it) {
            HomeCenter::create([
                'name' => ['tr' => $it['tr_n'], 'en' => $it['en_n']],
                'desc' => ['tr' => $it['tr_d'], 'en' => $it['en_d']],
                'accent' => ['tr' => $it['tr_a'], 'en' => $it['en_a']],
                'link' => '/tedavi-yontemleri',
                'image_url' => $this->ph($it['img']),
                'status' => 'published',
                'order_column' => $i + 1,
            ]);
        }
    }
}
