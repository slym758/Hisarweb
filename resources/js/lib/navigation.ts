/**
 * Single source of truth for the site's primary navigation (header mega-menu +
 * mobile drawer). Ported 1:1 from the source `SiteHeader.tsx` NAV tree. Labels are
 * bilingual (TR + EN); `getNav(locale)` / `useNav()` return the tree with labels
 * resolved to the active locale, so rendering code stays unchanged. Paths are
 * locale-agnostic (root/TR) — prefix them for EN with `localizedPath()`.
 */
import { useLocale, type Locale } from '@/lib/i18n';

/* ── Public (resolved) nav shape — labels are plain strings ── */
export type NavLeaf = { label: string; to?: string; href?: string; note?: string };
export type NavSubgroup = { label: string; to?: string; items: NavLeaf[] };
export type NavColumn = { title: string; items?: NavLeaf[]; subgroups?: NavSubgroup[] };
export type NavGroup = {
    key: string;
    label: string;
    to?: string;
    matches: string[];
    mega: true;
    columns: NavColumn[];
};
export type NavDirect = { key: string; label: string; to: string; matches: string[]; direct: true };
export type NavItem = NavGroup | NavDirect;

/* ── Internal bilingual source ── */
type Loc = { tr: string; en: string };
const L = (tr: string, en: string): Loc => ({ tr, en });

type SrcLeaf = { label: Loc; to?: string; href?: string; note?: Loc };
type SrcColumn = { title: Loc; items: SrcLeaf[] };
type SrcGroup = { key: string; label: Loc; to?: string; matches: string[]; mega: true; columns: SrcColumn[] };
type SrcDirect = { key: string; label: Loc; to: string; matches: string[]; direct: true };
type SrcItem = SrcGroup | SrcDirect;

const NAV_SOURCE: SrcItem[] = [
    {
        key: 'kurumsal',
        label: L('Kurumsal', 'Corporate'),
        matches: [
            '/kurumsal', '/vizyon-misyon', '/basinda-hastanemiz', '/etkinlikler', '/kalite-calismalari',
            '/kvkk-politikamiz', '/bilgi-guvenligi-politikamiz', '/cerez-politikasi',
            '/insan-kaynaklari', '/gebe-okulu', '/web-ve-tibbi-yayin-kurulu',
        ],
        mega: true,
        columns: [
            {
                title: L('Kurumsal', 'Corporate'),
                items: [
                    { label: L('Hakkımızda', 'About Us'), href: '/kurumsal#hakkimizda' },
                    { label: L('Vizyonumuz ve Misyonumuz', 'Vision & Mission'), to: '/vizyon-misyon' },
                    { label: L('Kalite Çalışmaları', 'Quality Work'), to: '/kalite-calismalari' },
                    { label: L('Basında Hastanemiz', 'In the Press'), to: '/basinda-hastanemiz' },
                    { label: L('Etkinlikler', 'Events'), to: '/etkinlikler' },
                ],
            },
            {
                title: L('Politikalar', 'Policies'),
                items: [
                    { label: L('KVKK Politikamız', 'Privacy Policy (KVKK)'), to: '/kvkk-politikamiz' },
                    { label: L('Bilgi Güvenliği Politikamız', 'Information Security Policy'), to: '/bilgi-guvenligi-politikamiz' },
                    { label: L('Çerez Politikası', 'Cookie Policy'), to: '/cerez-politikasi' },
                ],
            },
            {
                title: L('Kariyer ve Yaşam', 'Career & Life'),
                items: [
                    { label: L('İnsan Kaynakları', 'Human Resources'), to: '/insan-kaynaklari' },
                    { label: L('Gebe Okulu', 'Pregnancy School'), to: '/gebe-okulu' },
                    { label: L('Web ve Tıbbi Yayın Kurulu', 'Web & Medical Publication Board'), to: '/web-ve-tibbi-yayin-kurulu' },
                ],
            },
        ],
    },
    { key: 'doktorlarimiz', label: L('Doktorlarımız', 'Our Doctors'), to: '/doktorlarimiz', matches: ['/doktorlarimiz', '/doktor'], direct: true },
    { key: 'bolumlerimiz', label: L('Bölümlerimiz', 'Departments'), to: '/bolumlerimiz', matches: ['/bolumlerimiz', '/bolum'], direct: true },
    {
        key: 'hastanelerimiz',
        label: L('Hastanelerimiz', 'Our Hospitals'),
        to: '/hastanelerimiz',
        matches: ['/hastanelerimiz', '/hastane', '/butunlesik-onkoloji'],
        mega: true,
        columns: [
            {
                title: L('Hastanelerimiz', 'Our Hospitals'),
                items: [
                    { label: L('Hisar Hospital Intercontinental', 'Hisar Hospital Intercontinental'), to: '/hastane/intercontinental' },
                    { label: L('Hisar Hospital Çamlıca', 'Hisar Hospital Çamlıca'), to: '/hastane/camlica' },
                    { label: L('Hisar Hospital Avrupa', 'Hisar Hospital Avrupa'), href: '/hastanelerimiz#hisar-hospital-avrupa', note: L('Yakında', 'Coming Soon') },
                ],
            },
            {
                title: L('Bütünleşik Onkoloji', 'Integrated Oncology'),
                items: [
                    { label: L('Genel Bakış', 'Overview'), to: '/butunlesik-onkoloji' },
                    { label: L('Medikal Kadro', 'Medical Staff'), to: '/butunlesik-onkoloji/medikal-kadro' },
                    { label: L('Moral Takımı', 'Morale Team'), to: '/moral-takimi' },
                ],
            },
        ],
    },
    {
        key: 'hasta-rehberi',
        label: L('Hasta Rehberi', 'Patient Guide'),
        matches: [
            '/videolar', '/saglikli-hayat-rehberi', '/hastaliklar', '/hastalik',
            '/tedavi-yontemleri', '/tedavi', '/teknolojilerimiz', '/teknoloji',
            '/bilgi-rehberi', '/anlasmali-kurumlar', '/paketler', '/mobil-uygulama',
        ],
        mega: true,
        columns: [
            {
                title: L('Sağlık Bilgisi', 'Health Information'),
                items: [
                    { label: L('Hastalıklar', 'Diseases'), to: '/hastaliklar' },
                    { label: L('Tedavi Yöntemleri', 'Treatment Methods'), to: '/tedavi-yontemleri' },
                    { label: L('Teknolojilerimiz', 'Our Technologies'), to: '/teknolojilerimiz' },
                ],
            },
            {
                title: L('İçerikler', 'Content'),
                items: [
                    { label: L('Sağlıklı Hayat Rehberi', 'Healthy Life Guide'), to: '/saglikli-hayat-rehberi' },
                    { label: L('Videolar', 'Videos'), to: '/videolar' },
                ],
            },
            {
                title: L('Rehber ve Destek', 'Guide & Support'),
                items: [
                    { label: L('Bilgi Rehberi', 'Info Guide'), to: '/bilgi-rehberi' },
                    { label: L('Paketler & Check-Up', 'Packages & Check-Up'), to: '/paketler' },
                    { label: L('Anlaşmalı Kurumlar', 'Contracted Institutions'), to: '/anlasmali-kurumlar' },
                    { label: L('Mobil Uygulama', 'Mobile App'), to: '/mobil-uygulama' },
                ],
            },
        ],
    },
    {
        key: 'online-hizmetler',
        label: L('Online Hizmetler', 'Online Services'),
        to: '/online-hizmetler',
        matches: ['/online-hizmetler', '/doktora-sorun', '/anketimize-katilin', '/sizi-arayalim', '/sizi-dinliyoruz'],
        mega: true,
        columns: [
            {
                title: L('Online İşlemler', 'Online Transactions'),
                items: [
                    { label: L('Hisar Online', 'Hisar Online'), href: 'https://online.hisarhospital.com/#/' },
                    { label: L('E-Sonuç', 'E-Results'), href: 'https://online.hisarhospital.com/#/' },
                    { label: L('Online Doktor', 'Online Doctor'), href: 'https://online.hisarhospital.com/#/' },
                ],
            },
            {
                title: L('Formlar', 'Forms'),
                items: [
                    { label: L('Doktora Sorun', 'Ask a Doctor'), to: '/doktora-sorun' },
                    { label: L('Sizi Arayalım', 'Call Me Back'), to: '/sizi-arayalim' },
                    { label: L('Sizi Dinliyoruz', "We're Listening"), to: '/sizi-dinliyoruz' },
                    { label: L('Anketimize Katılın', 'Take Our Survey'), to: '/anketimize-katilin' },
                ],
            },
        ],
    },
    { key: 'iletisim', label: L('İletişim', 'Contact'), to: '/iletisim', matches: ['/iletisim'], direct: true },
];

function resolveLeaf(leaf: SrcLeaf, locale: Locale): NavLeaf {
    return {
        label: leaf.label[locale],
        to: leaf.to,
        href: leaf.href,
        note: leaf.note ? leaf.note[locale] : undefined,
    };
}

/** The nav tree with all labels resolved to `locale`. */
export function getNav(locale: Locale): NavItem[] {
    return NAV_SOURCE.map((item): NavItem => {
        if ('direct' in item) {
            return { ...item, label: item.label[locale] };
        }
        return {
            ...item,
            label: item.label[locale],
            columns: item.columns.map((col) => ({
                title: col.title[locale],
                items: col.items.map((it) => resolveLeaf(it, locale)),
            })),
        };
    });
}

/** Hook variant of {@link getNav} bound to the active locale. */
export function useNav(): NavItem[] {
    return getNav(useLocale());
}

/** True when `pathname` (locale prefix already stripped) belongs to a nav group. */
export function isNavActive(pathname: string, matches: string[]): boolean {
    return matches.some(
        (m) => pathname === m || pathname.startsWith(m + '/') || pathname.startsWith(m + '?'),
    );
}
