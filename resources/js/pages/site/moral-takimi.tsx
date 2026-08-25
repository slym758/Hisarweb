import { Head } from '@inertiajs/react';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { siteLayout } from '@/layouts/site-layout';
import { Breadcrumb } from '@/components/site/Breadcrumb';
import { OnkolojiSubNav } from '@/components/site/OnkolojiSubNav';
import { BizeUlasin } from '@/components/site/BizeUlasin';
import { useLocale } from '@/lib/i18n';

/* ──────────────────── TEMPORARY IMAGERY (Unsplash placeholders) ──────────────────── */
/* TODO: real asset — swap every Unsplash URL below for the optimized moral-takimi portraits. */
const ph = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const firat = ph('1500648767791-00dcc994a43e');
const ozlem = ph('1494790108377-be9c29b29330');
const pascal = ph('1507003211169-0a1dd7228f2d');
const altan = ph('1519085360753-af0119f7cbe7');
const candas = ph('1506794778202-cad84cf45f1d');
const denizli = ph('1544005313-94ddf0286df2');
const melih = ph('1519345182560-3f2917c472ef');
const ozgur = ph('1438761681033-6461ffad8d80');
const buket = ph('1472099645785-5658abf4ff4e');

type Member = { name: string; role: { tr: string; en: string }; img: string };

const MEMBERS: Member[] = [
    { name: 'Fırat Aydınus', role: { tr: 'Hakem', en: 'Referee' }, img: firat },
    { name: 'Özlem Yıldız', role: { tr: 'Sunucu', en: 'TV Host' }, img: ozlem },
    { name: 'Pascal Nouma', role: { tr: 'Sporcu', en: 'Athlete' }, img: pascal },
    { name: 'Altan Erkekli', role: { tr: 'Oyuncu', en: 'Actor' }, img: altan },
    { name: 'Candaş Tolga Işık', role: { tr: 'Sunucu / Gazeteci', en: 'Host / Journalist' }, img: candas },
    { name: 'Mustafa Denizli', role: { tr: 'Teknik Direktör', en: 'Football Manager' }, img: denizli },
    { name: 'Melih Gümüşbıçak', role: { tr: 'Spor Sunucusu', en: 'Sports Presenter' }, img: melih },
    { name: 'Özgür Özgülgün', role: { tr: 'Oyuncu', en: 'Actor' }, img: ozgur },
    { name: 'Buket Dereoğlu', role: { tr: 'Oyuncu', en: 'Actor' }, img: buket },
];

// Ziyaret galerisi — her ünlüye ait 2-3 görsel (aynı görseller placeholder olarak kullanıldı)
const VISITS: { name: string; images: string[] }[] = [
    { name: 'Fırat Aydınus', images: [firat, firat, firat] },
    { name: 'Özlem Yıldız', images: [ozlem, ozlem] },
    { name: 'Pascal Nouma', images: [pascal, pascal, pascal] },
    { name: 'Altan Erkekli', images: [altan, altan] },
    { name: 'Candaş Tolga Işık', images: [candas, candas, candas] },
    { name: 'Mustafa Denizli', images: [denizli, denizli] },
];

const COPY = {
    tr: {
        head: {
            title: 'Moral Takımı — Bütünleşik Onkoloji',
            description:
                'Hisar Hospital Moral Takımı: onkoloji hastalarımıza destek olmak için hastanemizi ziyaret eden sanatçılar, sporcular ve tanınmış isimler.',
        },
        crumbOnko: 'Bütünleşik Onkoloji',
        crumbCurrent: 'Moral Takımı',
        heroEyebrow: 'Bütünleşik Onkoloji',
        heroTitleTop: 'Hisar Hospital',
        heroTitleBottom: 'Moral Takımı',
        heroDesc:
            'Onkoloji hastalarımıza destek olmak için hastanemizi ziyaret eden, moral ve motivasyon veren sanatçılar, sporcular ve tanınmış isimlerden oluşan gönüllü moral takımımız.',
        membersTitle: 'Ziyaretimize gelen isimler',
        visitsTitle: 'Ziyaretlerden kareler',
        visitsDesc: 'Her karta 2-3 fotoğrafı görmek için kaydırın.',
        prevImg: 'Önceki görsel',
        nextImg: 'Sonraki görsel',
        visitAlt: (name: string, i: number) => `${name} ziyareti ${i + 1}`,
    },
    en: {
        head: {
            title: 'Morale Team — Integrated Oncology',
            description:
                'Hisar Hospital Morale Team: the artists, athletes and well-known figures who visit our hospital to support our oncology patients.',
        },
        crumbOnko: 'Integrated Oncology',
        crumbCurrent: 'Morale Team',
        heroEyebrow: 'Integrated Oncology',
        heroTitleTop: 'Hisar Hospital',
        heroTitleBottom: 'Morale Team',
        heroDesc:
            'Our volunteer morale team, made up of artists, athletes and well-known figures who visit our hospital to give support and motivation to our oncology patients.',
        membersTitle: 'The names who came to visit us',
        visitsTitle: 'Moments from the visits',
        visitsDesc: 'Swipe to see 2-3 photos on each card.',
        prevImg: 'Previous image',
        nextImg: 'Next image',
        visitAlt: (name: string, i: number) => `${name} visit ${i + 1}`,
    },
} as const;

function VisitCarousel({ item }: { item: { name: string; images: string[] } }) {
    const c = COPY[useLocale()];
    const ref = useRef<HTMLDivElement>(null);
    const scroll = (dir: -1 | 1) => {
        const el = ref.current;
        if (!el) return;
        el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
    };
    return (
        <div className="group relative overflow-hidden">
            <div
                ref={ref}
                className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {item.images.map((src, i) => (
                    <div key={i} className="relative aspect-[4/5] w-full flex-none snap-center bg-muted">
                        {/* TODO: real asset */}
                        <img src={src} alt={c.visitAlt(item.name, i)} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                ))}
            </div>
            {item.images.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={() => scroll(-1)}
                        aria-label={c.prevImg}
                        className="absolute left-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-primary opacity-0 transition group-hover:opacity-100"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scroll(1)}
                        aria-label={c.nextImg}
                        className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-primary opacity-0 transition group-hover:opacity-100"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </>
            )}
        </div>
    );
}

export default function Page() {
    const c = COPY[useLocale()];

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/moral-takimi" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/moral-takimi" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/moral-takimi" />
            </Head>

            <OnkolojiSubNav />
            <div className="container-x pt-6">
                <Breadcrumb
                    items={[
                        { label: c.crumbOnko, to: '/butunlesik-onkoloji' },
                        { label: c.crumbCurrent },
                    ]}
                />
            </div>

            {/* Hero — sade, premium, kurumsal */}
            <section className="pt-6 pb-10 lg:pt-8 lg:pb-14">
                <div className="container-x">
                    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-white">
                        <div className="grid lg:grid-cols-[1.15fr_1fr]">
                            <div className="p-8 lg:p-14">
                                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-brand-orange">
                                    {c.heroEyebrow}
                                </span>
                                <h1 className="mt-3 text-3xl lg:text-5xl font-black tracking-tight text-primary">
                                    {c.heroTitleTop}
                                    <br />
                                    {c.heroTitleBottom}
                                </h1>
                                <div className="mt-5 h-px w-16 bg-brand-orange" aria-hidden />
                                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-foreground/80">{c.heroDesc}</p>
                            </div>
                            <div className="relative hidden lg:block bg-muted/50">
                                <div className="absolute inset-0 grid grid-cols-2 gap-3 p-8">
                                    {/* TODO: real asset */}
                                    <img src={firat} alt="" className="h-full w-full object-cover translate-y-4" />
                                    {/* TODO: real asset */}
                                    <img src={ozlem} alt="" className="h-full w-full object-cover -translate-y-2" />
                                    {/* TODO: real asset */}
                                    <img src={pascal} alt="" className="h-full w-full object-cover -translate-y-2" />
                                    {/* TODO: real asset */}
                                    <img src={candas} alt="" className="h-full w-full object-cover translate-y-4" />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" aria-hidden />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Moral takımı — polaroid grid, 4 sütun */}
            <section className="pb-12">
                <div className="container-x">
                    <div className="mb-8">
                        <h2 className="text-2xl lg:text-3xl font-black text-primary tracking-tight">{c.membersTitle}</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                        {MEMBERS.map((m) => (
                            <div key={m.name} className="group">
                                {/* TODO: real asset */}
                                <img src={m.img} alt={m.name} loading="lazy" className="w-full h-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ziyaret galerisi */}
            <section className="py-12 bg-muted/40">
                <div className="container-x">
                    <div className="mb-8">
                        <h2 className="text-2xl lg:text-3xl font-black text-primary tracking-tight">{c.visitsTitle}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">{c.visitsDesc}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {VISITS.map((v) => (
                            <VisitCarousel key={v.name} item={v} />
                        ))}
                    </div>
                </div>
            </section>

            <div className="container-x py-14">
                <BizeUlasin />
            </div>
        </>
    );
}

Page.layout = siteLayout;
