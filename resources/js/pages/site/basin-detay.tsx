import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Newspaper, Share2 } from 'lucide-react';

import { BizeUlasin } from '@/components/site/BizeUlasin';
import { Breadcrumb } from '@/components/site/Breadcrumb';
import { siteLayout } from '@/layouts/site-layout';
import { useLocale, useLocalizedPath } from '@/lib/i18n';
import { getPressBySlug } from '@/lib/site-data';

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        crumbKurumsal: 'Kurumsal',
        crumbPress: 'Basında Hastanemiz',
        back: 'Basında Hastanemiz',
        share: 'Paylaş',
        shareDesc: 'Bu içeriği bağlantıyı kopyalayarak paylaşabilirsiniz.',
        contactTitle: 'Bu haber hakkında bilgi alın',
        notFoundTitle: 'Haber Detayı',
        notFoundDesc: 'Hisar Hospital basın haberi detayı.',
        notFound: 'Haber bulunamadı.',
        allNews: 'Tüm haberler',
    },
    en: {
        crumbKurumsal: 'Corporate',
        crumbPress: 'In the Press',
        back: 'In the Press',
        share: 'Share',
        shareDesc: 'You can share this content by copying the link.',
        contactTitle: 'Get information about this news',
        notFoundTitle: 'News Detail',
        notFoundDesc: 'Hisar Hospital press news detail.',
        notFound: 'News not found.',
        allNews: 'All news',
    },
} as const;

function formatDate(iso: string, locale: 'tr' | 'en'): string {
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return iso;
    return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(y, m - 1, d));
}

export default function PressDetailPage() {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const { slug } = usePage().props as unknown as { slug: string };
    const data = getPressBySlug(slug, locale);

    if (!data) {
        return (
            <>
                <Head title={c.notFoundTitle}>
                    <meta name="description" content={c.notFoundDesc} />
                </Head>
                <div className="container-x py-24 text-center">
                    <p className="text-muted-foreground">{c.notFound}</p>
                    <Link href={lp('/basinda-hastanemiz')} className="text-primary mt-4 inline-flex font-semibold">
                        ← {c.allNews}
                    </Link>
                </div>
            </>
        );
    }

    const title = `${data.title} — Hisar Hospital`;

    return (
        <>
            <Head title={title}>
                <meta name="description" content={data.excerpt} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={data.excerpt} />
                <meta property="og:image" content={data.cover} />
                <link rel="alternate" hrefLang="tr" href={`https://app.hisarweb.test/basinda-hastanemiz/${data.slug}`} />
                <link rel="alternate" hrefLang="en" href={`https://app.hisarweb.test/en/basinda-hastanemiz/${data.slug}`} />
                <link rel="alternate" hrefLang="x-default" href={`https://app.hisarweb.test/basinda-hastanemiz/${data.slug}`} />
            </Head>

            <Breadcrumb
                items={[{ label: c.crumbKurumsal, to: '/kurumsal' }, { label: c.crumbPress, to: '/basinda-hastanemiz' }, { label: data.title }]}
            />

            <section className="container-x py-6 lg:py-10">
                <Link
                    href={lp('/basinda-hastanemiz')}
                    className="text-primary/70 hover:text-primary inline-flex items-center gap-1 text-[12px] font-semibold"
                >
                    <ArrowLeft className="h-3.5 w-3.5" /> {c.back}
                </Link>
                <h1 className="text-primary mt-2 max-w-4xl text-2xl leading-tight font-black tracking-tight lg:text-4xl">{data.title}</h1>
                <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px]">
                    <span className="inline-flex items-center gap-1.5">
                        <Newspaper className="h-3.5 w-3.5" /> {data.source}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> {formatDate(data.date, locale)}
                    </span>
                </div>
            </section>

            <section className="container-x grid gap-10 pb-16 lg:grid-cols-[1fr_300px] lg:pb-24">
                <article className="max-w-3xl min-w-0">
                    <div className="border-border overflow-hidden rounded-2xl border">
                        <img src={data.cover} alt={data.title} className="aspect-[16/9] w-full object-cover" />
                        {/* TODO: real asset */}
                    </div>
                    <p className="text-foreground/90 mt-6 text-[15px] leading-[1.85] font-medium">{data.excerpt}</p>

                    <div className="mt-12">
                        <BizeUlasin title={c.contactTitle} context={data.title} />
                    </div>
                </article>

                <aside>
                    <div className="space-y-4 lg:sticky lg:top-36">
                        <div className="border-border bg-card rounded-2xl border p-5">
                            <p className="text-muted-foreground inline-flex items-center gap-1.5 text-[11px] font-semibold">
                                <Share2 className="h-3.5 w-3.5" /> {c.share}
                            </p>
                            <p className="text-muted-foreground mt-2 text-[13px]">{c.shareDesc}</p>
                        </div>
                    </div>
                </aside>
            </section>
        </>
    );
}

PressDetailPage.layout = siteLayout;
