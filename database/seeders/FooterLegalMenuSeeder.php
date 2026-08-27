<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\MenuItem;
use App\Support\MenuService;
use Illuminate\Database\Seeder;

/**
 * Seeds the "footer_legal" menu (the small legal links in the footer bottom bar) from the values
 * that were hard-coded in SiteFooter, so editors can add/remove/reorder them and edit their
 * labels/targets under Site Yapısı → Menüler. Idempotent: only seeds when the menu does not
 * exist yet, so it never disturbs edits made in the admin.
 */
class FooterLegalMenuSeeder extends Seeder
{
    public function run(): void
    {
        if (Menu::where('location', 'footer_legal')->exists()) {
            return;
        }

        $menu = Menu::create(['location' => 'footer_legal', 'label' => 'Footer — Yasal']);

        $links = [
            ['tr' => 'KVKK', 'en' => 'KVKK', 'route' => '/kvkk-politikamiz'],
            ['tr' => 'Çerez Politikası', 'en' => 'Cookie Policy', 'route' => '/cerez-politikasi'],
            ['tr' => 'Mesafeli Satış Sözleşmesi', 'en' => 'Distance Sales Agreement', 'route' => '/mesafeli-satis-sozlesmesi'],
            ['tr' => 'Web ve Tıbbi Yayın Kurulu', 'en' => 'Web & Medical Publication Board', 'route' => '/web-ve-tibbi-yayin-kurulu'],
        ];

        foreach ($links as $sort => $link) {
            MenuItem::create([
                'menu_id' => $menu->id,
                'parent_id' => null,
                'label' => ['tr' => $link['tr'], 'en' => $link['en']],
                'link_type' => 'internal',
                'route' => $link['route'],
                'sort_order' => $sort,
                'is_active' => true,
            ]);
        }

        MenuService::flush();
    }
}
