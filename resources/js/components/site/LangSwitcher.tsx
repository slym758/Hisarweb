import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, router } from "@inertiajs/react";
import { Check, ChevronDown, Globe, X } from "lucide-react";
import { useActiveLocale, useCurrentPath, useDefaultLocale, useLocales, localizedPath, type LanguageOption } from "@/lib/i18n";

/** Flag emoji per known locale; falls back to the uppercased code. */
const FLAGS: Record<string, string> = {
  tr: "🇹🇷", en: "🇬🇧", fr: "🇫🇷", ru: "🇷🇺", kk: "🇰🇿", ar: "🇸🇦",
  ro: "🇷🇴", ka: "🇬🇪", de: "🇩🇪", sq: "🇦🇱", mk: "🇲🇰", bg: "🇧🇬",
};

function flagFor(code: string): string {
  return FLAGS[code] ?? code.toUpperCase();
}

/** Emoji flags need a larger optical size; text codes match the label font. */
function Flag({ flag, size }: { flag: string; size: "base" | "lg" }) {
  const isEmoji = /\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]/u.test(flag);
  return (
    <span
      aria-hidden
      className={`leading-none ${isEmoji ? (size === "lg" ? "text-lg" : "text-base") : "w-[22px] text-center text-[11px] font-bold tracking-wider"}`}
    >
      {flag}
    </span>
  );
}

/** Routes that are outside the public website shell. */
const EXCLUDED_PREFIXES = ["/admin", "/auth", "/api"];

function a11yLabel(active: LanguageOption | undefined): string {
  return active ? `Dil / Language: ${active.native_name} — open language options` : "Dil / Language";
}

/** Shared dropdown list of languages. */
function LangMenu({
  current,
  locales,
  defaultLocale,
  onClose,
  align = "left",
}: {
  current: string;
  locales: LanguageOption[];
  defaultLocale: string;
  onClose: () => void;
  /** "left" opens toward the left of the trigger, "below" drops under it. */
  align?: "left" | "below";
}) {
  const currentPath = useCurrentPath();
  const active = locales.find((l) => l.code === current);
  return (
    <div
      className={`absolute z-10 w-[216px] overflow-hidden rounded-xl bg-background/95 shadow-elevated ring-1 ring-border/70 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 ${
        align === "left" ? "right-full top-0 mr-2" : "left-0 top-full mt-2"
      }`}
    >
      <ul role="listbox" aria-label={a11yLabel(active)} className="max-h-[62vh] overflow-y-auto overscroll-contain py-1">
        {locales.map((l) => {
          const isActive = l.code === current;
          const href = localizedPath(currentPath, l.code, defaultLocale);
          return (
            <li key={l.code}>
              <Link
                href={href}
                role="option"
                aria-selected={isActive}
                onClick={(e) => {
                  e.preventDefault();
                  router.visit(href);
                  onClose();
                }}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-sm transition focus-visible:outline-none focus-visible:bg-primary-soft/60 ${
                  isActive ? "bg-primary-soft/50 font-semibold text-primary" : "text-foreground hover:bg-primary-soft/40"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Flag flag={flagFor(l.code)} size="base" />
                  {l.native_name}
                </span>
                {isActive && <Check className="h-3.5 w-3.5 text-brand-orange" aria-hidden />}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Shared outside-click / Escape / route-change close behaviour. */
function useDismiss(setOpen: (v: boolean) => void, pathname: string) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [setOpen]);
  useEffect(() => setOpen(false), [pathname, setOpen]);
  return ref;
}

/**
 * Accessible mobile bottom sheet listing every language. Used by the compact
 * sticky mobile header so the menu never overflows the viewport.
 */
export function LangSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const currentPath = useCurrentPath();
  const current = useActiveLocale();
  const locales = useLocales();
  const defaultLocale = useDefaultLocale();
  const active = locales.find((l) => l.code === current);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[1200] md:hidden" role="dialog" aria-modal="true" aria-label={a11yLabel(active)}>
      <button
        type="button"
        aria-label="Kapat / Close"
        onClick={onClose}
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm animate-in fade-in-0"
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[76vh] overflow-hidden rounded-t-2xl bg-background shadow-elevated animate-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            <Globe className="h-4 w-4 text-brand-cyan" aria-hidden />
            Dil / Language
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat / Close"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-primary transition hover:bg-primary-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <ul
          role="listbox"
          aria-label={a11yLabel(active)}
          className="max-h-[58vh] overflow-y-auto overscroll-contain px-2 py-2 pb-[calc(env(safe-area-inset-bottom)+12px)]"
        >
          {locales.map((l) => {
            const isActive = l.code === current;
            const href = localizedPath(currentPath, l.code, defaultLocale);
            return (
              <li key={l.code}>
                <Link
                  href={href}
                  role="option"
                  aria-selected={isActive}
                  onClick={(e) => {
                    e.preventDefault();
                    router.visit(href);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3.5 text-[15px] transition ${
                    isActive ? "bg-primary-soft/60 font-semibold text-primary" : "text-foreground hover:bg-primary-soft/40"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Flag flag={flagFor(l.code)} size="lg" />
                    {l.native_name}
                  </span>
                  {isActive && <Check className="h-4 w-4 text-brand-orange" aria-hidden />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body,
  );
}

/**
 * Compact inline language control. Used by the compact sticky mobile header —
 * opens the accessible {@link LangSheet} bottom sheet.
 */
export function LangPill({ className = "" }: { className?: string }) {
  const currentPath = useCurrentPath();
  const locale = useActiveLocale();
  const [open, setOpen] = useState(false);

  if (EXCLUDED_PREFIXES.some((p) => currentPath === p || currentPath.startsWith(`${p}/`))) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Dil / Language"
        className={`inline-flex h-11 min-w-[44px] items-center justify-center gap-1 rounded-full px-2 text-[13px] font-bold tracking-wide text-primary transition hover:bg-primary-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${className}`}
      >
        {locale.toUpperCase()}
        <ChevronDown className="h-3 w-3 opacity-70" aria-hidden />
      </button>
      <LangSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/**
 * Global language switcher docked to the right edge of the viewport. On desktop it
 * floats over the banner and then tucks into the header band on scroll. On mobile
 * it hides once scrolled — the inline {@link LangPill} takes over.
 */
export function LangSwitcher() {
  const currentPath = useCurrentPath();
  const locale = useActiveLocale();
  const locales = useLocales();
  const defaultLocale = useDefaultLocale();
  const [open, setOpen] = useState(false);
  const ref = useDismiss(setOpen, currentPath);

  /** Docked = user scrolled past the banner. */
  const [docked, setDocked] = useState(false);
  const [isWide, setIsWide] = useState(false);
  /** Below 768px the compact sticky header owns the switcher once scrolled. */
  const [handedOver, setHandedOver] = useState(false);
  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px)");
    const onScroll = () => {
      setDocked(window.scrollY > 180);
      setHandedOver(small.matches && window.scrollY > 80);
    };
    const mql = window.matchMedia("(min-width: 640px)");
    const onMql = () => {
      setIsWide(mql.matches);
      onScroll();
    };
    onScroll();
    onMql();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mql.addEventListener("change", onMql);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mql.removeEventListener("change", onMql);
    };
  }, []);

  if (EXCLUDED_PREFIXES.some((p) => currentPath === p || currentPath.startsWith(`${p}/`))) {
    return null;
  }

  /** Once scrolled on mobile the compact header pill owns the switcher. */
  const hiddenOnMobile = handedOver || (docked && !isWide);

  const top = docked
    ? "calc(env(safe-area-inset-top) + 21px)"
    : isWide
      ? "148px"
      : "calc(env(safe-area-inset-top) + 124px)";

  return (
    <div
      className={`fixed right-0 z-[130] transition-[top,opacity] duration-300 ease-out ${
        hiddenOnMobile ? "pointer-events-none opacity-0 sm:pointer-events-auto sm:opacity-100" : ""
      }`}
      style={{ paddingRight: "env(safe-area-inset-right)", top }}
    >
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Dil / Language"
          tabIndex={hiddenOnMobile ? -1 : undefined}
          className={`inline-flex min-w-0 items-center justify-center rounded-l-full rounded-r-none font-bold tracking-wider text-white shadow-elevated ring-1 ring-white/25 backdrop-blur-md transition-all duration-300 hover:ring-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
            docked
              ? "h-8 w-8 gap-0 bg-primary/85 px-0 text-[11px] hover:bg-primary sm:h-8 sm:w-auto sm:min-w-[62px] sm:gap-1 sm:px-2.5"
              : "h-10 gap-1.5 bg-primary/70 pl-3 pr-2.5 text-[12px] hover:bg-primary/85 sm:h-9 sm:w-auto sm:min-w-[84px] sm:rounded-l-xl sm:px-3"
          }`}
        >
          <Globe className="h-4 w-4 shrink-0 text-brand-cyan sm:h-3.5 sm:w-3.5" aria-hidden />
          <span className={docked ? "hidden sm:inline" : "inline"}>{locale.toUpperCase()}</span>
          <ChevronDown
            className={`h-3 w-3 shrink-0 opacity-80 transition-transform ${open ? "rotate-180" : ""} ${docked ? "hidden sm:block sm:hidden" : "block"}`}
            aria-hidden
          />
        </button>

        {open && <LangMenu current={locale} locales={locales} defaultLocale={defaultLocale} onClose={() => setOpen(false)} />}
      </div>
    </div>
  );
}
