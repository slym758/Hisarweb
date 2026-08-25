import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, router } from "@inertiajs/react";
import { Check, ChevronDown, Globe, X } from "lucide-react";
import { useCurrentPath, useLocale } from "@/lib/i18n";

type LangCode = "TR" | "EN";

/** Active languages — actually routed. */
const LANGS: { code: LangCode; label: string; flag: string; to: string }[] = [
  { code: "TR", label: "Türkçe", flag: "🇹🇷", to: "/" },
  { code: "EN", label: "English", flag: "EN", to: "/en" },
];

/** Display-only languages (not yet available). */
const SOON: { code: string; label: string; flag: string }[] = [
  { code: "FR", label: "Français", flag: "🇫🇷" },
  { code: "DE", label: "Deutsch", flag: "🇩🇪" },
  { code: "RU", label: "Русский", flag: "🇷🇺" },
  { code: "AR", label: "العربية", flag: "🇸🇦" },
  { code: "KK", label: "Қазақша", flag: "🇰🇿" },
  { code: "RO", label: "Română", flag: "🇷🇴" },
  { code: "KA", label: "ქართული", flag: "🇬🇪" },
  { code: "SQ", label: "Shqip", flag: "🇦🇱" },
  { code: "MK", label: "Македонски", flag: "🇲🇰" },
  { code: "BG", label: "Български", flag: "🇧🇬" },
];

/** Emoji flags need a larger optical size; text codes match the label font. */
function Flag({ flag, size, dim = false }: { flag: string; size: "base" | "lg"; dim?: boolean }) {
  const isEmoji = /\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]/u.test(flag);
  return (
    <span
      aria-hidden
      className={`leading-none ${isEmoji ? (size === "lg" ? "text-lg" : "text-base") : "w-[22px] text-center text-[11px] font-bold tracking-wider"} ${
        dim ? "opacity-55 grayscale" : ""
      }`}
    >
      {flag}
    </span>
  );
}

const A11Y: Record<LangCode, string> = {
  TR: "Dil: Türkçe — dil seçeneklerini aç",
  EN: "Language: English — open language options",
};

/** Routes that are outside the public website shell. */
const EXCLUDED_PREFIXES = ["/admin", "/auth", "/api"];

/**
 * Navigate to the current page in the requested language. Turkish is served at
 * the root; English uses a `/en` prefix. `currentPathTr` is the locale-agnostic
 * path (see {@link useCurrentPath}) so the language switch preserves the page.
 */
function switchLang(code: LangCode, currentPathTr: string) {
  router.visit(code === "EN" ? "/en" + currentPathTr : currentPathTr);
}

/** The routed href for a language option (used for anchor semantics). */
function langHref(code: LangCode, currentPathTr: string) {
  return code === "EN" ? "/en" + currentPathTr : currentPathTr;
}

/** Shared dropdown list of languages. */
function LangMenu({
  current,
  onClose,
  align = "left",
}: {
  current: LangCode;
  onClose: () => void;
  /** "left" opens toward the left of the trigger, "below" drops under it. */
  align?: "left" | "below";
}) {
  const currentPathTr = useCurrentPath();
  return (
    <div
      className={`absolute z-10 w-[216px] overflow-hidden rounded-xl bg-background/95 shadow-elevated ring-1 ring-border/70 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 ${
        align === "left" ? "right-full top-0 mr-2" : "left-0 top-full mt-2"
      }`}
    >
      <ul role="listbox" aria-label={A11Y[current]} className="max-h-[62vh] overflow-y-auto overscroll-contain py-1">
        {LANGS.map((l) => {
          const active = l.code === current;
          return (
            <li key={l.code}>
              <Link
                href={langHref(l.code, currentPathTr)}
                role="option"
                aria-selected={active}
                onClick={(e) => {
                  e.preventDefault();
                  switchLang(l.code, currentPathTr);
                  onClose();
                }}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-sm transition focus-visible:outline-none focus-visible:bg-primary-soft/60 ${
                  active ? "bg-primary-soft/50 font-semibold text-primary" : "text-foreground hover:bg-primary-soft/40"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Flag flag={l.flag} size="base" />
                  {l.label}
                </span>
                {active && <Check className="h-3.5 w-3.5 text-brand-orange" aria-hidden />}
              </Link>
            </li>
          );
        })}

        <li
          role="presentation"
          className="mt-1 border-t border-border/70 px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
        >
          {current === "EN" ? "Coming soon" : "Yakında"}
        </li>

        {SOON.map((l) => (
          <li key={l.code}>
            <span
              role="option"
              aria-selected={false}
              aria-disabled="true"
              title={current === "EN" ? "Coming soon" : "Yakında"}
              className="flex w-full cursor-not-allowed items-center justify-between gap-3 px-3 py-2.5 text-sm text-muted-foreground/80"
            >
              <span className="flex items-center gap-2.5">
                <Flag flag={l.flag} size="base" dim />
                {l.label}
              </span>
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                {current === "EN" ? "soon" : "yakında"}
              </span>
            </span>
          </li>
        ))}
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
  const currentPathTr = useCurrentPath();
  const locale = useLocale();
  const current: LangCode = locale === "en" ? "EN" : "TR";

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
    <div className="fixed inset-0 z-[1200] md:hidden" role="dialog" aria-modal="true" aria-label={A11Y[current]}>
      <button
        type="button"
        aria-label={current === "EN" ? "Close" : "Kapat"}
        onClick={onClose}
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm animate-in fade-in-0"
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[76vh] overflow-hidden rounded-t-2xl bg-background shadow-elevated animate-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            <Globe className="h-4 w-4 text-brand-cyan" aria-hidden />
            {current === "EN" ? "Select language" : "Dil seçin"}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={current === "EN" ? "Close" : "Kapat"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-primary transition hover:bg-primary-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <ul
          role="listbox"
          aria-label={A11Y[current]}
          className="max-h-[58vh] overflow-y-auto overscroll-contain px-2 py-2 pb-[calc(env(safe-area-inset-bottom)+12px)]"
        >
          {LANGS.map((l) => {
            const active = l.code === current;
            return (
              <li key={l.code}>
                <Link
                  href={langHref(l.code, currentPathTr)}
                  role="option"
                  aria-selected={active}
                  onClick={(e) => {
                    e.preventDefault();
                    switchLang(l.code, currentPathTr);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3.5 text-[15px] transition ${
                    active ? "bg-primary-soft/60 font-semibold text-primary" : "text-foreground hover:bg-primary-soft/40"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Flag flag={l.flag} size="lg" />
                    {l.label}
                  </span>
                  {active && <Check className="h-4 w-4 text-brand-orange" aria-hidden />}
                </Link>
              </li>
            );
          })}

          <li
            role="presentation"
            className="mt-2 px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            {current === "EN" ? "Coming soon" : "Yakında"}
          </li>

          {SOON.map((l) => (
            <li key={l.code}>
              <span
                role="option"
                aria-selected={false}
                aria-disabled="true"
                className="flex w-full cursor-not-allowed items-center justify-between gap-3 rounded-xl px-3 py-3 text-[15px] text-muted-foreground/80"
              >
                <span className="flex items-center gap-3">
                  <Flag flag={l.flag} size="lg" dim />
                  {l.label}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {current === "EN" ? "soon" : "yakında"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}

/**
 * Compact inline "TR / EN" control. Used by the compact sticky mobile header —
 * opens the accessible {@link LangSheet} bottom sheet.
 */
export function LangPill({ className = "" }: { className?: string }) {
  const currentPathTr = useCurrentPath();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  if (EXCLUDED_PREFIXES.some((p) => currentPathTr === p || currentPathTr.startsWith(`${p}/`))) return null;

  const current: LangCode = locale === "en" ? "EN" : "TR";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={A11Y[current]}
        className={`inline-flex h-11 min-w-[44px] items-center justify-center gap-1 rounded-full px-2 text-[13px] font-bold tracking-wide text-primary transition hover:bg-primary-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${className}`}
      >
        {current}
        <ChevronDown className="h-3 w-3 opacity-70" aria-hidden />
      </button>
      <LangSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}


/**
 * Global TR/EN switcher docked to the right edge of the viewport. On desktop it
 * floats over the banner and then tucks into the header band on scroll. On
 * mobile it hides once scrolled — the inline {@link LangPill} takes over.
 */
export function LangSwitcher() {
  const currentPathTr = useCurrentPath();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useDismiss(setOpen, currentPathTr);

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

  if (EXCLUDED_PREFIXES.some((p) => currentPathTr === p || currentPathTr.startsWith(`${p}/`))) {
    return null;
  }

  const current: LangCode = locale === "en" ? "EN" : "TR";

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
          aria-label={A11Y[current]}
          tabIndex={hiddenOnMobile ? -1 : undefined}
          className={`inline-flex min-w-0 items-center justify-center rounded-l-full rounded-r-none font-bold tracking-wider text-white shadow-elevated ring-1 ring-white/25 backdrop-blur-md transition-all duration-300 hover:ring-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
            docked
              ? "h-8 w-8 gap-0 bg-primary/85 px-0 text-[11px] hover:bg-primary sm:h-8 sm:w-auto sm:min-w-[62px] sm:gap-1 sm:px-2.5"
              : "h-10 gap-1.5 bg-primary/70 pl-3 pr-2.5 text-[12px] hover:bg-primary/85 sm:h-9 sm:w-auto sm:min-w-[84px] sm:rounded-l-xl sm:px-3"
          }`}
        >
          <Globe className="h-4 w-4 shrink-0 text-brand-cyan sm:h-3.5 sm:w-3.5" aria-hidden />
          <span className={docked ? "hidden sm:inline" : "inline"}>{current}</span>
          <ChevronDown
            className={`h-3 w-3 shrink-0 opacity-80 transition-transform ${open ? "rotate-180" : ""} ${docked ? "hidden sm:block sm:hidden" : "block"}`}
            aria-hidden
          />
        </button>


        {open && <LangMenu current={current} onClose={() => setOpen(false)} />}
      </div>
    </div>
  );
}
