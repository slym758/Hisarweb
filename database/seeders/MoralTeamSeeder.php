<?php

namespace Database\Seeders;

use App\Models\MoralTeamMember;
use Illuminate\Database\Seeder;

/**
 * Seeds the Integrated Oncology "Moral Takımı" from the values that used to be hard-coded on
 * the moral-takimi page, so the page stays pixel-identical and editors get editable starting
 * data. Idempotent (updateOrCreate by name); placeholder Unsplash imagery until real photos
 * are uploaded. Safe to re-run — never removes members added/edited in the admin.
 */
class MoralTeamSeeder extends Seeder
{
    private function ph(string $id): string
    {
        return "https://images.unsplash.com/photo-{$id}?auto=format&fit=crop&w=1200&q=80";
    }

    public function run(): void
    {
        $members = [
            ['name' => 'Fırat Aydınus', 'tr' => 'Hakem', 'en' => 'Referee', 'img' => '1500648767791-00dcc994a43e', 'visits' => 3],
            ['name' => 'Özlem Yıldız', 'tr' => 'Sunucu', 'en' => 'TV Host', 'img' => '1494790108377-be9c29b29330', 'visits' => 2],
            ['name' => 'Pascal Nouma', 'tr' => 'Sporcu', 'en' => 'Athlete', 'img' => '1507003211169-0a1dd7228f2d', 'visits' => 3],
            ['name' => 'Altan Erkekli', 'tr' => 'Oyuncu', 'en' => 'Actor', 'img' => '1519085360753-af0119f7cbe7', 'visits' => 2],
            ['name' => 'Candaş Tolga Işık', 'tr' => 'Sunucu / Gazeteci', 'en' => 'Host / Journalist', 'img' => '1506794778202-cad84cf45f1d', 'visits' => 3],
            ['name' => 'Mustafa Denizli', 'tr' => 'Teknik Direktör', 'en' => 'Football Manager', 'img' => '1544005313-94ddf0286df2', 'visits' => 2],
            ['name' => 'Melih Gümüşbıçak', 'tr' => 'Spor Sunucusu', 'en' => 'Sports Presenter', 'img' => '1519345182560-3f2917c472ef', 'visits' => 0],
            ['name' => 'Özgür Özgülgün', 'tr' => 'Oyuncu', 'en' => 'Actor', 'img' => '1438761681033-6461ffad8d80', 'visits' => 0],
            ['name' => 'Buket Dereoğlu', 'tr' => 'Oyuncu', 'en' => 'Actor', 'img' => '1472099645785-5658abf4ff4e', 'visits' => 0],
        ];

        foreach ($members as $i => $m) {
            $photo = $this->ph($m['img']);

            MoralTeamMember::updateOrCreate(
                ['name' => $m['name']],
                [
                    'role' => ['tr' => $m['tr'], 'en' => $m['en']],
                    'photo_url' => $photo,
                    'gallery' => array_fill(0, $m['visits'], $photo),
                    'status' => 'published',
                    'order_column' => $i + 1,
                ],
            );
        }
    }
}
