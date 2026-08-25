import { Head } from '@inertiajs/react';
import { Baby, Calendar, HeartHandshake, MessageCircle, Sparkles, Users, ChevronDown } from 'lucide-react';

import { siteLayout } from '@/layouts/site-layout';
import { Breadcrumb } from '@/components/site/Breadcrumb';
import { useLocale } from '@/lib/i18n';

const COPY = {
    tr: {
        head: {
            title: 'Gebe Okulu — Hisar Hospital',
            description:
                'Gebelik, doğuma hazırlık, emzirme ve yenidoğan bakımı üzerine uzman eğitmenlerle Gebe Okulu programı.',
        },
        heroBadge: 'Gebe Okulu',
        heroTitle: 'Anneliğe güvenli, bilinçli ve destekli bir başlangıç.',
        heroDesc:
            'Uzman kadın doğum hekimleri, hemşireler ve psikologlar eşliğinde gebelik, doğum ve doğum sonrası dönemi kapsayan çok başlıklı bir eğitim programı.',
        register: 'Kayıt Ol',
        crumbCorporate: 'Kurumsal',
        crumbCurrent: 'Gebe Okulu',
        whatTitle: 'Gebe Okulu Nedir?',
        whatBody:
            'Gebelikten doğum sonrası döneme kadar anne adaylarının ve eşlerinin bilgi, farkındalık ve öz-güven kazandığı yapılandırılmış bir eğitim programıdır. Programımız; tıbbi bilgi, uygulamalı egzersizler ve grup deneyimini bir araya getirir.',
        whoTitle: 'Kimler Katılabilir?',
        who: [
            '16. gebelik haftasından itibaren tüm anne adayları',
            'Eşler ve doğuma refakat edecek yakınlar',
            'Doğum sonrası dönemde destek ihtiyacı olan aileler',
        ],
        topicsTitle: 'Eğitim İçerikleri',
        topics: [
            { title: 'Gebelik Süreci', desc: 'Trimester bazlı fiziksel ve duygusal değişiklikler, beslenme ve rutin takip.' },
            { title: 'Doğuma Hazırlık', desc: 'Normal doğum ve sezaryen süreci, nefes ve rahatlama teknikleri, doğum çantası.' },
            { title: 'Emzirme Eğitimi', desc: 'İlk emzirme, laktasyon, doğru pozisyonlar ve sık karşılaşılan güçlükler.' },
            { title: 'Yenidoğan Bakımı', desc: 'Beslenme, uyku, banyo, göbek ve cilt bakımı, aşı takvimi.' },
            { title: 'Anne Psikolojisi', desc: 'Doğum sonrası duygusal değişimler, aile içi destek, postpartum farkındalık.' },
        ],
        programTitle: 'Eğitim Programı',
        program: [
            { week: 'Hafta 1', title: 'Tanışma & Gebelikte Sağlıklı Yaşam', date: 'Cumartesi 10:00 – 12:00' },
            { week: 'Hafta 2', title: 'Doğuma Fiziksel Hazırlık', date: 'Cumartesi 10:00 – 12:00' },
            { week: 'Hafta 3', title: 'Nefes, Rahatlama ve Doğum Süreci', date: 'Cumartesi 10:00 – 12:00' },
            { week: 'Hafta 4', title: 'Emzirme ve Yenidoğan Bakımı', date: 'Cumartesi 10:00 – 12:00' },
        ],
        instructorsTitle: 'Eğitimciler',
        instructors: [
            { role: 'Kadın Hastalıkları ve Doğum Uzmanı', who: 'Program içeriğinin tıbbi çerçevesini yürütür.' },
            { role: 'Doğum ve Emzirme Danışmanı', who: 'Uygulamalı doğum ve emzirme oturumlarını yönetir.' },
            { role: 'Psikolog', who: 'Duygusal hazırlık ve postpartum destek oturumlarını yürütür.' },
        ],
        faqEyebrow: '— SSS',
        faqTitle: 'Sık Sorulan Sorular',
        faq: [
            ['Program ücretli mi?', 'Program çerçevesi ve ücretlendirme detayları için İletişim Merkezimizle görüşebilirsiniz.'],
            ['Eşim de katılabilir mi?', 'Evet, belirli oturumlar özellikle eşlerin katılımı için tasarlanmıştır.'],
            ['Kaç kişilik gruplar oluşturuluyor?', 'Verimli bir deneyim için gruplar sınırlı sayıda anne adayıyla oluşturulur.'],
        ],
        formBadge: 'Kayıt Formu',
        formTitle: 'Yaklaşan programa kayıt olun',
        formDesc: 'Bilgilerinizi bırakın; program takvimi netleştiğinde sizi bilgilendirelim.',
        formNote: 'Form yalnızca tasarım prototipidir; kayıt gönderimi aktif değildir.',
        fName: 'Ad Soyad',
        fWeek: 'Gebelik haftası',
        fPhone: 'Telefon',
        fEmail: 'E-posta',
        fNoteAria: 'Not',
        fNotePlaceholder: 'Notunuz (opsiyonel)',
    },
    en: {
        head: {
            title: 'Pregnancy School — Hisar Hospital',
            description:
                'The Pregnancy School program with expert instructors on pregnancy, birth preparation, breastfeeding and newborn care.',
        },
        heroBadge: 'Pregnancy School',
        heroTitle: 'A safe, informed and supported start to motherhood.',
        heroDesc:
            'A multi-topic training program covering pregnancy, birth and the postpartum period, accompanied by expert obstetricians, nurses and psychologists.',
        register: 'Register',
        crumbCorporate: 'Corporate',
        crumbCurrent: 'Pregnancy School',
        whatTitle: 'What Is the Pregnancy School?',
        whatBody:
            'It is a structured training program in which expectant mothers and their partners gain knowledge, awareness and self-confidence from pregnancy through the postpartum period. Our program brings together medical knowledge, practical exercises and group experience.',
        whoTitle: 'Who Can Participate?',
        who: [
            'All expectant mothers from the 16th week of pregnancy',
            'Partners and relatives who will accompany the birth',
            'Families in need of support during the postpartum period',
        ],
        topicsTitle: 'Training Content',
        topics: [
            { title: 'Pregnancy Process', desc: 'Trimester-based physical and emotional changes, nutrition and routine follow-up.' },
            { title: 'Birth Preparation', desc: 'Vaginal birth and cesarean process, breathing and relaxation techniques, hospital bag.' },
            { title: 'Breastfeeding Education', desc: 'First breastfeeding, lactation, correct positions and commonly encountered difficulties.' },
            { title: 'Newborn Care', desc: 'Feeding, sleep, bathing, umbilical and skin care, vaccination schedule.' },
            { title: 'Maternal Psychology', desc: 'Postpartum emotional changes, family support, postpartum awareness.' },
        ],
        programTitle: 'Training Program',
        program: [
            { week: 'Week 1', title: 'Introduction & Healthy Living During Pregnancy', date: 'Saturday 10:00 – 12:00' },
            { week: 'Week 2', title: 'Physical Preparation for Birth', date: 'Saturday 10:00 – 12:00' },
            { week: 'Week 3', title: 'Breathing, Relaxation and the Birth Process', date: 'Saturday 10:00 – 12:00' },
            { week: 'Week 4', title: 'Breastfeeding and Newborn Care', date: 'Saturday 10:00 – 12:00' },
        ],
        instructorsTitle: 'Instructors',
        instructors: [
            { role: 'Obstetrics and Gynecology Specialist', who: 'Leads the medical framework of the program content.' },
            { role: 'Birth and Breastfeeding Consultant', who: 'Manages the practical birth and breastfeeding sessions.' },
            { role: 'Psychologist', who: 'Leads the emotional preparation and postpartum support sessions.' },
        ],
        faqEyebrow: '— FAQ',
        faqTitle: 'Frequently Asked Questions',
        faq: [
            ['Is the program paid?', 'You can contact our Communication Center for details about the program framework and pricing.'],
            ['Can my partner also attend?', 'Yes, certain sessions are specially designed for the participation of partners.'],
            ['How many people are in each group?', 'For an effective experience, groups are formed with a limited number of expectant mothers.'],
        ],
        formBadge: 'Registration Form',
        formTitle: 'Register for the upcoming program',
        formDesc: "Leave your details; we'll inform you once the program schedule is confirmed.",
        formNote: 'This form is only a design prototype; submission is not active.',
        fName: 'Full Name',
        fWeek: 'Week of pregnancy',
        fPhone: 'Phone',
        fEmail: 'Email',
        fNoteAria: 'Note',
        fNotePlaceholder: 'Your note (optional)',
    },
} as const;

export default function Page() {
    const c = COPY[useLocale()];

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/gebe-okulu" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/gebe-okulu" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/gebe-okulu" />
            </Head>

            <div className="relative overflow-hidden bg-gradient-primary text-primary-foreground">
                <div className="container-x py-12 lg:py-20 relative">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden /> {c.heroBadge}
                    </div>
                    <h1 className="mt-3 text-3xl lg:text-5xl font-black leading-tight max-w-3xl">{c.heroTitle}</h1>
                    <p className="mt-4 max-w-2xl text-sm lg:text-base text-primary-foreground/85">{c.heroDesc}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <a href="#kayit" className="inline-flex items-center rounded-full bg-brand-orange px-5 py-2.5 text-sm font-bold text-brand-orange-foreground">
                            {c.register}
                        </a>
                        <a href="tel:4445888" className="inline-flex items-center rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold border border-white/20">
                            444 5 888
                        </a>
                    </div>
                </div>
            </div>
            <Breadcrumb items={[{ label: c.crumbCorporate, to: '/kurumsal' }, { label: c.crumbCurrent }]} />

            <section className="py-10 lg:py-14 space-y-12">
                <div className="container-x grid lg:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-black text-primary">{c.whatTitle}</h2>
                        <p className="mt-3 text-sm text-foreground/85">{c.whatBody}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-gradient-card p-6">
                        <h3 className="text-lg font-bold text-primary">{c.whoTitle}</h3>
                        <ul className="mt-3 space-y-2 text-sm text-foreground/85">
                            {c.who.map((x) => (
                                <li key={x} className="flex gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" aria-hidden />
                                    {x}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="container-x">
                    <h2 className="text-2xl font-black text-primary mb-5">{c.topicsTitle}</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {c.topics.map((t) => (
                            <article key={t.title} className="hover-lift rounded-2xl border border-border/70 bg-card p-5">
                                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft">
                                    <Baby className="h-5 w-5 text-primary" aria-hidden />
                                </span>
                                <h3 className="mt-3 text-[15px] font-bold text-primary">{t.title}</h3>
                                <p className="mt-1.5 text-xs text-muted-foreground">{t.desc}</p>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="container-x grid lg:grid-cols-[1.2fr_1fr] gap-8">
                    <div>
                        <h2 className="text-2xl font-black text-primary mb-4">{c.programTitle}</h2>
                        <ol className="rounded-2xl border border-border/70 bg-card divide-y divide-border/60">
                            {c.program.map((p, i) => (
                                <li key={i} className="p-4 flex items-center gap-4">
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">{p.week}</p>
                                        <h3 className="text-sm font-bold text-primary truncate">{p.title}</h3>
                                        <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                                            <Calendar className="h-3 w-3" aria-hidden />
                                            {p.date}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-primary mb-4">{c.instructorsTitle}</h2>
                        <div className="space-y-3">
                            {c.instructors.map((e) => (
                                <div key={e.role} className="rounded-2xl border border-border/70 bg-gradient-card p-4 flex gap-3">
                                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft">
                                        <Users className="h-5 w-5 text-primary" aria-hidden />
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold text-primary">{e.role}</p>
                                        <p className="text-xs text-muted-foreground">{e.who}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="container-x">
                    <div className="mx-auto max-w-3xl">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">{c.faqEyebrow}</p>
                        <h2 className="mt-2 text-xl lg:text-2xl font-black text-primary tracking-tight">{c.faqTitle}</h2>
                        <div className="mt-6 divide-y divide-border/60 border-y border-border/60">
                            {c.faq.map(([q, a]) => (
                                <details key={q} className="group py-4">
                                    <summary className="cursor-pointer text-sm font-bold text-primary flex items-center justify-between gap-3">
                                        <span>{q}</span>
                                        <ChevronDown
                                            className="h-4 w-4 shrink-0 text-brand-orange transition-transform duration-200 ease-out group-open:rotate-180"
                                            aria-hidden
                                        />
                                    </summary>
                                    <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="container-x" id="kayit">
                    <div className="rounded-3xl border border-border/70 bg-gradient-card p-6 lg:p-10 grid lg:grid-cols-2 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold text-primary">
                                <HeartHandshake className="h-3.5 w-3.5" aria-hidden /> {c.formBadge}
                            </div>
                            <h3 className="mt-3 text-2xl font-black text-primary">{c.formTitle}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{c.formDesc}</p>
                            <p className="mt-4 text-[11px] text-muted-foreground">{c.formNote}</p>
                            <a href="tel:4445888" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">
                                <MessageCircle className="h-4 w-4 text-brand-orange" aria-hidden /> 444 5 888
                            </a>
                        </div>
                        <form className="grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input aria-label={c.fName} placeholder={c.fName} className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm" />
                            <input aria-label={c.fWeek} placeholder={c.fWeek} className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm" />
                            <input aria-label={c.fPhone} placeholder={c.fPhone} className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm" />
                            <input aria-label={c.fEmail} type="email" placeholder={c.fEmail} className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm" />
                            <textarea
                                aria-label={c.fNoteAria}
                                placeholder={c.fNotePlaceholder}
                                className="sm:col-span-2 rounded-xl border border-border/70 bg-background px-3 py-2 text-sm min-h-[100px]"
                            />
                            <button className="sm:col-span-2 h-11 rounded-full bg-gradient-orange text-brand-orange-foreground text-sm font-bold">
                                {c.register}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

Page.layout = siteLayout;
