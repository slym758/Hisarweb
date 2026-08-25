import { useEffect, useState } from "react";
import { Link } from '@inertiajs/react';
import { X, Download } from "lucide-react";
import { useCurrentPath, useLocalizedPath, useLocale } from "@/lib/i18n";

/** Demo behaviour: hidden only for the current browser session. */
const SESSION_KEY = "hisar-app-promo-hidden-session";

const COPY = {
  tr: {
    aria: "Mobil uygulama tanıtımı",
    close: "Kapat",
    alt: "Hisar Mobile uygulama önizlemesi",
    title: "Hisar Mobil",
    desc: "Sağlığınız her an yanınızda",
    cta: "İndir",
  },
  en: {
    aria: "Mobile app promotion",
    close: "Close",
    alt: "Hisar Mobile app preview",
    title: "Hisar Mobile",
    desc: "Your health with you, anytime",
    cta: "Download",
  },
} as const;

export function MobileAppPromo({ lang }: { lang?: "tr" | "en" }) {
  const locale = useLocale();
  const active = lang ?? locale;
  const t = COPY[active];
  const lp = useLocalizedPath();
  const pathname = useCurrentPath();
  const [hidden, setHidden] = useState(true);

  const suppressedRoute =
    pathname === "/mobil-uygulama" ||
    pathname === "/randevu-al" ||
    pathname === "/butunlesik-onkoloji" ||
    pathname.startsWith("/butunlesik-onkoloji/");


  useEffect(() => {
    try {
      setHidden(sessionStorage.getItem(SESSION_KEY) === "1");
    } catch {
      setHidden(false);
    }
  }, []);

  const dismiss = () => {
    setHidden(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (hidden || suppressedRoute) return null;

  const ctaClass =
    "inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-orange px-4 py-2 text-xs font-semibold text-brand-orange-foreground shadow-orange transition hover:opacity-95";
  const Cta = ({ className }: { className?: string }) =>
    active === "tr" ? (
      <Link href={lp("/mobil-uygulama")} className={`${ctaClass} ${className ?? ""}`}>
        <Download className="h-4 w-4" aria-hidden />
        {t.cta}
      </Link>
    ) : (
      <a href="#" className={`${ctaClass} ${className ?? ""}`}>
        <Download className="h-4 w-4" aria-hidden />
        {t.cta}
      </a>
    );

  return (
    <div
      role="complementary"
      aria-label={t.aria}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+76px)] left-3 right-3 z-[120] animate-in fade-in slide-in-from-bottom-4 duration-500 sm:left-auto sm:right-5 sm:bottom-5 sm:w-[23rem] lg:bottom-6 lg:right-24"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-4 shadow-elevated backdrop-blur-xl">
        <div
          className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_0%_0%,hsl(var(--primary)/0.10),transparent_60%)]"
          aria-hidden
        />
        <button
          onClick={dismiss}
          aria-label={t.close}
          className="absolute right-1 top-1 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="relative flex items-center gap-4 pr-10">
          <div className="phone-stage shrink-0">
            {/* TODO: real asset */}
            <img
              src="/assets/hisar-emblem.png"
              alt={t.alt}
              className="phone-tilt block h-20 w-20 object-contain"
              loading="lazy"
              width={200}
              height={200}
            />
            <span className="phone-gloss" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-sm font-bold text-primary">{t.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.desc}</p>
            <Cta className="mt-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
