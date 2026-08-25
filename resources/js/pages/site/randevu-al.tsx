import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Search, Stethoscope, MapPin, Building2, Calendar as CalendarIcon, Clock, ShieldCheck, User as UserIcon,
    Check, ChevronLeft, ChevronRight, X, Phone, Mail, MessageSquare, CalendarCheck2, Sparkles, Loader2,
    CalendarDays, Download, Share2,
} from 'lucide-react';

import { siteLayout } from '@/layouts/site-layout';
import { cn } from '@/lib/utils';
import { useLocale, useLocalizedPath, type Locale } from '@/lib/i18n';
import { useDoctors, useHospitals, type Doctor, normalizeTr } from '@/lib/site-data';

/* ------------------------------------------------------------------ */
/*  Appointment slot helpers (inlined — deterministic demo data)       */
/* ------------------------------------------------------------------ */

const PREFILL_KEY = 'hh_appt_prefill';
const PREFILL_TTL_MS = 10 * 60 * 1000;

type AppointmentPrefill = {
    doctorId: string;
    date?: string | null;
    slotId?: string | null;
    time?: string | null;
    ts: number;
};

type AppointmentSlot = { id: string; doctorId: string; date: string; time: string };

function consumeAppointmentPrefill(): AppointmentPrefill | null {
    try {
        const raw = sessionStorage.getItem(PREFILL_KEY);
        if (!raw) return null;
        sessionStorage.removeItem(PREFILL_KEY);
        const parsed = JSON.parse(raw) as AppointmentPrefill;
        if (!parsed?.doctorId) return null;
        if (Date.now() - parsed.ts > PREFILL_TTL_MS) return null;
        return parsed;
    } catch {
        return null;
    }
}

const SLOT_TIMES = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:15',
];

function pad(n: number) { return String(n).padStart(2, '0'); }

function localDateISO(d: Date): string {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function slotId(doctorId: string, iso: string, time: string): string {
    return `${doctorId}__${iso}__${time.replace(':', '')}`;
}

/** Shared deterministic demo availability. */
function getAppointmentSlots(doctorId: string, iso: string): AppointmentSlot[] {
    let h = 0;
    const key = `${doctorId}:${iso}`;
    for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) >>> 0;

    const available = SLOT_TIMES.filter((time, index) => {
        if (time === '16:00' || time === '17:15') return true;
        return ((h >> (index % 16)) & 1) === 1;
    });

    return available.map((time) => ({ id: slotId(doctorId, iso, time), doctorId, date: iso, time }));
}

function resolveAppointmentSlot(
    doctorId: string,
    iso: string,
    pick: { slotId?: string | null; time?: string | null },
): AppointmentSlot | null {
    const slots = getAppointmentSlots(doctorId, iso);
    if (pick.slotId) {
        const byId = slots.find((slot) => slot.id === pick.slotId);
        if (byId) return byId;
    }
    if (pick.time) {
        const byTime = slots.find((slot) => slot.time === pick.time);
        if (byTime) return byTime;
    }
    return null;
}

/* ------------------------------------------------------------------ */
/*  Types & locale-aware helpers                                       */
/* ------------------------------------------------------------------ */

type Hosp = 'all' | string;

type FormState = {
    doctor: Doctor | null;
    date: string | null;   // ISO yyyy-mm-dd
    slotId: string | null;
    time: string | null;   // HH:mm
    phone: string;
    otp: string;
    otpVerified: boolean;
    firstName: string;
    lastName: string;
    email: string;
    tc: string;
    isInternational: boolean;
    passport: string;
    nationality: string;
    note: string;
    kvkk: boolean;
};

/** Short hospital labels keyed by slug — proper nouns, identical in both locales. */
const hospitalLabel: Record<string, string> = {
    intercontinental: 'Hisar Intercontinental',
    camlica: 'Hisar Çamlıca',
};

const STEP_ICONS = [Stethoscope, CalendarIcon, ShieldCheck, UserIcon, CalendarCheck2];

function dloc(locale: Locale) { return locale === 'en' ? 'en-GB' : 'tr-TR'; }

function maskPhone(digits: string) {
    const d = digits.replace(/\D/g, '');
    if (d.length < 4) return d ? `+90 ${d}` : '';
    const last2 = d.slice(-2);
    return `+90 ••• ••• •• ${last2}`;
}

function maskEmail(email: string) {
    const [user, domain] = email.split('@');
    if (!domain) return email;
    const visible = user.slice(0, Math.min(2, user.length));
    const hidden = '•'.repeat(Math.max(1, user.length - visible.length));
    return `${visible}${hidden}@${domain}`;
}

function formatDate(iso: string, locale: Locale) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(dloc(locale), { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' });
}

/* ──────────────────── BILINGUAL COPY (every visible string TR + EN) ──────────────────── */
const COPY = {
    tr: {
        head: {
            title: 'Randevu Al — Hisar Hospital',
            description: 'Hisar Hospital online randevu: doktor seçin, uygun tarihi belirleyin ve birkaç adımda randevunuzu oluşturun.',
            ogDescription: 'Doktor, tarih ve iletişim bilgilerinizle birkaç adımda online randevu.',
        },
        heroTitle: 'Randevunuzu Oluşturun',
        heroDesc: 'Doktor, tarih ve iletişim bilgilerinizi girin — birkaç adımda randevunuz hazır.',
        steps: ['Doktor', 'Tarih & Saat', 'Doğrulama', 'İletişim', 'Özet'],
        stepOf: (step: number) => `Adım ${step} / 5`,
        block: {
            doctor: 'Devam etmek için bir doktor seçin.',
            date: 'Devam etmek için bir tarih seçin.',
            time: 'Devam etmek için uygun bir saat seçin.',
            verify: 'Devam etmek için telefonunuzu doğrulayın.',
            firstName: 'Adınızı girin.',
            lastName: 'Soyadınızı girin.',
            email: 'Geçerli bir e-posta girin.',
            passport: 'Pasaport numaranızı girin.',
            nationality: 'Uyruğunuzu girin.',
            kvkk: 'Devam etmek için KVKK onayını işaretleyin.',
        },
        prefillNotice: 'Seçtiğiniz saat artık uygun değil. Lütfen listeden başka bir saat seçin.',
        prefillClose: 'Uyarıyı kapat',
        dock: {
            region: 'Randevu adım işlemleri',
            back: 'Geri',
            change: 'Değiştir',
            continue: 'Devam Et',
            toSummary: 'Randevu Özetine Geç',
            submit: 'Randevu Talebini Gönder',
            ready: 'Randevu hazır',
            phoneVerified: 'Telefon doğrulandı',
            phoneWaiting: 'Telefon doğrulaması bekleniyor',
        },
        doctor: {
            eyebrow: 'Adım 1',
            title: 'Doktor Seçimi',
            subtitle: 'Doktor adı veya şikayetinizle arayın; ya da hastane & bölüm ile daraltın.',
            searchPlaceholder: 'Ad, uzmanlık veya şikayet (örn. bel ağrısı)...',
            clear: 'Temizle',
            or: 'VEYA',
            hospital: 'Hastane',
            hospitalDefault: 'Hastane seçin',
            department: 'Bölüm',
            departmentDefault: 'Bölüm seçin',
            emptyTitle: 'Aramaya başlayın',
            emptySubtitle: 'Doktor adı, uzmanlık veya şikayetinizi yazın ya da hastane / bölüm seçin.',
        },
        dt: {
            eyebrow: 'Adım 2',
            title: 'Tarih & Saat',
            subtitle: (name: string) => `${name} için uygun bir gün ve saat seçin.`,
            prevDay: 'Önceki gün',
            nextDay: 'Sonraki gün',
            daysAria: 'Randevu günleri',
            availableTimes: 'Uygun Saatler',
            pickDayTitle: 'Önce gün seçin',
            pickDaySubtitle: 'Uygun saatler seçtiğiniz güne göre listelenir.',
            noSlotTitle: 'Bu gün için uygun saat yok',
            noSlotSubtitle: 'Lütfen başka bir gün seçin.',
        },
        verify: {
            eyebrow: 'Adım 3',
            title: 'Telefon Doğrulama',
            subtitle: 'Randevunuzu güvenle tamamlamak için telefon numaranızı doğrulayın.',
            phoneLabel: 'Telefon numarası',
            send: 'Kod Gönder',
            resend: 'Yeniden Gönder',
            codeLabel: 'Doğrulama Kodu',
            demoHint: 'Demo — 6 haneli herhangi bir kod',
            codePlaceholder: '6 haneli kod',
            verified: 'Numara doğrulandı',
            info: 'Numaranıza SMS ile 6 haneli doğrulama kodu gönderilecektir. Kod, sadece randevu güvenliği için kullanılır.',
        },
        contact: {
            eyebrow: 'Adım 4',
            title: 'İletişim Bilgileri',
            subtitle: 'Size ulaşabilmemiz için birkaç bilgi yeterli.',
            firstName: 'Ad',
            firstNamePlaceholder: 'Adınız',
            lastName: 'Soyad',
            lastNamePlaceholder: 'Soyadınız',
            phone: 'Telefon',
            change: 'Değiştir',
            email: 'E-posta',
            optional: 'Opsiyonel',
            emailPlaceholder: 'ornek@eposta.com',
            emailInvalid: 'Geçerli bir e-posta girin.',
            note: 'Notunuz',
            notePlaceholder: 'Şikayetiniz veya iletmek istedikleriniz…',
            international: 'Uluslararası hasta / International patient',
            passport: 'Pasaport No',
            nationality: 'Uyruk / Nationality',
            kvkkLink: 'KVKK aydınlatma metnini',
            kvkkAfter: ' okudum, verilerimin randevu süreci için işlenmesini onaylıyorum.',
            kvkkBefore: '',
        },
        summary: {
            eyebrow: 'Adım 5',
            title: 'Randevu Özeti',
            subtitle: 'Bilgileri kontrol edin, dilediğiniz satırı düzenleyin.',
            doctor: 'Doktor',
            hospitalDept: 'Hastane & Bölüm',
            dateTime: 'Tarih & Saat',
            contact: 'İletişim Bilgileri',
            edit: 'Düzenle',
            notePrefix: 'Not: ',
            footerBefore: 'Göndererek ',
            footerLink: 'KVKK Aydınlatma Metnini',
            footerAfter: ' okuduğunuzu kabul edersiniz.',
            prototype: 'Bu bir tasarım prototipidir; randevu gönderimi aktif değildir ve gerçek bir randevu oluşturulmaz.',
        },
        success: {
            title: 'Randevunuz Oluşturuldu',
            received: 'Randevu talebiniz alındı.',
            prototype: 'Bu bir prototiptir; gerçek bir randevu oluşturulmamıştır.',
            appointmentNo: 'Randevu No',
            calendar: 'Takvim',
            download: 'İndir',
            share: 'Paylaş',
            myAppointments: 'Randevularım',
            backHome: 'Ana Sayfaya Dön',
            icsSummary: (name: string) => `Hisar Hospital Randevusu — ${name}`,
            icsCode: 'Randevu Kodu',
            icsDept: 'Bölüm',
            icsDoctor: 'Doktor',
            canvasConfirm: 'Randevu Onayı',
            canvasCreated: 'Randevunuz Oluşturuldu',
            canvasCode: 'RANDEVU KODU',
            rowDept: 'Bölüm',
            rowDoctor: 'Doktor',
            rowDateTime: 'Tarih & Saat',
            rowHospital: 'Hastane',
            shareTitle: 'Hisar Hospital Randevusu',
            shareHeading: 'Hisar Hospital Randevum',
            shareCode: 'Kod: ',
        },
    },
    en: {
        head: {
            title: 'Book Appointment — Hisar Hospital',
            description: 'Hisar Hospital online booking: choose a doctor, set an available date and create your appointment in a few steps.',
            ogDescription: 'Online booking in a few steps with your doctor, date and contact details.',
        },
        heroTitle: 'Create Your Appointment',
        heroDesc: 'Enter your doctor, date and contact details — your appointment is ready in a few steps.',
        steps: ['Doctor', 'Date & Time', 'Verification', 'Contact', 'Summary'],
        stepOf: (step: number) => `Step ${step} / 5`,
        block: {
            doctor: 'Select a doctor to continue.',
            date: 'Select a date to continue.',
            time: 'Select an available time to continue.',
            verify: 'Verify your phone to continue.',
            firstName: 'Enter your first name.',
            lastName: 'Enter your last name.',
            email: 'Enter a valid email.',
            passport: 'Enter your passport number.',
            nationality: 'Enter your nationality.',
            kvkk: 'Check the KVKK consent to continue.',
        },
        prefillNotice: 'Your selected time is no longer available. Please choose another time from the list.',
        prefillClose: 'Close warning',
        dock: {
            region: 'Appointment step actions',
            back: 'Back',
            change: 'Change',
            continue: 'Continue',
            toSummary: 'Go to Appointment Summary',
            submit: 'Submit Appointment Request',
            ready: 'Appointment ready',
            phoneVerified: 'Phone verified',
            phoneWaiting: 'Awaiting phone verification',
        },
        doctor: {
            eyebrow: 'Step 1',
            title: 'Doctor Selection',
            subtitle: 'Search by doctor name or your symptom; or narrow down by hospital & department.',
            searchPlaceholder: 'Name, specialty or symptom (e.g. back pain)...',
            clear: 'Clear',
            or: 'OR',
            hospital: 'Hospital',
            hospitalDefault: 'Select hospital',
            department: 'Department',
            departmentDefault: 'Select department',
            emptyTitle: 'Start searching',
            emptySubtitle: 'Type a doctor name, specialty or your symptom, or select a hospital / department.',
        },
        dt: {
            eyebrow: 'Step 2',
            title: 'Date & Time',
            subtitle: (name: string) => `Choose an available day and time for ${name}.`,
            prevDay: 'Previous day',
            nextDay: 'Next day',
            daysAria: 'Appointment days',
            availableTimes: 'Available Times',
            pickDayTitle: 'Select a day first',
            pickDaySubtitle: 'Available times are listed based on the day you select.',
            noSlotTitle: 'No available times for this day',
            noSlotSubtitle: 'Please select another day.',
        },
        verify: {
            eyebrow: 'Step 3',
            title: 'Phone Verification',
            subtitle: 'Verify your phone number to complete your appointment securely.',
            phoneLabel: 'Phone number',
            send: 'Send Code',
            resend: 'Resend',
            codeLabel: 'Verification Code',
            demoHint: 'Demo — any 6-digit code',
            codePlaceholder: '6-digit code',
            verified: 'Number verified',
            info: 'A 6-digit verification code will be sent to your number via SMS. The code is used only for appointment security.',
        },
        contact: {
            eyebrow: 'Step 4',
            title: 'Contact Information',
            subtitle: 'A few details are enough for us to reach you.',
            firstName: 'First Name',
            firstNamePlaceholder: 'Your first name',
            lastName: 'Last Name',
            lastNamePlaceholder: 'Your last name',
            phone: 'Phone',
            change: 'Change',
            email: 'Email',
            optional: 'Optional',
            emailPlaceholder: 'example@email.com',
            emailInvalid: 'Enter a valid email.',
            note: 'Your Note',
            notePlaceholder: 'Your symptom or anything you want to share…',
            international: 'Uluslararası hasta / International patient',
            passport: 'Passport No',
            nationality: 'Uyruk / Nationality',
            kvkkLink: 'KVKK privacy notice',
            kvkkAfter: ' and consent to my data being processed for the appointment.',
            kvkkBefore: 'I have read the ',
        },
        summary: {
            eyebrow: 'Step 5',
            title: 'Appointment Summary',
            subtitle: 'Check the details and edit any row you like.',
            doctor: 'Doctor',
            hospitalDept: 'Hospital & Department',
            dateTime: 'Date & Time',
            contact: 'Contact Information',
            edit: 'Edit',
            notePrefix: 'Note: ',
            footerBefore: 'By submitting, you accept that you have read the ',
            footerLink: 'KVKK Privacy Notice',
            footerAfter: '.',
            prototype: 'This is a design prototype; appointment submission is not active and no real appointment is created.',
        },
        success: {
            title: 'Your Appointment Has Been Created',
            received: 'Your appointment request has been received.',
            prototype: 'This is a prototype; no real appointment has been created.',
            appointmentNo: 'Appointment No',
            calendar: 'Calendar',
            download: 'Download',
            share: 'Share',
            myAppointments: 'My Appointments',
            backHome: 'Back to Home',
            icsSummary: (name: string) => `Hisar Hospital Appointment — ${name}`,
            icsCode: 'Appointment Code',
            icsDept: 'Department',
            icsDoctor: 'Doctor',
            canvasConfirm: 'Appointment Confirmation',
            canvasCreated: 'Your Appointment Has Been Created',
            canvasCode: 'APPOINTMENT CODE',
            rowDept: 'Department',
            rowDoctor: 'Doctor',
            rowDateTime: 'Date & Time',
            rowHospital: 'Hospital',
            shareTitle: 'Hisar Hospital Appointment',
            shareHeading: 'My Hisar Hospital Appointment',
            shareCode: 'Code: ',
        },
    },
} as const;

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

export default function AppointmentWizard() {
    const locale = useLocale();
    const c = COPY[locale];
    const doctors = useDoctors();
    const [step, setStep] = useState(1);
    const [confirmed, setConfirmed] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [prefillNotice, setPrefillNotice] = useState<string | null>(null);
    const [state, setState] = useState<FormState>({
        doctor: null, date: null, slotId: null, time: null,
        phone: '', otp: '', otpVerified: false,
        firstName: '', lastName: '', email: '', tc: '',
        isInternational: false, passport: '', nationality: '',
        note: '',
        kvkk: false,
    });

    const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setState((s) => ({ ...s, [k]: v }));

    // Reasons a step can't advance — surfaced inline for the user.
    const nextBlockedReason = useMemo(() => {
        if (step === 1) return state.doctor ? null : c.block.doctor;
        if (step === 2) {
            if (!state.date) return c.block.date;
            if (!state.time) return c.block.time;
            return null;
        }
        if (step === 3) return state.otpVerified ? null : c.block.verify;
        if (step === 4) {
            if (state.firstName.trim().length < 2) return c.block.firstName;
            if (state.lastName.trim().length < 2) return c.block.lastName;
            if (state.email.trim() && !/^\S+@\S+\.\S+$/.test(state.email.trim())) return c.block.email;
            if (state.isInternational) {
                if (state.passport.trim().length < 4) return c.block.passport;
                if (state.nationality.trim().length < 2) return c.block.nationality;
            }
            if (!state.kvkk) return c.block.kvkk;
            return null;
        }
        return null;
    }, [step, state, c]);
    const canNext = nextBlockedReason === null;

    const next = () => setStep((s) => Math.min(5, s + 1));
    const prev = () => setStep((s) => Math.max(1, s - 1));

    useEffect(() => {
        // Scroll to top of wizard on step change
        document.getElementById('wizard-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [step, confirmed]);

    // Hydrate wizard from a doctor CV → randevu handoff (sessionStorage).
    useEffect(() => {
        const prefill = consumeAppointmentPrefill();
        if (!prefill) return;
        const doc = doctors.find((d) => d.id === prefill.doctorId);
        if (!doc) return;
        setState((s) => ({ ...s, doctor: doc }));

        if (!prefill.date) {
            setStep(2);
            return;
        }
        const iso = prefill.date;
        const slot = resolveAppointmentSlot(doc.id, iso, { slotId: prefill.slotId, time: prefill.time });
        if (slot) {
            setState((s) => ({ ...s, date: iso, slotId: slot.id, time: slot.time }));
            setStep(3);
        } else {
            setState((s) => ({ ...s, date: iso, slotId: null, time: null }));
            setStep(2);
            setPrefillNotice(prefill.time ? c.prefillNotice : null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = () => {
        if (submitting || confirmed) return;
        setSubmitting(true);
        // Prototype: simulated round-trip. No backend — no real appointment is created.
        window.setTimeout(() => {
            const code = 'HH' + Math.floor(100000 + Math.random() * 900000);
            setConfirmed(code);
            setSubmitting(false);
        }, 650);
    };

    if (confirmed) return <SuccessScreen state={state} code={confirmed} />;

    const whenLabel =
        state.date && state.time ? `${formatDate(state.date, locale)} · ${state.time}` : null;

    /** Only the info relevant to the CURRENT step — max two single lines. */
    const dockSummary: DockSummary | null = state.doctor
        ? {
              photo: state.doctor.photo,
              title:
                  step === 5
                      ? c.dock.ready
                      : step === 3 && whenLabel
                          ? whenLabel
                          : state.doctor.name,
              subtitle:
                  step === 1
                      ? state.doctor.department
                      : step === 3
                          ? state.otpVerified
                              ? c.dock.phoneVerified
                              : c.dock.phoneWaiting
                          : step === 5
                              ? `${state.doctor.name}${whenLabel ? ` · ${whenLabel}` : ''}`
                              : whenLabel,
          }
        : null;

    const dockAction =
        step === 4 ? c.dock.toSummary : step === 5 ? c.dock.submit : c.dock.continue;

    return (
        <>
            <Head title={c.head.title}>
                <meta name="description" content={c.head.description} />
                <meta property="og:title" content={c.head.title} />
                <meta property="og:description" content={c.head.ogDescription} />
                <link rel="alternate" hrefLang="tr" href="https://app.hisarweb.test/randevu-al" />
                <link rel="alternate" hrefLang="en" href="https://app.hisarweb.test/en/randevu-al" />
                <link rel="alternate" hrefLang="x-default" href="https://app.hisarweb.test/randevu-al" />
            </Head>

            {/* Hero — compact on mobile */}
            <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary-soft/40 via-surface to-background">
                <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_55%)]" aria-hidden />
                <div id="wizard-top" className="container-x relative py-5 lg:py-12 text-center">
                    <h1 className="text-xl lg:text-4xl font-black tracking-tight text-primary">{c.heroTitle}</h1>
                    <p className="mx-auto mt-1.5 max-w-xl text-[11.5px] lg:text-sm text-muted-foreground">
                        {c.heroDesc}
                    </p>
                </div>
            </section>

            {/* Stepper */}
            <Stepper step={step} onJump={(s) => s < step && setStep(s)} />

            {/* Body */}
            <section className="py-5 lg:py-10 bg-surface/40">
                <div className="container-x">
                    <div className="mx-auto max-w-3xl rounded-2xl bg-card border border-border/60 shadow-card p-4 sm:p-6 lg:p-8">
                        <div
                            key={step}
                            className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-200"
                            aria-live="polite"
                        >
                            {step === 1 && (
                                <StepDoctor
                                    value={state.doctor}
                                    onChange={(d) => {
                                        setState((s) =>
                                            s.doctor?.id === d?.id ? { ...s, doctor: d } : { ...s, doctor: d, date: null, slotId: null, time: null },
                                        );
                                    }}
                                />
                            )}
                            {step === 2 && state.doctor && (
                                <>
                                    {prefillNotice && (
                                        <div
                                            role="status"
                                            className="mb-4 flex items-start gap-2 rounded-xl border border-brand-orange/30 bg-brand-orange/10 px-3 py-2 text-[12.5px] text-primary"
                                        >
                                            <Sparkles className="h-3.5 w-3.5 mt-0.5 text-brand-orange shrink-0" />
                                            <span>{prefillNotice}</span>
                                            <button
                                                type="button"
                                                onClick={() => setPrefillNotice(null)}
                                                className="ml-auto text-muted-foreground hover:text-primary"
                                                aria-label={c.prefillClose}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    )}
                                    <StepDateTime
                                        doctor={state.doctor}
                                        date={state.date} slotId={state.slotId} time={state.time}
                                        onPick={(iso, t, slotIdPick) => {
                                            setState((s) => ({ ...s, date: iso, time: t, slotId: slotIdPick ?? null }));
                                            setPrefillNotice(null);
                                        }}
                                    />
                                </>
                            )}
                            {step === 3 && (
                                <StepVerify
                                    phone={state.phone} otp={state.otp} verified={state.otpVerified}
                                    onPhone={(v) => set('phone', v)}
                                    onOtp={(v) => set('otp', v)}
                                    onVerify={(ok) => set('otpVerified', ok)}
                                />
                            )}
                            {step === 4 && (
                                <StepContact
                                    state={state}
                                    onChange={(patch) => setState((s) => ({ ...s, ...patch }))}
                                    onEditPhone={() => setStep(3)}
                                />
                            )}
                            {step === 5 && <StepSummary state={state} onEdit={setStep} />}
                        </div>
                    </div>
                </div>
            </section>

            <AppointmentDockSpacer />

            <AppointmentActionDock
                summary={step === 1 && !state.doctor ? null : dockSummary}
                onChangeSummary={step > 1 ? () => setStep(1) : undefined}
                changeLabel={c.dock.change}
                onBack={step > 1 ? prev : undefined}
                backLabel={c.dock.back}
                hint={!canNext && step < 5 ? nextBlockedReason : null}
                actionLabel={dockAction}
                actionDisabled={step === 5 ? false : !canNext}
                actionBusy={step === 5 && submitting}
                onAction={step === 5 ? submit : next}
            />
        </>
    );
}

AppointmentWizard.layout = siteLayout;

/* ------------------------------------------------------------------ */
/*  Stepper                                                            */
/* ------------------------------------------------------------------ */

function Stepper({ step, onJump }: { step: number; onJump: (s: number) => void }) {
    const c = COPY[useLocale()];
    const steps = c.steps.map((label, i) => ({ id: i + 1, label, icon: STEP_ICONS[i] }));
    return (
        <div className="sticky top-[var(--sticky-h,var(--header-h,84px))] z-30 bg-background border-b border-border/70 transition-[top] duration-300 will-change-[top]">
            <div className="container-x py-3 lg:py-4">
                <div className="mx-auto max-w-3xl">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-2">
                        <span>{c.stepOf(step)}</span>
                        <span className="text-primary">{steps[step - 1].label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {steps.map((s) => {
                            const done = s.id < step;
                            const active = s.id === step;
                            const Icon = s.icon;
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => onJump(s.id)}
                                    disabled={s.id > step}
                                    className="group flex-1 flex flex-col items-center gap-1.5 disabled:cursor-not-allowed"
                                    aria-current={active ? 'step' : undefined}
                                >
                                    <div
                                        className={
                                            'h-1 w-full rounded-full transition-colors ' +
                                            (done || active ? 'bg-brand-orange' : 'bg-border')
                                        }
                                    />
                                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold">
                                        <span
                                            className={
                                                'inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ' +
                                                (done
                                                    ? 'bg-brand-orange text-brand-orange-foreground'
                                                    : active
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground')
                                            }
                                        >
                                            {done ? <Check className="h-3 w-3" /> : s.id}
                                        </span>
                                        <span className={active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'}>
                                            {s.label}
                                        </span>
                                    </div>
                                    <div className="sm:hidden">
                                        <Icon
                                            className={
                                                'h-3.5 w-3.5 ' +
                                                (active ? 'text-primary' : done ? 'text-brand-orange' : 'text-muted-foreground')
                                            }
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Doctor                                                    */
/* ------------------------------------------------------------------ */

function StepDoctor({ value, onChange }: { value: Doctor | null; onChange: (d: Doctor | null) => void }) {
    const locale = useLocale();
    const c = COPY[locale];
    const doctors = useDoctors();
    const hospitals = useHospitals();
    const [q, setQ] = useState('');
    const [dept, setDept] = useState('all');
    const [hosp, setHosp] = useState<Hosp>('all');

    const allDepartments = useMemo(
        () => Array.from(new Set(doctors.map((d) => d.department))).sort((a, b) => a.localeCompare(b, locale)),
        [doctors, locale],
    );

    const filtered = useMemo(() => {
        const nq = normalizeTr(q.trim());
        if (!nq && dept === 'all' && hosp === 'all') return [];
        return doctors.filter((d) => {
            if (dept !== 'all' && d.department !== dept) return false;
            if (hosp !== 'all' && d.hospitalSlug !== hosp) return false;
            if (!nq) return true;
            const hay = normalizeTr(`${d.name} ${d.department} ${d.subspecialties?.join(' ') ?? ''}`);
            return hay.includes(nq);
        }).slice(0, 30);
    }, [q, dept, hosp, doctors]);

    return (
        <div>
            <StepHeader eyebrow={c.doctor.eyebrow} title={c.doctor.title} subtitle={c.doctor.subtitle} />

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={c.doctor.searchPlaceholder}
                    className="w-full rounded-full bg-background border border-border h-12 pl-11 pr-10 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                />
                {q && (
                    <button
                        onClick={() => setQ('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
                        aria-label={c.doctor.clear}
                    ><X className="h-3.5 w-3.5" /></button>
                )}
            </div>

            <div className="my-4 flex items-center gap-3 text-[11px] font-semibold text-muted-foreground">
                <div className="flex-1 h-px bg-border" /> {c.doctor.or} <div className="flex-1 h-px bg-border" />
            </div>

            {/* Filters */}
            <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                    <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80">
                        <Building2 className="h-3.5 w-3.5" /> {c.doctor.hospital}
                    </span>
                    <select
                        value={hosp}
                        onChange={(e) => setHosp(e.target.value as Hosp)}
                        className="w-full rounded-xl bg-background border border-border h-11 px-3 text-sm outline-none focus:border-primary/40"
                    >
                        <option value="all">{c.doctor.hospitalDefault}</option>
                        {hospitals.filter((h) => !h.comingSoon).map((h) => (
                            <option key={h.slug} value={h.slug}>{h.name}</option>
                        ))}
                    </select>
                </label>
                <label className="block">
                    <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80">
                        <Stethoscope className="h-3.5 w-3.5" /> {c.doctor.department}
                    </span>
                    <select
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        className="w-full rounded-xl bg-background border border-border h-11 px-3 text-sm outline-none focus:border-primary/40"
                    >
                        <option value="all">{c.doctor.departmentDefault}</option>
                        {allDepartments.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                </label>
            </div>

            {/* Results */}
            <div className="mt-5">
                {filtered.length === 0 ? (
                    <EmptyHint icon={Search} title={c.doctor.emptyTitle} subtitle={c.doctor.emptySubtitle} />
                ) : (
                    <ul className="grid gap-2 sm:grid-cols-2">
                        {filtered.map((d) => {
                            const active = value?.id === d.id;
                            return (
                                <li key={d.id}>
                                    <button
                                        type="button"
                                        onClick={() => onChange(d)}
                                        className={
                                            'w-full text-left flex items-center gap-3 rounded-xl border p-3 transition ' +
                                            (active
                                                ? 'border-brand-orange bg-brand-orange/5 ring-2 ring-brand-orange/30'
                                                : 'border-border/60 bg-background hover:border-primary/25 hover:bg-primary-soft/30')
                                        }
                                    >
                                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-primary-soft/50 flex items-center justify-center">
                                            {d.photo ? (
                                                <img src={d.photo} alt={d.name} className="h-full w-full object-cover object-top" />
                                            ) : (
                                                <Stethoscope className="h-5 w-5 text-primary/30" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-bold text-primary truncate">{d.name}</p>
                                            <p className="text-[11px] text-foreground/70 truncate">{d.department}</p>
                                            <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <MapPin className="h-3 w-3" /> {hospitalLabel[d.hospitalSlug] ?? d.hospitalSlug}
                                            </p>
                                        </div>
                                        {active && (
                                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange text-brand-orange-foreground">
                                                <Check className="h-3.5 w-3.5" />
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Date & Time                                               */
/* ------------------------------------------------------------------ */

const VISIBLE_DAYS = 30;

function startOfDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function StepDateTime({
    doctor, date, slotId: activeSlotId, time, onPick,
}: {
    doctor: Doctor;
    date: string | null; slotId: string | null; time: string | null;
    onPick: (iso: string, t: string | null, slotId?: string | null) => void;
}) {
    const locale = useLocale();
    const c = COPY[locale];
    const today = useMemo(() => startOfDay(new Date()), []);

    const days = useMemo(() => {
        return Array.from({ length: VISIBLE_DAYS }, (_, i) => {
            const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
            const iso = localDateISO(d);
            return {
                iso,
                date: d,
                weekday: d.toLocaleDateString(dloc(locale), { weekday: 'short' }),
                dayNum: d.getDate(),
                month: d.toLocaleDateString(dloc(locale), { month: 'short' }),
                available: getAppointmentSlots(doctor.id, iso).length > 0,
            };
        });
    }, [today, doctor.id, locale]);

    const stripRef = useRef<HTMLDivElement>(null);
    const activeIndex = days.findIndex((d) => d.iso === date);

    useEffect(() => {
        if (activeIndex < 0) return;
        const el = stripRef.current?.querySelector<HTMLElement>(`[data-day-index="${activeIndex}"]`);
        el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }, [activeIndex]);

    const stepDay = (dir: -1 | 1) => {
        const from = activeIndex >= 0 ? activeIndex : 0;
        for (let i = from + dir; i >= 0 && i < days.length; i += dir) {
            if (days[i].available) {
                onPick(days[i].iso, null, null);
                return;
            }
        }
    };

    const slots = date ? getAppointmentSlots(doctor.id, date) : [];

    return (
        <div>
            <StepHeader eyebrow={c.dt.eyebrow} title={c.dt.title} subtitle={c.dt.subtitle(doctor.name)} />

            {/* Day tabs */}
            <div className="rounded-2xl border border-border/60 bg-background p-2.5 sm:p-3">
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => stepDay(-1)}
                        disabled={activeIndex <= 0}
                        aria-label={c.dt.prevDay}
                        className="grid h-10 w-9 shrink-0 place-items-center rounded-xl border border-border/60 text-primary disabled:opacity-35"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div
                        ref={stripRef}
                        role="tablist"
                        aria-label={c.dt.daysAria}
                        className="flex min-w-0 flex-1 snap-x snap-mandatory gap-1.5 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {days.map((d, i) => {
                            const selected = date === d.iso;
                            return (
                                <button
                                    key={d.iso}
                                    data-day-index={i}
                                    role="tab"
                                    type="button"
                                    aria-selected={selected}
                                    disabled={!d.available}
                                    onClick={() => onPick(d.iso, null, null)}
                                    className={
                                        'relative shrink-0 snap-start rounded-xl px-3 py-2 text-center transition ' +
                                        (!d.available
                                            ? 'cursor-not-allowed text-muted-foreground/45'
                                            : selected
                                                ? 'bg-primary-soft/60 text-primary'
                                                : 'text-foreground/75 hover:bg-muted')
                                    }
                                >
                                    <span className="block text-[10.5px] font-semibold uppercase tracking-wide">{d.weekday}</span>
                                    <span className="block text-[15px] font-black leading-tight">{d.dayNum}</span>
                                    <span className="block text-[10px] text-muted-foreground">{d.month}</span>
                                    <span
                                        aria-hidden
                                        className={
                                            'absolute inset-x-2 bottom-0 h-[3px] rounded-full transition ' +
                                            (selected ? 'bg-brand-orange' : 'bg-transparent')
                                        }
                                    />
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={() => stepDay(1)}
                        disabled={activeIndex >= days.length - 1}
                        aria-label={c.dt.nextDay}
                        className="grid h-10 w-9 shrink-0 place-items-center rounded-xl border border-border/60 text-primary disabled:opacity-35"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Times */}
            <p className="mt-5 mb-2 text-[12px] font-semibold text-foreground/80">
                {c.dt.availableTimes}
                {date && <span className="ml-1.5 font-normal text-muted-foreground">· {formatDate(date, locale)}</span>}
            </p>
            {!date ? (
                <EmptyHint icon={CalendarIcon} title={c.dt.pickDayTitle} subtitle={c.dt.pickDaySubtitle} />
            ) : slots.length === 0 ? (
                <EmptyHint icon={Clock} title={c.dt.noSlotTitle} subtitle={c.dt.noSlotSubtitle} />
            ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {slots.map((slot) => {
                        const active = activeSlotId ? activeSlotId === slot.id : time === slot.time;
                        return (
                            <button
                                key={slot.id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onPick(date, slot.time, slot.id)}
                                className={
                                    'h-12 rounded-xl border text-sm font-bold transition ' +
                                    (active
                                        ? 'border-brand-orange bg-brand-orange text-brand-orange-foreground shadow-orange'
                                        : 'border-border/70 bg-background text-primary hover:border-primary/30 hover:bg-primary-soft/30')
                                }
                            >
                                {slot.time}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Step 3 — Phone verification (mock)                                 */
/* ------------------------------------------------------------------ */

function StepVerify({
    phone, otp, verified, onPhone, onOtp, onVerify,
}: {
    phone: string; otp: string; verified: boolean;
    onPhone: (v: string) => void; onOtp: (v: string) => void; onVerify: (ok: boolean) => void;
}) {
    const c = COPY[useLocale()];
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);

    const validPhone = /^[0-9\s]{10,14}$/.test(phone.replace(/[^0-9]/g, '')) && phone.replace(/[^0-9]/g, '').length >= 10;

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown((cd) => cd - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    const send = () => {
        if (!validPhone) return;
        setSending(true);
        setError(null);
        setTimeout(() => {
            setSent(true);
            setSending(false);
            setCooldown(30);
        }, 700);
    };

    const check = (v: string) => {
        onOtp(v);
        setError(null);
        if (v.length === 6) {
            // Demo: any 6-digit code accepted.
            onVerify(true);
        } else {
            onVerify(false);
        }
    };

    return (
        <div>
            <StepHeader eyebrow={c.verify.eyebrow} title={c.verify.title} subtitle={c.verify.subtitle} />

            <label className="block">
                <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80">
                    <Phone className="h-3.5 w-3.5" /> {c.verify.phoneLabel}
                </span>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 sm:flex">
                    <div className="inline-flex h-11 items-center rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground/80">
                        +90
                    </div>
                    <input
                        value={phone}
                        onChange={(e) => { onPhone(e.target.value); onVerify(false); setSent(false); }}
                        inputMode="tel"
                        placeholder="5xx xxx xx xx"
                        className="min-w-0 flex-1 rounded-xl bg-background border border-border h-11 px-3 text-sm outline-none focus:border-primary/40"
                        disabled={verified}
                    />
                    <button
                        type="button"
                        onClick={send}
                        disabled={!validPhone || sending || cooldown > 0 || verified}
                        className="col-span-2 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none sm:col-span-1"
                    >
                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : sent ? c.verify.resend : c.verify.send}
                        {cooldown > 0 && <span className="text-[11px] opacity-80">({cooldown})</span>}
                    </button>
                </div>
            </label>

            {sent && (
                <div className="mt-4">
                    <label className="block">
                        <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80">
                            <ShieldCheck className="h-3.5 w-3.5" /> {c.verify.codeLabel}
                            <span className="ml-auto text-[10px] font-normal text-muted-foreground">{c.verify.demoHint}</span>
                        </span>
                        <input
                            value={otp}
                            onChange={(e) => check(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            inputMode="numeric"
                            placeholder={c.verify.codePlaceholder}
                            className={
                                'w-full rounded-xl bg-background border h-12 px-4 text-lg tracking-[0.4em] font-bold outline-none focus:border-primary/40 ' +
                                (verified ? 'border-success text-success' : 'border-border')
                            }
                            disabled={verified}
                        />
                    </label>
                    {verified && (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-success">
                            <Check className="h-3.5 w-3.5" /> {c.verify.verified}
                        </p>
                    )}
                    {error && <p className="mt-2 text-[12px] text-destructive">{error}</p>}
                </div>
            )}

            <div className="mt-5 rounded-xl bg-primary-soft/40 border border-primary/10 p-3 text-[12px] text-foreground/80">
                {c.verify.info}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Step 4 — Contact                                                   */
/* ------------------------------------------------------------------ */

function StepContact({
    state, onChange, onEditPhone,
}: {
    state: FormState;
    onChange: (p: Partial<FormState>) => void;
    onEditPhone: () => void;
}) {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const emailInvalid = state.email.trim().length > 0 && !/^\S+@\S+\.\S+$/.test(state.email.trim());
    const inputCls =
        'w-full rounded-xl bg-background border border-border h-11 px-3 text-[15px] outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15';

    return (
        <div>
            <StepHeader eyebrow={c.contact.eyebrow} title={c.contact.title} subtitle={c.contact.subtitle} />

            <div className="grid gap-3.5">
                <div className="grid gap-3.5 sm:grid-cols-2">
                    <Field label={c.contact.firstName} required>
                        <input
                            value={state.firstName}
                            onChange={(e) => onChange({ firstName: e.target.value })}
                            autoComplete="given-name"
                            placeholder={c.contact.firstNamePlaceholder}
                            className={inputCls}
                        />
                    </Field>
                    <Field label={c.contact.lastName} required>
                        <input
                            value={state.lastName}
                            onChange={(e) => onChange({ lastName: e.target.value })}
                            autoComplete="family-name"
                            placeholder={c.contact.lastNamePlaceholder}
                            className={inputCls}
                        />
                    </Field>
                </div>

                {/* Phone — verified in the previous step */}
                <div>
                    <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80">
                        <Phone className="h-3.5 w-3.5" /> {c.contact.phone}
                    </span>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 h-11">
                        <span className="truncate text-[15px] font-semibold text-primary">+90 {state.phone}</span>
                        <button
                            type="button"
                            onClick={onEditPhone}
                            className="shrink-0 text-[11.5px] font-semibold text-primary underline underline-offset-2"
                        >
                            {c.contact.change}
                        </button>
                    </div>
                </div>

                <Field label={c.contact.email} icon={Mail} hint={c.contact.optional}>
                    <input
                        value={state.email}
                        onChange={(e) => onChange({ email: e.target.value })}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder={c.contact.emailPlaceholder}
                        aria-invalid={emailInvalid}
                        className={inputCls + (emailInvalid ? ' border-destructive' : '')}
                    />
                </Field>
                {emailInvalid && (
                    <p className="-mt-2 text-[11.5px] text-destructive">{c.contact.emailInvalid}</p>
                )}

                <Field label={c.contact.note} icon={MessageSquare} hint={c.contact.optional}>
                    <textarea
                        value={state.note}
                        onChange={(e) => onChange({ note: e.target.value })}
                        rows={3}
                        placeholder={c.contact.notePlaceholder}
                        className="w-full resize-none rounded-xl bg-background border border-border px-3 py-2.5 text-[15px] outline-none focus:border-primary/40"
                    />
                </Field>

                {/* International patient */}
                <label className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-primary-soft/20 p-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={state.isInternational}
                        onChange={(e) => onChange({ isInternational: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-border accent-brand-orange"
                    />
                    <span className="text-[12px] leading-snug text-foreground/85">
                        {c.contact.international}
                    </span>
                </label>

                {state.isInternational && (
                    <div className="grid gap-3.5 sm:grid-cols-2">
                        <Field label={c.contact.passport} required>
                            <input
                                value={state.passport}
                                onChange={(e) => onChange({ passport: e.target.value.toUpperCase().slice(0, 20) })}
                                placeholder="U12345678"
                                className={inputCls}
                            />
                        </Field>
                        <Field label={c.contact.nationality} required>
                            <input
                                value={state.nationality}
                                onChange={(e) => onChange({ nationality: e.target.value })}
                                placeholder="Germany"
                                className={inputCls}
                            />
                        </Field>
                    </div>
                )}

                <label className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background p-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={state.kvkk}
                        onChange={(e) => onChange({ kvkk: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-border accent-brand-orange"
                    />
                    <span className="text-[12px] leading-snug text-foreground/80">
                        {c.contact.kvkkBefore}
                        <Link href={lp('/kvkk-politikamiz')} className="font-semibold text-primary underline underline-offset-2">
                            {c.contact.kvkkLink}
                        </Link>
                        {c.contact.kvkkAfter}
                    </span>
                </label>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Step 5 — Summary                                                   */
/* ------------------------------------------------------------------ */

function SummaryRow({
    label, value, extra, onEdit,
}: {
    label: string;
    value: string;
    extra?: string | null;
    onEdit: () => void;
}) {
    const c = COPY[useLocale()];
    return (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-border/60 py-3 last:border-b-0">
            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="mt-0.5 text-[13.5px] font-bold text-primary break-words">{value}</p>
                {extra && <p className="mt-0.5 text-[11.5px] text-foreground/70 break-words">{extra}</p>}
            </div>
            <button
                type="button"
                onClick={onEdit}
                className="shrink-0 inline-flex h-8 items-center rounded-full border border-border px-3 text-[11px] font-semibold text-primary hover:bg-primary/5"
            >
                {c.summary.edit}
            </button>
        </div>
    );
}

function StepSummary({ state, onEdit }: { state: FormState; onEdit: (s: number) => void }) {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const doc = state.doctor;
    return (
        <div>
            <StepHeader eyebrow={c.summary.eyebrow} title={c.summary.title} subtitle={c.summary.subtitle} />

            <div className="rounded-2xl border border-border/60 bg-background px-4">
                <SummaryRow
                    label={c.summary.doctor}
                    value={doc?.name ?? '—'}
                    onEdit={() => onEdit(1)}
                />
                <SummaryRow
                    label={c.summary.hospitalDept}
                    value={doc ? (hospitalLabel[doc.hospitalSlug] ?? doc.hospitalSlug) : '—'}
                    extra={doc?.department}
                    onEdit={() => onEdit(1)}
                />
                <SummaryRow
                    label={c.summary.dateTime}
                    value={state.date ? formatDate(state.date, locale) : '—'}
                    extra={state.time}
                    onEdit={() => onEdit(2)}
                />
                <SummaryRow
                    label={c.summary.contact}
                    value={`${state.firstName} ${state.lastName}`.trim() || '—'}
                    extra={[`+90 ${state.phone}`, state.email, state.note ? `${c.summary.notePrefix}${state.note}` : null]
                        .filter(Boolean)
                        .join(' · ')}
                    onEdit={() => onEdit(4)}
                />
            </div>

            <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
                {c.summary.footerBefore}
                <Link href={lp('/kvkk-politikamiz')} className="underline hover:text-primary">{c.summary.footerLink}</Link>
                {c.summary.footerAfter}
            </p>

            {/* Prototype disclosure */}
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-brand-orange/30 bg-brand-orange/10 px-3 py-2 text-[11.5px] text-primary">
                <Sparkles className="h-3.5 w-3.5 mt-0.5 text-brand-orange shrink-0" />
                <span>{c.summary.prototype}</span>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Success                                                            */
/* ------------------------------------------------------------------ */

function SuccessScreen({ state, code }: { state: FormState; code: string }) {
    const locale = useLocale();
    const c = COPY[locale];
    const lp = useLocalizedPath();
    const doctorName = state.doctor?.name ?? '';
    const department = state.doctor?.department ?? '';
    const hospitalName = state.doctor ? (hospitalLabel[state.doctor.hospitalSlug] ?? state.doctor.hospitalSlug) : '';
    const dateLabel = state.date ? formatDate(state.date, locale) : '';
    const timeLabel = state.time ?? '';

    function handleAddToCalendar() {
        if (!state.date || !state.time) return;
        const [h, m] = state.time.split(':').map(Number);
        const start = new Date(state.date);
        start.setHours(h, m, 0, 0);
        const end = new Date(start.getTime() + 30 * 60 * 1000);
        const fmt = (d: Date) =>
            `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
        const uid = `${code}@hisarhospital`;
        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Hisar Hospital//Randevu//TR',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${fmt(new Date())}`,
            `DTSTART:${fmt(start)}`,
            `DTEND:${fmt(end)}`,
            `SUMMARY:${c.success.icsSummary(doctorName)}`,
            `DESCRIPTION:${c.success.icsCode}: ${code}\\n${c.success.icsDept}: ${department}\\n${c.success.icsDoctor}: ${doctorName}`,
            `LOCATION:${hospitalName}`,
            'END:VEVENT',
            'END:VCALENDAR',
        ].join('\r\n');
        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hisar-randevu-${code}.ics`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function handleDownloadImage() {
        const W = 1080, H = 1350;
        const canvas = document.createElement('canvas');
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#0b2545');
        bg.addColorStop(1, '#13315c');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const cx = 80, cy = 180, cw = W - 160, ch = H - 360;
        ctx.fillStyle = '#ffffff';
        roundRect(ctx, cx, cy, cw, ch, 32);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('HISAR HOSPITAL', W / 2, 100);
        ctx.font = '500 20px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.fillText(c.success.canvasConfirm, W / 2, 135);

        ctx.beginPath();
        ctx.arc(W / 2, cy + 100, 56, 0, Math.PI * 2);
        ctx.fillStyle = '#e8f7ee';
        ctx.fill();
        ctx.strokeStyle = '#1a9c4a';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(W / 2 - 22, cy + 100);
        ctx.lineTo(W / 2 - 4, cy + 118);
        ctx.lineTo(W / 2 + 26, cy + 84);
        ctx.stroke();

        ctx.fillStyle = '#0b2545';
        ctx.font = '900 44px Inter, system-ui, sans-serif';
        ctx.fillText(c.success.canvasCreated, W / 2, cy + 220);

        ctx.font = '600 22px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#6b7280';
        ctx.fillText(c.success.canvasCode, W / 2, cy + 275);
        ctx.font = '900 42px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#ff6a1a';
        ctx.fillText(code, W / 2, cy + 325);

        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx + 60, cy + 365);
        ctx.lineTo(cx + cw - 60, cy + 365);
        ctx.stroke();

        ctx.textAlign = 'left';
        const lx = cx + 80;
        let ly = cy + 430;
        const drawRow = (label: string, value: string) => {
            ctx.font = '600 20px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#6b7280';
            ctx.fillText(label.toUpperCase(), lx, ly);
            ctx.font = '800 30px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#0b2545';
            ctx.fillText(value, lx, ly + 38);
            ly += 100;
        };
        drawRow(c.success.rowDept, department);
        drawRow(c.success.rowDoctor, doctorName);
        drawRow(c.success.rowDateTime, `${dateLabel} · ${timeLabel}`);
        drawRow(c.success.rowHospital, hospitalName);

        ctx.textAlign = 'center';
        ctx.font = '500 20px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText('hisarhospital.com  ·  444 5 888', W / 2, H - 80);

        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hisar-randevu-${code}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        }, 'image/png');
    }

    async function handleShare() {
        const text = `${c.success.shareHeading}\n${c.success.shareCode}${code}\n${doctorName} — ${department}\n${dateLabel} · ${timeLabel}\n${hospitalName}`;
        if (navigator.share) {
            try { await navigator.share({ title: c.success.shareTitle, text }); return; } catch { /* cancelled */ }
        }
        try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
    }

    return (
        <section className="py-10 lg:py-20 bg-surface/40 min-h-[60vh]" role="status" aria-live="polite">
            <div className="container-x">
                <div className="mx-auto max-w-lg rounded-3xl bg-card border border-border/60 shadow-elevated p-5 sm:p-8 text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15">
                        <Check className="h-7 w-7 text-success" strokeWidth={3} />
                    </div>
                    <h1 className="mt-4 text-xl lg:text-2xl font-black text-primary">{c.success.title}</h1>
                    <p className="mt-1.5 text-[12.5px] text-muted-foreground">
                        {c.success.received}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-[11.5px] text-brand-orange font-semibold">
                        <Sparkles className="h-3.5 w-3.5" /> {c.success.prototype}
                    </p>

                    <div className="mt-5 rounded-2xl border border-primary/10 bg-primary-soft/35 p-4 text-left">
                        <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                            <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                                {c.success.appointmentNo}
                            </span>
                            <span className="text-[13px] font-black tracking-wider text-primary">{code}</span>
                        </div>
                        <p className="mt-2.5 text-[13.5px] font-black text-primary">{doctorName}</p>
                        <p className="text-[11.5px] text-muted-foreground">{department} · {hospitalName}</p>
                        <p className="mt-2 text-[13px] font-semibold text-foreground/85">
                            {dateLabel} · {timeLabel}
                        </p>
                        <p className="mt-2 text-[11.5px] text-muted-foreground">
                            {state.firstName} {state.lastName} · {maskPhone(state.phone)}
                            {state.email ? ` · ${maskEmail(state.email)}` : ''}
                        </p>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={handleAddToCalendar}
                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border/70 px-2 text-[11.5px] font-semibold text-primary hover:bg-primary/5"
                        >
                            <CalendarDays className="h-3.5 w-3.5 text-brand-orange" /> {c.success.calendar}
                        </button>
                        <button
                            type="button"
                            onClick={handleDownloadImage}
                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border/70 px-2 text-[11.5px] font-semibold text-primary hover:bg-primary/5"
                        >
                            <Download className="h-3.5 w-3.5 text-brand-orange" /> {c.success.download}
                        </button>
                        <button
                            type="button"
                            onClick={handleShare}
                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border/70 px-2 text-[11.5px] font-semibold text-primary hover:bg-primary/5"
                        >
                            <Share2 className="h-3.5 w-3.5 text-brand-orange" /> {c.success.share}
                        </button>
                    </div>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
                        <Link
                            href={lp('/online-hizmetler')}
                            className="cta-orbit inline-flex h-11 items-center justify-center rounded-full bg-gradient-orange px-5 text-sm font-bold text-brand-orange-foreground shadow-orange"
                        >
                            {c.success.myAppointments}
                        </Link>
                        <Link
                            href={lp('/')}
                            className="inline-flex h-11 items-center justify-center rounded-full border border-primary/25 px-5 text-sm font-semibold text-primary hover:bg-primary/5"
                        >
                            {c.success.backHome}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

/* ------------------------------------------------------------------ */
/*  Shared UI                                                          */
/* ------------------------------------------------------------------ */

function StepHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
    return (
        <header className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-orange">{eyebrow}</p>
            <h2 className="mt-1 text-xl lg:text-2xl font-black text-primary">{title}</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p>
        </header>
    );
}

function EmptyHint({ icon: Icon, title, subtitle }: { icon: typeof Search; title: string; subtitle: string }) {
    return (
        <div className="rounded-xl border border-dashed border-border bg-background/50 p-6 text-center">
            <div className="mx-auto h-10 w-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-brand-orange" />
            </div>
            <p className="mt-2 text-[13px] font-bold text-primary">{title}</p>
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
    );
}

function Field({
    label, required, hint, icon: Icon, children,
}: {
    label: string; required?: boolean; hint?: string;
    icon?: typeof Mail; children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80">
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label} {required && <span className="text-brand-orange">*</span>}
                {hint && <span className="ml-auto text-[10px] font-normal text-muted-foreground">{hint}</span>}
            </span>
            {children}
        </label>
    );
}

/* ------------------------------------------------------------------ */
/*  Appointment action dock (inlined from source component)            */
/* ------------------------------------------------------------------ */

/** True while a text input/textarea has focus on a small screen (keyboard up). */
function useKeyboardOpen() {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const isField = (el: EventTarget | null) =>
            el instanceof HTMLElement &&
            (el.tagName === 'TEXTAREA' ||
                (el.tagName === 'INPUT' &&
                    !['checkbox', 'radio', 'button', 'submit'].includes((el as HTMLInputElement).type)));
        const onIn = (e: FocusEvent) => {
            if (window.innerWidth < 1024 && isField(e.target)) setOpen(true);
        };
        const onOut = () => setOpen(false);
        document.addEventListener('focusin', onIn);
        document.addEventListener('focusout', onOut);
        return () => {
            document.removeEventListener('focusin', onIn);
            document.removeEventListener('focusout', onOut);
        };
    }, []);
    return open;
}

type DockSummary = {
    photo?: string | null;
    title?: string | null;
    subtitle?: string | null;
};

function AppointmentActionDock({
    visible = true,
    summary,
    onChangeSummary,
    changeLabel,
    actionLabel,
    onAction,
    actionDisabled,
    actionBusy,
    onBack,
    backLabel,
    hint,
}: {
    visible?: boolean;
    summary?: DockSummary | null;
    onChangeSummary?: () => void;
    changeLabel?: string;
    actionLabel: string;
    onAction: () => void;
    actionDisabled?: boolean;
    actionBusy?: boolean;
    onBack?: () => void;
    backLabel?: string;
    hint?: string | null;
}) {
    const c = COPY[useLocale()];
    const keyboardOpen = useKeyboardOpen();
    const [mounted, setMounted] = useState(false);
    const [navH, setNavH] = useState(0);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const measure = () => {
            const nav = document.querySelector<HTMLElement>('nav[aria-label="Mobile quick navigation"]');
            if (!nav) return setNavH(0);
            const r = nav.getBoundingClientRect();
            const isVisible = r.height > 0 && getComputedStyle(nav).display !== 'none';
            setNavH(isVisible ? Math.round(r.height) : 0);
        };
        measure();
        window.addEventListener('resize', measure);
        const id = window.setInterval(measure, 500);
        return () => {
            window.removeEventListener('resize', measure);
            window.clearInterval(id);
        };
    }, []);

    if (!visible || !mounted || typeof document === 'undefined') return null;

    const showSummary = !!summary && !keyboardOpen;
    const secondary = summary?.subtitle ?? hint ?? null;

    const dock = (
        <div
            role="region"
            aria-label={c.dock.region}
            data-appointment-dock
            className="fixed inset-x-0 z-[90] border-t border-border bg-card shadow-[0_-8px_28px_-18px_rgba(15,23,42,0.45)]"
            style={{
                bottom: navH ? `${navH}px` : 0,
                paddingBottom: navH ? undefined : 'env(safe-area-inset-bottom, 0px)',
            }}
        >
            <div className="container-x">
                <div className="mx-auto max-w-3xl">
                    {/* Row 1 — selection summary (mobile: own row) */}
                    {showSummary && (
                        <div className="flex h-[54px] items-center gap-2.5 border-b border-border/60 xl:hidden">
                            <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-soft/60">
                                {summary?.photo ? (
                                    <img src={summary.photo} alt="" className="h-full w-full object-cover object-top" />
                                ) : (
                                    <Stethoscope className="h-4 w-4 text-primary/40" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate whitespace-nowrap text-sm font-semibold leading-tight text-primary">
                                    {summary?.title}
                                </p>
                                {secondary && (
                                    <p className="truncate whitespace-nowrap text-xs leading-tight text-foreground/70">
                                        {secondary}
                                    </p>
                                )}
                            </div>
                            {onChangeSummary && (
                                <button
                                    type="button"
                                    onClick={onChangeSummary}
                                    className="shrink-0 rounded-full px-2 py-1 text-xs font-semibold text-primary hover:bg-muted"
                                >
                                    {changeLabel}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Row 2 — actions */}
                    <div className="flex h-[58px] items-center gap-2.5 xl:h-auto xl:py-4">
                        {/* Desktop keeps the inline summary */}
                        {showSummary && (
                            <div className="hidden min-w-0 flex-1 items-center gap-2.5 xl:flex">
                                <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-soft/60">
                                    {summary?.photo ? (
                                        <img src={summary.photo} alt="" className="h-full w-full object-cover object-top" />
                                    ) : (
                                        <Stethoscope className="h-4 w-4 text-primary/40" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate whitespace-nowrap text-sm font-bold leading-tight text-primary">
                                        {summary?.title}
                                    </p>
                                    {secondary && (
                                        <p className="truncate whitespace-nowrap text-xs leading-tight text-foreground/70">
                                            {secondary}
                                        </p>
                                    )}
                                </div>
                                {onChangeSummary && (
                                    <button
                                        type="button"
                                        onClick={onChangeSummary}
                                        className="inline-flex h-8 shrink-0 items-center rounded-full border border-border px-3 text-xs font-semibold text-primary hover:bg-muted"
                                    >
                                        {changeLabel}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Back / hint on the left of the action row */}
                        <div className={cn('flex min-w-0 items-center', showSummary ? 'xl:hidden' : 'flex-1')}>
                            {onBack ? (
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="inline-flex h-11 shrink-0 items-center rounded-full px-3 text-[13px] font-semibold text-foreground/80 hover:bg-muted"
                                >
                                    {backLabel}
                                </button>
                            ) : (
                                !showSummary && (
                                    <p className="truncate whitespace-nowrap text-xs text-muted-foreground">{hint}</p>
                                )
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={onAction}
                            disabled={actionDisabled || actionBusy}
                            aria-busy={actionBusy}
                            className="cta-orbit ml-auto inline-flex h-[46px] min-w-[140px] flex-1 shrink-0 items-center justify-center gap-1.5 rounded-full bg-gradient-orange px-4 text-sm font-bold text-brand-orange-foreground shadow-orange transition disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none min-[376px]:flex-none min-[376px]:w-[170px] xl:h-11 xl:w-auto xl:px-6"
                        >
                            {actionBusy ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" /> : null}
                            <span className="truncate">{actionLabel}</span>
                            {!actionBusy && <ChevronRight className="h-4 w-4 shrink-0" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(dock, document.body);
}

/** Bottom spacer so the dock never covers page content. */
function AppointmentDockSpacer() {
    return (
        <div
            aria-hidden
            className="h-[124px] xl:h-[92px]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        />
    );
}
