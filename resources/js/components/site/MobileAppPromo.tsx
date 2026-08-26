import { useEffect, useState } from "react";
import { Link, usePage } from '@inertiajs/react';
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

/** An admin-managed popup, resolved to the active locale by PopupService (shared as `popups`). */
interface SharedPopup {
  id: number;
  type: string;
  title: string | null;
  body: string | null;
  cta_label: string | null;
  image: string | null;
  cta_link: string | null;
  dismiss_scope: string;
  dismiss_days: number;
}

function isDismissed(key: string, scope: string): boolean {
  try {
    if (scope === "days") {
      const raw = localStorage.getItem(key);
      if (!raw) return false;
      const until = Number(raw);
      return Number.isFinite(until) && Date.now() < until;
    }
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function storeDismiss(key: string, scope: string, days: number): void {
  try {
    if (scope === "days") {
      localStorage.setItem(key, String(Date.now() + days * 24 * 60 * 60 * 1000));
      return;
    }
    sessionStorage.setItem(key, "1");
  } catch {
    /* ignore */
  }
}

export function MobileAppPromo({ lang }: { lang?: "tr" | "en" }) {
  const locale = useLocale();
  const active = lang ?? locale;
  const t = COPY[active];
  const lp = useLocalizedPath();
  const pathname = useCurrentPath();

  // Admin-managed popups for this route (the server already applied target/suppress route
  // filtering). When the prop is a shared array we trust it; when it is absent entirely
  // (feature off / non-Inertia) we fall back to the original hardcoded behaviour.
  const shared = (usePage().props as unknown as { popups?: SharedPopup[] }).popups;
  const hasServerPopups = Array.isArray(shared);
  const dbPromo = hasServerPopups ? shared!.find((p) => p.type === "app_promo") : undefined;

  const dismissKey = dbPromo ? `hisar-popup-${dbPromo.id}` : SESSION_KEY;
  const dismissScope = dbPromo?.dismiss_scope ?? "session";
  const dismissDays = dbPromo?.dismiss_days ?? 7;

  const [hidden, setHidden] = useState(true);

  // Hardcoded suppression — used only by the fallback (no server popups shared).
  const suppressedRoute =
    pathname === "/mobil-uygulama" ||
    pathname === "/randevu-al" ||
    pathname === "/butunlesik-onkoloji" ||
    pathname.startsWith("/butunlesik-onkoloji/");

  useEffect(() => {
    setHidden(isDismissed(dismissKey, dismissScope));
  }, [dismissKey, dismissScope]);

  const dismiss = () => {
    setHidden(true);
    storeDismiss(dismissKey, dismissScope, dismissDays);
  };

  // Server spoke: popups shared but none for this route → render nothing (suppression).
  if (hasServerPopups && !dbPromo) return null;
  // Fallback (no server popups): keep the original route suppression.
  if (!hasServerPopups && suppressedRoute) return null;
  if (hidden) return null;

  const title = dbPromo?.title ?? t.title;
  const desc = dbPromo?.body ?? t.desc;
  const ctaLabel = dbPromo?.cta_label ?? t.cta;
  const image = dbPromo?.image ?? "/assets/hisar-emblem.png";

  const ctaClass =
    "inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-orange px-4 py-2 text-xs font-semibold text-brand-orange-foreground shadow-orange transition hover:opacity-95";

  const Cta = ({ className }: { className?: string }) => {
    const cls = `${ctaClass} ${className ?? ""}`;
    const inner = (
      <>
        <Download className="h-4 w-4" aria-hidden />
        {ctaLabel}
      </>
    );

    if (dbPromo) {
      const href = dbPromo.cta_link ?? "#";
      return href.startsWith("/") ? (
        <Link href={lp(href)} className={cls}>
          {inner}
        </Link>
      ) : (
        <a href={href} className={cls}>
          {inner}
        </a>
      );
    }

    // Fallback: unchanged from the original hardcoded behaviour.
    return active === "tr" ? (
      <Link href={lp("/mobil-uygulama")} className={cls}>
        {inner}
      </Link>
    ) : (
      <a href="#" className={cls}>
        {inner}
      </a>
    );
  };

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
              src={image}
              alt={t.alt}
              className="phone-tilt block h-20 w-20 object-contain"
              loading="lazy"
              width={200}
              height={200}
            />
            <span className="phone-gloss" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-sm font-bold text-primary">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
            <Cta className="mt-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
