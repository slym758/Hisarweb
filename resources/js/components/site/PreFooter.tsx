import { useState } from "react";
import { Link } from "@inertiajs/react";
import { z } from "zod";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useLocale, useLocalizedPath } from "@/lib/i18n";

const QUICK_LINK_PATHS: string[] = [
  "/bolumlerimiz",
  "/bolumlerimiz",
  "/tedavi-yontemleri",
  "/saglikli-hayat-rehberi",
];

const COPY = {
  tr: {
    badge: "Yardım Merkezi",
    heading: "Size nasıl yardımcı olabiliriz?",
    subtitle:
      "Sık aranan hizmetlere hızlıca ulaşabilir veya sağlık danışmanlığı için formu doldurabilirsiniz.",
    quickTitle: "Sık Arananlar",
    quickDesc: "En çok ziyaret edilen hizmet ve sayfalara kolayca ulaşın.",
    quickLinks: [
      "Hisar Hospital Bütünleşik Onkoloji Merkezi",
      "Kadın Hastalıkları ve Doğum",
      "Robotik Cerrahi",
      "Sağlıklı Hayat Rehberi",
    ],
    formTitle: "Tıbbi Danışma",
    formDesc:
      "Sağlık sorularınız ve randevu talepleriniz için bilgilerinizi bırakın, ekibimiz sizinle iletişime geçsin.",
    prototypeNote:
      "Bu form tasarım prototipidir; gönderim aktif değildir.",
    successTitle: "Talebiniz alınmıştır.",
    successDesc: "Ekibimiz en kısa sürede sizinle iletişime geçecektir.",
    successReset: "Yeni bir mesaj gönder →",
    labels: {
      name: "Adınız Soyadınız",
      phone: "Telefon Numaranız",
      email: "E-posta Adresiniz",
      subject: "İlgilendiğiniz Konu",
      message: "Mesajınız",
    },
    placeholders: {
      name: "Ad Soyad",
      phone: "0 (___) ___ __ __",
      email: "ornek@eposta.com",
      subject: "Konu seçin",
      message: "Kısaca danışmak istediğiniz konuyu yazın...",
    },
    subjects: [
      "Randevu talebi",
      "Doktor / bölüm bilgisi",
      "Check-up paketleri",
      "Anlaşmalı kurum / sigorta",
      "Sağlık turizmi / international patients",
      "Diğer",
    ],
    kvkkBefore: "Kişisel verilerimin",
    kvkkLink: "Aydınlatma Metni",
    kvkkAfter: "kapsamında işlenmesini kabul ediyorum.",
    submit: "Gönder",
    submitting: "Gönderiliyor...",
    responseLabel: "Ortalama yanıt süresi:",
    responseValue: "2 saat",
    errors: {
      name: "Ad soyad zorunludur",
      phone: "Telefon numaranızı kontrol edin",
      email: "Geçerli bir e-posta girin",
      subject: "Konu seçin",
      message: "Kısa bir mesaj yazın",
      kvkk: "KVKK onayı zorunludur",
    },
  },
  en: {
    badge: "Help Center",
    heading: "How can we help you?",
    subtitle:
      "Quickly reach frequently requested services, or fill out the form for a health consultation.",
    quickTitle: "Popular Searches",
    quickDesc: "Easily reach the most visited services and pages.",
    quickLinks: [
      "Hisar Hospital Integrated Oncology Center",
      "Obstetrics and Gynecology",
      "Robotic Surgery",
      "Healthy Life Guide",
    ],
    formTitle: "Medical Consultation",
    formDesc:
      "Leave your details for your health questions and appointment requests, and our team will get in touch with you.",
    prototypeNote:
      "This form is a design prototype; submission is not active.",
    successTitle: "Your request has been received.",
    successDesc: "Our team will get in touch with you as soon as possible.",
    successReset: "Send a new message →",
    labels: {
      name: "Your Full Name",
      phone: "Your Phone Number",
      email: "Your Email Address",
      subject: "Subject of Interest",
      message: "Your Message",
    },
    placeholders: {
      name: "Full Name",
      phone: "0 (___) ___ __ __",
      email: "example@email.com",
      subject: "Select a subject",
      message: "Briefly write the topic you would like to consult about...",
    },
    subjects: [
      "Appointment request",
      "Doctor / department information",
      "Check-up packages",
      "Contracted institution / insurance",
      "Health tourism / international patients",
      "Other",
    ],
    kvkkBefore: "I consent to the processing of my personal data under the",
    kvkkLink: "Privacy Notice",
    kvkkAfter: "framework.",
    submit: "Send",
    submitting: "Sending...",
    responseLabel: "Average response time:",
    responseValue: "2 hours",
    errors: {
      name: "Full name is required",
      phone: "Please check your phone number",
      email: "Enter a valid email",
      subject: "Select a subject",
      message: "Write a short message",
      kvkk: "KVKK consent is required",
    },
  },
} as const;

type FormState = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  kvkk: boolean;
};

const INITIAL: FormState = {
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
  kvkk: false,
};

export function PreFooter() {
  const c = COPY[useLocale()];
  const lp = useLocalizedPath();

  const schema = z.object({
    name: z.string().trim().min(2, c.errors.name).max(80),
    phone: z
      .string()
      .trim()
      .min(7, c.errors.phone)
      .max(20)
      .regex(/^[0-9\s()+\-]+$/, c.errors.phone),
    email: z.string().trim().email(c.errors.email).max(120),
    subject: z.string().min(1, c.errors.subject),
    message: z.string().trim().min(5, c.errors.message).max(1000),
    kvkk: z.literal(true, { message: c.errors.kvkk }),
  });

  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof FormState, string>> = {};
      for (const iss of parsed.error.issues) {
        const key = iss.path[0] as keyof FormState;
        if (!errs[key]) errs[key] = iss.message;
      }
      setErrors(errs);
      return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
    setForm(INITIAL);
  }

  const quickLinks = QUICK_LINK_PATHS.map((to, i) => ({ to, label: c.quickLinks[i] }));

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface via-primary-soft/30 to-surface py-16 lg:py-24">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-brand-cyan/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-brand-orange/10 blur-3xl" />

      <div className="container-x relative">
        {/* Section header */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary ring-1 ring-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-brand-orange" /> {c.badge}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-primary text-balance">
            {c.heading}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl">
            {c.subtitle}
          </p>
        </div>

        {/* Two-column grid */}
        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          {/* Left: Quick access */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="rounded-3xl bg-white ring-1 ring-border/70 shadow-[0_10px_40px_-20px_rgba(15,27,61,0.25)] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-primary">
                    {c.quickTitle}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    {c.quickDesc}
                  </p>
                </div>
                <div className="hidden sm:grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary shrink-0">
                  <Stethoscope className="h-5 w-5" strokeWidth={1.5} />
                </div>
              </div>

              <ul className="mt-5 space-y-2.5">
                {quickLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={lp(item.to)}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface/70 hover:bg-white hover:border-primary/30 hover:shadow-sm px-4 py-3 transition"
                    >
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition">
                        {item.label}
                      </span>
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-white ring-1 ring-border/70 text-brand-orange group-hover:bg-brand-orange group-hover:text-white group-hover:ring-brand-orange transition shrink-0">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

            </div>



          </div>

          {/* Right: Form */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl bg-white ring-1 ring-border/70 shadow-[0_20px_60px_-25px_rgba(15,27,61,0.35)] p-6 sm:p-8 lg:p-10 relative overflow-hidden">

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-primary">
                    {c.formTitle}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground max-w-md">
                    {c.formDesc}
                  </p>
                </div>
              </div>

              {/* Prototype note — submission is intentionally not wired to a backend */}
              <p className="mt-4 rounded-xl bg-primary-soft/50 ring-1 ring-primary/10 px-3.5 py-2.5 text-xs font-medium text-primary">
                {c.prototypeNote}
              </p>

              {status === "success" ? (
                <div className="mt-8 rounded-2xl bg-primary-soft/60 ring-1 ring-primary/15 p-6 flex items-start gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-primary shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{c.successTitle}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {c.successDesc}
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="mt-3 text-xs font-semibold text-primary hover:text-brand-orange transition"
                    >
                      {c.successReset}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={c.labels.name} error={errors.name}>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        placeholder={c.placeholders.name}
                        className={inputCls(!!errors.name)}
                      />
                    </Field>
                    <Field label={c.labels.phone} error={errors.phone}>
                      <input
                        type="tel"
                        inputMode="tel"
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        placeholder={c.placeholders.phone}
                        className={inputCls(!!errors.phone)}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={c.labels.email} error={errors.email}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder={c.placeholders.email}
                        className={inputCls(!!errors.email)}
                      />
                    </Field>
                    <Field label={c.labels.subject} error={errors.subject}>
                      <select
                        value={form.subject}
                        onChange={(e) => setField("subject", e.target.value)}
                        className={cn(inputCls(!!errors.subject), "appearance-none pr-10 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%230f1b3d%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-no-repeat bg-[right_1rem_center]")}
                      >
                        <option value="">{c.placeholders.subject}</option>
                        {c.subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label={c.labels.message} error={errors.message}>
                    <textarea
                      value={form.message}
                      onChange={(e) => setField("message", e.target.value)}
                      rows={4}
                      placeholder={c.placeholders.message}
                      className={cn(inputCls(!!errors.message), "resize-none py-3")}
                    />
                  </Field>

                  <label className="flex items-start gap-3 pt-1 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.kvkk}
                      onChange={(e) => setField("kvkk", e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      {c.kvkkBefore}{" "}
                      <a href="#" className="text-primary font-semibold hover:text-brand-orange transition underline underline-offset-2">
                        {c.kvkkLink}
                      </a>{" "}
                      {c.kvkkAfter}
                    </span>
                  </label>
                  {errors.kvkk && <p className="text-xs font-medium text-destructive -mt-2">{errors.kvkk}</p>}

                  <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-orange px-8 py-3.5 text-sm font-bold text-brand-orange-foreground shadow-orange hover:-translate-y-0.5 transition disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> {c.submitting}
                        </>
                      ) : (
                        <>
                          {c.submit} <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                    <p className="text-xs text-muted-foreground sm:ml-2">
                      {c.responseLabel} <span className="font-semibold text-primary">{c.responseValue}</span>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-primary/80 mb-1.5 tracking-wide">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-surface/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition",
    "focus:bg-white focus:ring-2 focus:ring-primary/15",
    hasError
      ? "border-destructive/60 focus:border-destructive focus:ring-destructive/15"
      : "border-border/70 focus:border-primary",
  );
}
