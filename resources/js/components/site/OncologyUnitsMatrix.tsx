import { Link } from '@inertiajs/react';

import { useLocale, useLocalizedPath } from '@/lib/i18n';

/* TODO: real asset — these decorative unit icons live under the public dir. */
const BASE = '/onkoloji-ikonlar';

const ICONS = {
    tani: [`${BASE}/BOM_Iconlar-01.png`, `${BASE}/BOM_Iconlar-07.png`],
    tedavi: [
        `${BASE}/BOM_Iconlar-04.png`,
        `${BASE}/Girisimsel.png`,
        `${BASE}/BOM_Iconlar-03.png`,
        `${BASE}/BOM_Iconlar-05.png`,
        `${BASE}/BOM_Iconlar-02.png`,
        `${BASE}/BOM_Iconlar-06.png`,
        `${BASE}/HBO-1.png`,
        `${BASE}/Cocuk-Hemotoloji-ve-Onkoloji-2.svg`,
    ],
    takip: [`${BASE}/01-01.png`, `${BASE}/01-02.png`],
} as const;

const COPY = {
    tr: {
        sectionAria: 'Tanı, Tedavi ve Takip Üniteleri',
        logoAlt: 'Hisar Hospital Bütünleşik Onkoloji',
        titles: { tani: 'TANI', tedavi: 'TEDAVİ', takip: 'TAKİP' },
        tani: ['Onkolojik Tanı', 'Tıbbi Genetik'],
        tedavi: [
            'Radyasyon Onkolojisi',
            'Girişimsel Onkoloji',
            'Medikal Onkoloji',
            'Hematolojik Onkoloji',
            'Onkolojik Cerrahi',
            'Nükleer Tıp & Yataklı Radyoaktif İyot Tedavisi',
            'Hiperbarik Oksijen Tedavisi',
            'Çocuk Hematolojisi ve Onkolojisi',
        ],
        takip: ['Destekleyici Bakım ve Sağlıklı Yaşam', 'Palyatif Bakım'],
    },
    en: {
        sectionAria: 'Diagnosis, Treatment and Follow-up Units',
        logoAlt: 'Hisar Hospital Integrated Oncology',
        titles: { tani: 'DIAGNOSIS', tedavi: 'TREATMENT', takip: 'FOLLOW-UP' },
        tani: ['Oncologic Diagnosis', 'Medical Genetics'],
        tedavi: [
            'Radiation Oncology',
            'Interventional Oncology',
            'Medical Oncology',
            'Hematologic Oncology',
            'Oncologic Surgery',
            'Nuclear Medicine & Inpatient Radioactive Iodine Therapy',
            'Hyperbaric Oxygen Therapy',
            'Pediatric Hematology and Oncology',
        ],
        takip: ['Supportive Care and Healthy Living', 'Palliative Care'],
    },
} as const;

type Item = { icon: string; label: string; to?: string };

function ItemRow({ item }: { item: Item }) {
    const lp = useLocalizedPath();
    const inner = (
        <>
            <span className="flex h-16 w-16 shrink-0 items-center justify-center lg:h-[72px] lg:w-[72px]">
                {/* TODO: real asset */}
                <img
                    src={item.icon}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                />
            </span>
            <span className="min-w-0 text-balance text-center text-[13px] font-semibold leading-relaxed text-primary lg:text-sm">
                {item.label}
            </span>
        </>
    );
    const cls =
        'flex w-full min-w-0 flex-col items-center gap-2.5 rounded-xl px-2 py-3';
    return item.to ? (
        <Link href={lp(item.to)} className={`${cls} transition hover:bg-primary/5`}>
            {inner}
        </Link>
    ) : (
        <div className={cls}>{inner}</div>
    );
}

function GroupTitle({ title }: { title: string }) {
    return (
        <h3 className="text-center font-serif text-xl font-bold uppercase tracking-[0.18em] text-primary lg:text-2xl">
            {title}
        </h3>
    );
}

export function OncologyUnitsMatrix() {
    const c = COPY[useLocale()];

    const groups = [
        { key: 'tani', title: c.titles.tani, items: c.tani.map((label, i) => ({ icon: ICONS.tani[i], label })) },
        { key: 'tedavi', title: c.titles.tedavi, items: c.tedavi.map((label, i) => ({ icon: ICONS.tedavi[i], label })) },
        { key: 'takip', title: c.titles.takip, items: c.takip.map((label, i) => ({ icon: ICONS.takip[i], label })) },
    ];
    const [tani, tedavi, takip] = groups;

    return (
        <section
            aria-label={c.sectionAria}
            className="w-full max-w-full min-w-0 overflow-x-clip bg-muted/40 py-12 lg:py-16"
        >
            <div className="mx-auto w-full min-w-0 max-w-[1440px] px-5 lg:px-8">
                <div className="flex flex-col items-center text-center">
                    {/* TODO: real asset */}
                    <img
                        src={`${BASE}/Butunlesik_Onkoloji_Merkezi_Yeni_Logo_Kabul-01.png`}
                        alt={c.logoAlt}
                        className="h-16 w-auto max-w-full object-contain lg:h-20"
                    />
                </div>

                {/* Desktop / tablet — TANI | TEDAVİ (geniş) | TAKİP */}
                <div className="mt-10 hidden w-full min-w-0 grid-cols-[minmax(200px,0.9fr)_minmax(640px,3.4fr)_minmax(200px,0.9fr)] gap-0 md:grid lg:mt-14">
                    <div className="min-w-0 pr-5 lg:pr-8">
                        <GroupTitle title={tani.title} />
                        <div className="mt-6 grid grid-cols-1 gap-y-6">
                            {tani.items.map((it) => (
                                <ItemRow key={it.label} item={it} />
                            ))}
                        </div>
                    </div>

                    <div className="min-w-0 border-x-2 border-dotted border-primary/25 px-5 lg:px-10">
                        <GroupTitle title={tedavi.title} />
                        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:gap-x-10">
                            {tedavi.items.map((it) => (
                                <ItemRow key={it.label} item={it} />
                            ))}
                        </div>
                    </div>

                    <div className="min-w-0 pl-5 lg:pl-8">
                        <GroupTitle title={takip.title} />
                        <div className="mt-6 grid grid-cols-1 gap-y-6">
                            {takip.items.map((it) => (
                                <ItemRow key={it.label} item={it} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobil — dikey, tam genişlik */}
                <div className="mt-8 grid w-full min-w-0 grid-cols-1 gap-8 md:hidden">
                    {groups.map((g) => (
                        <div key={g.key} className="min-w-0">
                            <h3 className="border-b border-dotted border-primary/30 pb-2 text-center font-serif text-lg font-bold uppercase tracking-[0.16em] text-primary">
                                {g.title}
                            </h3>
                            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5">
                                {g.items.map((it) => (
                                    <ItemRow key={it.label} item={it} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
