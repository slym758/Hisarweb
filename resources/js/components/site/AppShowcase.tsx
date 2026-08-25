import { Link } from "@inertiajs/react";
import { CalendarCheck, FileText, Stethoscope, Bell, Download } from "lucide-react";
import { useLocale, useLocalizedPath } from "@/lib/i18n";

// TODO: real asset
const mockupUrl =
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80";

const COPY = {
  tr: {
    eyebrow: "Hisar Mobile",
    title: "Sağlığınız cebinizde",
    desc: "Randevularınızı yönetin, laboratuvar ve görüntüleme sonuçlarınıza anında ulaşın, uzman hekimlerimize kolayca erişin.",
    perks: ["Hızlı randevu", "E-Sonuç erişimi", "Doktor bul", "Akıllı hatırlatma"],
    primary: "Uygulamayı İndir",
    secondary: "Özellikleri incele",
    alt: "Hisar Mobile uygulama ekran görüntüsü",
  },
  en: {
    eyebrow: "Hisar Mobile",
    title: "Your health, in your pocket",
    desc: "Manage your appointments, access your laboratory and imaging results instantly and reach our specialists with a single tap.",
    perks: ["Fast appointment", "E-Results access", "Find a doctor", "Smart reminders"],
    primary: "Download the App",
    secondary: "Explore features",
    alt: "Hisar Mobile app preview",
  },
} as const;

const perkIcons = [CalendarCheck, FileText, Stethoscope, Bell];

export function AppShowcase({ lang }: { lang?: "tr" | "en" }) {
  const locale = useLocale();
  const active = lang ?? locale;
  const lp = useLocalizedPath();
  const t = COPY[active];
  const perks = t.perks.map((label, i) => ({ label, icon: perkIcons[i] }));
  return (
    <section aria-labelledby="app-showcase-title" className="py-12 lg:py-16">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary via-primary to-primary/90 px-6 py-10 text-primary-foreground lg:px-12 lg:py-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_85%_15%,hsl(var(--brand-cyan)/0.25),transparent_55%)]"
            aria-hidden
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                {t.eyebrow}
              </span>
              <h2
                id="app-showcase-title"
                className="mt-4 text-2xl font-black tracking-tight lg:text-3xl"
              >
                {t.title}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80 lg:mx-0 lg:text-base">
                {t.desc}
              </p>

              <ul className="mx-auto mt-6 grid max-w-lg grid-cols-2 gap-3 text-left lg:mx-0">
                {perks.map((p) => (
                  <li
                    key={p.label}
                    className="flex items-center gap-2.5 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold"
                  >
                    <p.icon className="h-4 w-4 shrink-0 text-brand-cyan" aria-hidden />
                    {p.label}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                {active === "tr" ? (
                  <>
                    <Link
                      href={lp("/mobil-uygulama")}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-6 text-sm font-bold text-brand-orange-foreground shadow-orange transition hover:opacity-95 sm:w-auto"
                    >
                      <Download className="h-4 w-4" aria-hidden />
                      {t.primary}
                    </Link>
                    <Link
                      href={lp("/mobil-uygulama")}
                      className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10 sm:w-auto"
                    >
                      {t.secondary}
                    </Link>
                  </>
                ) : (
                  <>
                    <a
                      href="#"
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-6 text-sm font-bold text-brand-orange-foreground shadow-orange transition hover:opacity-95 sm:w-auto"
                    >
                      <Download className="h-4 w-4" aria-hidden />
                      {t.primary}
                    </a>
                    <a
                      href="#"
                      className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10 sm:w-auto"
                    >
                      {t.secondary}
                    </a>
                  </>
                )}
              </div>
            </div>

            <div className="phone-stage mx-auto">
              {/* TODO: real asset */}
              <img
                src={mockupUrl}
                alt={t.alt}
                className="phone-tilt block h-56 w-auto object-contain lg:h-72"
                loading="lazy"
                width={420}
                height={560}
              />
              <span className="phone-gloss" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
