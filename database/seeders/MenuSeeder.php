<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

/**
 * Seeds the four site menus (header, footer, rail, bottom_nav) to MATCH the previously
 * hardcoded frontend sources exactly, so the site stays visually identical after
 * navigation moves to the DB:
 *   - header       ← resources/js/lib/navigation.ts (NAV_SOURCE)
 *   - footer       ← components/site/SiteFooter.tsx link columns
 *   - rail         ← components/site/DesktopRail.tsx
 *   - bottom_nav   ← components/site/MobileBottomNav.tsx (TR side items)
 *
 * Idempotent & non-destructive: menus are updateOrCreate'd by location, and item trees
 * are only seeded when a menu has NO items yet — re-running never duplicates rows nor
 * overwrites admin edits.
 */
class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedMenu('header', 'Header (üst menü)', $this->header());
        $this->seedMenu('footer', 'Footer (alt bilgi)', $this->footer());
        $this->seedMenu('rail', 'Sağ/sol hızlı erişim', $this->rail());
        $this->seedMenu('bottom_nav', 'Mobil alt menü', $this->bottomNav());
    }

    /** @param  array<int,array<string,mixed>>  $items */
    private function seedMenu(string $location, string $label, array $items): void
    {
        $menu = Menu::updateOrCreate(['location' => $location], ['label' => $label]);

        // Seed-if-empty: preserve any admin-managed items on subsequent runs.
        if ($menu->items()->exists()) {
            return;
        }

        $this->createItems($menu, $items);
    }

    /**
     * @param  array<int,array<string,mixed>>  $defs
     */
    private function createItems(Menu $menu, array $defs, ?int $parentId = null): void
    {
        foreach (array_values($defs) as $sort => $def) {
            $attributes = [
                'menu_id' => $menu->id,
                'parent_id' => $parentId,
                'key' => $def['key'] ?? null,
                'label' => $def['label'],
                'column_group' => $def['column_group'] ?? false,
                'link_type' => $def['link_type'] ?? 'internal',
                'route' => $def['route'] ?? null,
                'url' => $def['url'] ?? null,
                'icon' => $def['icon'] ?? null,
                'matches' => $def['matches'] ?? null,
                'sort_order' => $sort,
                'is_active' => true,
            ];

            if (! empty($def['badge'])) {
                $attributes['badge'] = $def['badge'];
            }

            $item = MenuItem::create($attributes);

            if (! empty($def['children'])) {
                $this->createItems($menu, $def['children'], $item->id);
            }
        }
    }

    /** Bilingual label helper. @return array{tr:string,en:string} */
    private function l(string $tr, string $en): array
    {
        return ['tr' => $tr, 'en' => $en];
    }

    /** @return array<int,array<string,mixed>> */
    private function header(): array
    {
        return [
            [
                'key' => 'kurumsal',
                'label' => $this->l('Kurumsal', 'Corporate'),
                'link_type' => 'none',
                'matches' => [
                    '/kurumsal', '/vizyon-misyon', '/basinda-hastanemiz', '/etkinlikler', '/kalite-calismalari',
                    '/kvkk-politikamiz', '/bilgi-guvenligi-politikamiz', '/cerez-politikasi',
                    '/insan-kaynaklari', '/gebe-okulu', '/web-ve-tibbi-yayin-kurulu',
                ],
                'children' => [
                    [
                        'label' => $this->l('Kurumsal', 'Corporate'),
                        'column_group' => true,
                        'link_type' => 'none',
                        'children' => [
                            ['label' => $this->l('Hakkımızda', 'About Us'), 'link_type' => 'external', 'url' => '/kurumsal#hakkimizda'],
                            ['label' => $this->l('Vizyonumuz ve Misyonumuz', 'Vision & Mission'), 'route' => '/vizyon-misyon'],
                            ['label' => $this->l('Kalite Çalışmaları', 'Quality Work'), 'route' => '/kalite-calismalari'],
                            ['label' => $this->l('Basında Hastanemiz', 'In the Press'), 'route' => '/basinda-hastanemiz'],
                            ['label' => $this->l('Etkinlikler', 'Events'), 'route' => '/etkinlikler'],
                        ],
                    ],
                    [
                        'label' => $this->l('Politikalar', 'Policies'),
                        'column_group' => true,
                        'link_type' => 'none',
                        'children' => [
                            ['label' => $this->l('KVKK Politikamız', 'Privacy Policy (KVKK)'), 'route' => '/kvkk-politikamiz'],
                            ['label' => $this->l('Bilgi Güvenliği Politikamız', 'Information Security Policy'), 'route' => '/bilgi-guvenligi-politikamiz'],
                            ['label' => $this->l('Çerez Politikası', 'Cookie Policy'), 'route' => '/cerez-politikasi'],
                        ],
                    ],
                    [
                        'label' => $this->l('Kariyer ve Yaşam', 'Career & Life'),
                        'column_group' => true,
                        'link_type' => 'none',
                        'children' => [
                            ['label' => $this->l('İnsan Kaynakları', 'Human Resources'), 'route' => '/insan-kaynaklari'],
                            ['label' => $this->l('Gebe Okulu', 'Pregnancy School'), 'route' => '/gebe-okulu'],
                            ['label' => $this->l('Web ve Tıbbi Yayın Kurulu', 'Web & Medical Publication Board'), 'route' => '/web-ve-tibbi-yayin-kurulu'],
                        ],
                    ],
                ],
            ],
            [
                'key' => 'doktorlarimiz',
                'label' => $this->l('Doktorlarımız', 'Our Doctors'),
                'route' => '/doktorlarimiz',
                'matches' => ['/doktorlarimiz', '/doktor'],
            ],
            [
                'key' => 'bolumlerimiz',
                'label' => $this->l('Bölümlerimiz', 'Departments'),
                'route' => '/bolumlerimiz',
                'matches' => ['/bolumlerimiz', '/bolum'],
            ],
            [
                'key' => 'hastanelerimiz',
                'label' => $this->l('Hastanelerimiz', 'Our Hospitals'),
                'route' => '/hastanelerimiz',
                'matches' => ['/hastanelerimiz', '/hastane', '/butunlesik-onkoloji'],
                'children' => [
                    [
                        'label' => $this->l('Hastanelerimiz', 'Our Hospitals'),
                        'column_group' => true,
                        'link_type' => 'none',
                        'children' => [
                            ['label' => $this->l('Hisar Hospital Intercontinental', 'Hisar Hospital Intercontinental'), 'route' => '/hastane/intercontinental'],
                            ['label' => $this->l('Hisar Hospital Çamlıca', 'Hisar Hospital Çamlıca'), 'route' => '/hastane/camlica'],
                            ['label' => $this->l('Hisar Hospital Avrupa', 'Hisar Hospital Avrupa'), 'link_type' => 'external', 'url' => '/hastanelerimiz#hisar-hospital-avrupa', 'badge' => $this->l('Yakında', 'Coming Soon')],
                        ],
                    ],
                    [
                        'label' => $this->l('Bütünleşik Onkoloji', 'Integrated Oncology'),
                        'column_group' => true,
                        'link_type' => 'none',
                        'children' => [
                            ['label' => $this->l('Genel Bakış', 'Overview'), 'route' => '/butunlesik-onkoloji'],
                            ['label' => $this->l('Medikal Kadro', 'Medical Staff'), 'route' => '/butunlesik-onkoloji/medikal-kadro'],
                            ['label' => $this->l('Moral Takımı', 'Morale Team'), 'route' => '/moral-takimi'],
                        ],
                    ],
                ],
            ],
            [
                'key' => 'hasta-rehberi',
                'label' => $this->l('Hasta Rehberi', 'Patient Guide'),
                'link_type' => 'none',
                'matches' => [
                    '/videolar', '/saglikli-hayat-rehberi', '/hastaliklar', '/hastalik',
                    '/tedavi-yontemleri', '/tedavi', '/teknolojilerimiz', '/teknoloji',
                    '/bilgi-rehberi', '/anlasmali-kurumlar', '/paketler', '/mobil-uygulama',
                ],
                'children' => [
                    [
                        'label' => $this->l('Sağlık Bilgisi', 'Health Information'),
                        'column_group' => true,
                        'link_type' => 'none',
                        'children' => [
                            ['label' => $this->l('Hastalıklar', 'Diseases'), 'route' => '/hastaliklar'],
                            ['label' => $this->l('Tedavi Yöntemleri', 'Treatment Methods'), 'route' => '/tedavi-yontemleri'],
                            ['label' => $this->l('Teknolojilerimiz', 'Our Technologies'), 'route' => '/teknolojilerimiz'],
                        ],
                    ],
                    [
                        'label' => $this->l('İçerikler', 'Content'),
                        'column_group' => true,
                        'link_type' => 'none',
                        'children' => [
                            ['label' => $this->l('Sağlıklı Hayat Rehberi', 'Healthy Life Guide'), 'route' => '/saglikli-hayat-rehberi'],
                            ['label' => $this->l('Videolar', 'Videos'), 'route' => '/videolar'],
                        ],
                    ],
                    [
                        'label' => $this->l('Rehber ve Destek', 'Guide & Support'),
                        'column_group' => true,
                        'link_type' => 'none',
                        'children' => [
                            ['label' => $this->l('Bilgi Rehberi', 'Info Guide'), 'route' => '/bilgi-rehberi'],
                            ['label' => $this->l('Paketler & Check-Up', 'Packages & Check-Up'), 'route' => '/paketler'],
                            ['label' => $this->l('Anlaşmalı Kurumlar', 'Contracted Institutions'), 'route' => '/anlasmali-kurumlar'],
                            ['label' => $this->l('Mobil Uygulama', 'Mobile App'), 'route' => '/mobil-uygulama'],
                        ],
                    ],
                ],
            ],
            [
                'key' => 'online-hizmetler',
                'label' => $this->l('Online Hizmetler', 'Online Services'),
                'route' => '/online-hizmetler',
                'matches' => ['/online-hizmetler', '/doktora-sorun', '/anketimize-katilin', '/sizi-arayalim', '/sizi-dinliyoruz'],
                'children' => [
                    [
                        'label' => $this->l('Online İşlemler', 'Online Transactions'),
                        'column_group' => true,
                        'link_type' => 'none',
                        'children' => [
                            ['label' => $this->l('Hisar Online', 'Hisar Online'), 'link_type' => 'external', 'url' => 'https://online.hisarhospital.com/#/'],
                            ['label' => $this->l('E-Sonuç', 'E-Results'), 'link_type' => 'external', 'url' => 'https://online.hisarhospital.com/#/'],
                            ['label' => $this->l('Online Doktor', 'Online Doctor'), 'link_type' => 'external', 'url' => 'https://online.hisarhospital.com/#/'],
                        ],
                    ],
                    [
                        'label' => $this->l('Formlar', 'Forms'),
                        'column_group' => true,
                        'link_type' => 'none',
                        'children' => [
                            ['label' => $this->l('Doktora Sorun', 'Ask a Doctor'), 'route' => '/doktora-sorun'],
                            ['label' => $this->l('Sizi Arayalım', 'Call Me Back'), 'route' => '/sizi-arayalim'],
                            ['label' => $this->l('Sizi Dinliyoruz', "We're Listening"), 'route' => '/sizi-dinliyoruz'],
                            ['label' => $this->l('Anketimize Katılın', 'Take Our Survey'), 'route' => '/anketimize-katilin'],
                        ],
                    ],
                ],
            ],
            [
                'key' => 'iletisim',
                'label' => $this->l('İletişim', 'Contact'),
                'route' => '/iletisim',
                'matches' => ['/iletisim'],
            ],
        ];
    }

    /** @return array<int,array<string,mixed>> */
    private function footer(): array
    {
        return [
            [
                'label' => $this->l('Kurumsal', 'Corporate'),
                'column_group' => true,
                'link_type' => 'none',
                'children' => [
                    ['label' => $this->l('Hakkımızda', 'About Us'), 'route' => '/kurumsal'],
                    ['label' => $this->l('Kalite Belgelerimiz', 'Quality Certificates'), 'route' => '/kurumsal'],
                    ['label' => $this->l('JCI Akreditasyonu', 'JCI Accreditation'), 'route' => '/kurumsal'],
                    ['label' => $this->l('Hasta Hakları', 'Patient Rights'), 'route' => '/saglikli-hayat-rehberi'],
                    ['label' => $this->l('Kariyer', 'Career'), 'route' => '/kurumsal'],
                    ['label' => $this->l('Anlaşmalı Kurumlar', 'Contracted Institutions'), 'route' => '/anlasmali-kurumlar'],
                ],
            ],
            [
                'label' => $this->l('Sağlık Hizmetleri', 'Health Services'),
                'column_group' => true,
                'link_type' => 'none',
                'children' => [
                    ['label' => $this->l('Doktorlarımız', 'Our Doctors'), 'route' => '/doktorlarimiz'],
                    ['label' => $this->l('Bölümlerimiz', 'Departments'), 'route' => '/bolumlerimiz'],
                    ['label' => $this->l('Tedavi Yöntemleri', 'Treatment Methods'), 'route' => '/tedavi-yontemleri'],
                    ['label' => $this->l('Sağlıklı Hayat Rehberi', 'Healthy Life Guide'), 'route' => '/saglikli-hayat-rehberi'],
                    ['label' => $this->l('Bütünleşik Onkoloji Merkezi', 'Integrated Oncology Center'), 'route' => '/bolumlerimiz'],
                    ['label' => $this->l('International Patients', 'International Patients'), 'route' => '/iletisim'],
                ],
            ],
            [
                'label' => $this->l('Online İşlemler', 'Online Transactions'),
                'column_group' => true,
                'link_type' => 'none',
                'children' => [
                    ['label' => $this->l('Doktor Ara', 'Find a Doctor'), 'route' => '/doktorlarimiz'],
                    ['label' => $this->l('E-Sonuç', 'E-Results'), 'link_type' => 'external', 'url' => 'https://online.hisarhospital.com/#/'],
                    ['label' => $this->l('Hisar Online', 'Hisar Online'), 'link_type' => 'external', 'url' => 'https://online.hisarhospital.com/#/'],
                    ['label' => $this->l('Anlaşmalı Kurum Sorgula', 'Check Contracted Institutions'), 'route' => '/anlasmali-kurumlar'],
                ],
            ],
        ];
    }

    /** @return array<int,array<string,mixed>> */
    private function rail(): array
    {
        return [
            ['label' => $this->l('E-Sonuç', 'E-Results'), 'route' => '/online-hizmetler', 'icon' => 'ClipboardList'],
            ['label' => $this->l('İletişim', 'Contact'), 'route' => '/iletisim', 'icon' => 'Phone'],
        ];
    }

    /** @return array<int,array<string,mixed>> */
    private function bottomNav(): array
    {
        return [
            ['label' => $this->l('E-Sonuç', 'E-Results'), 'route' => '/online-hizmetler', 'icon' => 'ClipboardList'],
            ['label' => $this->l('İletişim', 'Contact'), 'route' => '/iletisim', 'icon' => 'MessageSquareText'],
        ];
    }
}
