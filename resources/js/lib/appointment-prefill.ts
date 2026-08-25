/**
 * Appointment prefill + deterministic demo slot generator.
 *
 * Framework-agnostic (no React / router imports) so it can be reused by the
 * doctor detail page, the appointment wizard, etc. Slots are a PROTOTYPE — there
 * is no real backend; availability is a deterministic pseudo-random function of
 * (doctorId, date) so the same doctor always shows the same demo slots.
 */
const KEY = 'hh_appt_prefill';
const TTL_MS = 10 * 60 * 1000;

/** Locale for the (bilingual) day labels. Kept as a plain union to stay framework-agnostic. */
export type SlotLocale = 'tr' | 'en';

export type AppointmentPrefill = {
    doctorId: string;
    date?: string | null;
    slotId?: string | null;
    time?: string | null;
    ts: number;
};

export type AppointmentDay = {
    iso: string;
    label: string;
    day: number;
    dow: string;
    month: string;
};

export type AppointmentSlot = {
    id: string;
    doctorId: string;
    date: string;
    time: string;
    label: string;
};

export function setAppointmentPrefill(p: Omit<AppointmentPrefill, 'ts'>) {
    try {
        sessionStorage.setItem(KEY, JSON.stringify({ ...p, ts: Date.now() }));
    } catch {
        /* ignore */
    }
}

export function consumeAppointmentPrefill(): AppointmentPrefill | null {
    try {
        const raw = sessionStorage.getItem(KEY);
        if (!raw) return null;
        sessionStorage.removeItem(KEY);
        const parsed = JSON.parse(raw) as AppointmentPrefill;
        if (!parsed?.doctorId) return null;
        if (Date.now() - parsed.ts > TTL_MS) return null;
        return parsed;
    } catch {
        return null;
    }
}

const SLOT_TIMES = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:15',
];

function pad(n: number) {
    return String(n).padStart(2, '0');
}

export function localDateISO(d: Date): string {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDays(from: Date, amount: number): Date {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    d.setDate(d.getDate() + amount);
    return d;
}

function intlLocale(locale: SlotLocale): string {
    return locale === 'en' ? 'en-US' : 'tr-TR';
}

function relativeDayLabel(offset: number, d: Date, locale: SlotLocale): string {
    if (offset === 0) return locale === 'en' ? 'Today' : 'Bugün';
    if (offset === 1) return locale === 'en' ? 'Tomorrow' : 'Yarın';
    return d.toLocaleDateString(intlLocale(locale), { weekday: 'long' });
}

export function getAppointmentDays(count = 14, from: Date = new Date(), locale: SlotLocale = 'tr'): AppointmentDay[] {
    return Array.from({ length: count }).map((_, offset) => {
        const d = addDays(from, offset);
        return {
            iso: localDateISO(d),
            label: relativeDayLabel(offset, d, locale),
            day: d.getDate(),
            dow: d.toLocaleDateString(intlLocale(locale), { weekday: 'short' }),
            month: d.toLocaleDateString(intlLocale(locale), { month: 'short' }),
        };
    });
}

function slotId(doctorId: string, iso: string, time: string): string {
    return `${doctorId}__${iso}__${time.replace(':', '')}`;
}

/** Shared deterministic demo availability used by both the doctor CV widget and the appointment wizard. */
export function getAppointmentSlots(doctorId: string, iso: string): AppointmentSlot[] {
    let h = 0;
    const key = `${doctorId}:${iso}`;
    for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) >>> 0;

    const available = SLOT_TIMES.filter((time, index) => {
        // Keep a realistic-looking rotating set, while preserving anchor slots used by the CV handoff.
        if (time === '16:00' || time === '17:15') return true;
        return ((h >> (index % 16)) & 1) === 1;
    });

    return available.map((time) => ({
        id: slotId(doctorId, iso, time),
        doctorId,
        date: iso,
        time,
        label: '',
    }));
}

export function getFeaturedAppointmentSlots(
    doctorId: string,
    from: Date = new Date(),
    locale: SlotLocale = 'tr',
): AppointmentSlot[] {
    return getAppointmentDays(4, from, locale).flatMap((day, index) => {
        const slots = getAppointmentSlots(doctorId, day.iso);
        // index === 1 is "tomorrow" (locale-independent logic; the label is display-only).
        const preferred = index === 1
            ? slots.find((slot) => slot.time === '16:00')
            : slots.find((slot) => slot.time === (index % 2 === 0 ? '17:15' : '16:00'));
        const slot = preferred ?? slots[0];
        return slot ? [{ ...slot, label: day.label }] : [];
    });
}

export function resolveAppointmentSlot(
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
