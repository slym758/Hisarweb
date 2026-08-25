import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { Menu, Search } from "lucide-react";
import { LangPill } from "./LangSwitcher";
import { useCurrentPath, useLocalizedPath } from "@/lib/i18n";

/** Height of the compact sticky mobile header, in px. */
export const COMPACT_MOBILE_HEADER_H = 66;

/** True below 768px once the page is scrolled past the initial header. */
export function useCompactMobileHeader() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px)");
    const update = () => setActive(small.matches && window.scrollY > 80);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    small.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      small.removeEventListener("change", update);
    };
  }, []);

  return active;
}

/**
 * Compact sticky header shown on phones after ~80px of scroll. Mirrors the
 * pre-scroll mobile header layout: hamburger on the left, emblem in the
 * center, and search + language on the right. Only the language control
 * moves into this compact band; the other controls keep their original
 * positions.
 */
export function MobileCompactHeader({
  active,
  onOpenMenu,
  onOpenSearch,
  labels,
  home = "/",
  showLang = true,
}: {
  active: boolean;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  labels: { menu: string; search: string; home: string };
  home?: string;
  /** Render the compact language control (hidden on the English site header). */
  showLang?: boolean;
}) {
  const lp = useLocalizedPath();
  const pathname = useCurrentPath();
  const hidden = ["/admin", "/auth", "/api"].some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (hidden) return null;

  return (
    <div
      aria-hidden={!active}
      className={`fixed inset-x-0 top-0 z-[1000] md:hidden border-b border-border/70 bg-background shadow-[0_1px_12px_-6px_hsl(var(--primary)/0.35)] transition-[opacity,transform] duration-200 ease-out ${
        active ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div
        className="relative flex items-center justify-between px-2"
        style={{ height: `${COMPACT_MOBILE_HEADER_H}px` }}
      >
        {/* Left zone — hamburger (same as pre-scroll mobile header) */}
        <div className="flex min-w-0 items-center justify-start">
          <button
            type="button"
            onClick={onOpenMenu}
            tabIndex={active ? undefined : -1}
            aria-label={labels.menu}
            className="-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-primary transition hover:bg-primary-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
        </div>

        {/* Center zone — emblem, mathematically centred to the viewport */}
        <Link
          href={lp(home)}
          aria-label={labels.home}
          tabIndex={active ? undefined : -1}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        >
          {/* TODO: real asset */}
          <img
            src="/assets/hisar-emblem.png"
            alt="Hisar Hospital 20. Yıl"
            className={`logo-swap h-9 w-auto ${active ? "logo-swap-in" : "logo-swap-out"}`}
          />
        </Link>

        {/* Right zone — search + language (only the language is new here) */}
        <div className="flex min-w-0 items-center justify-end gap-0.5">
          <button
            type="button"
            onClick={onOpenSearch}
            tabIndex={active ? undefined : -1}
            aria-label={labels.search}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-primary transition hover:bg-primary-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            <Search className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
          {showLang && <LangPill className="-mr-1" />}
        </div>
      </div>
    </div>
  );
}
