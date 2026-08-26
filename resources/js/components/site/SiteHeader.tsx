import { Link } from "@inertiajs/react";
import {
  Menu, Search, X, ChevronRight, ChevronDown, Stethoscope, UserRound, Activity,
  ArrowRight, Phone, Facebook, Youtube, Instagram, Linkedin, Building2,
  Users, Sparkles, FileText, Compass,
} from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Logo } from "./Logo";
import { MobileCompactHeader, useCompactMobileHeader } from "./MobileCompactHeader";

import { DESKTOP_STICKY_NAV_H, EN_COPY, MobileDrawer, SearchOverlay, TR_COPY, useHeaderChrome } from "./HeaderShared";
import { isNavActive, useNav, type NavGroup, type NavLeaf } from "@/lib/navigation";
import { useCurrentPath, useLocalizedPath, useTranslations } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";

/* ─────────────────────────────  HEADER  ────────────────────────────── */

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const { scrolled, condensed, deskStuck } = useHeaderChrome();
  const compactMobile = useCompactMobileHeader();
  const [, setLang] = useState<"TR" | "EN">("TR");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const path = useCurrentPath();
  const NAV = useNav();
  const { t, locale } = useTranslations();
  const settings = useSettings();
  const baseCopy = locale === "en" ? EN_COPY : TR_COPY;
  // TR call-center phone + appointment CTA come from the admin-managed settings; the EN
  // header keeps its distinct direct line and "free second opinion" CTA untouched.
  const copy = locale === "en" ? baseCopy : {
    ...baseCopy,
    cta: { label: settings.appointment_label, to: settings.appointment_url },
    phone: { label: settings.phone_display, href: settings.phone_href },
  };
  const lp = useLocalizedPath();

  useEffect(() => { setMobileOpen(false); setOpenKey(null); }, [path]);
  useEffect(() => {
    const onOpen = () => setSearch(true);
    window.addEventListener("open-site-search", onOpen);
    return () => window.removeEventListener("open-site-search", onOpen);
  }, []);

  // Escape closes any open dropdown / search / drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenKey(null);
        setSearch(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Prevent background scroll when mobile drawer open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky xl:static top-0 z-40 w-full xl:bg-transparent xl:backdrop-blur-none xl:border-b-0 xl:shadow-none ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/70 shadow-sm"
          : "bg-background border-b border-transparent"
      }`}
    >
      {/* Top utility bar — never sticky; scrolls away with the document */}
      <div className="hidden xl:block bg-primary text-primary-foreground/90 text-[12.5px]">
        <div className="container-x flex h-9 items-center justify-between gap-4">
          <a href={settings.phone_href} className="inline-flex items-center gap-1.5 font-bold tracking-wide hover:text-white transition">
            <Phone className="h-3.5 w-3.5" aria-hidden />
            {settings.phone_display}
          </a>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, href: settings.facebook_url || "https://facebook.com/hisarhospital", label: "Facebook" },
                { Icon: X, href: settings.x_url || "https://x.com/hisarhospital", label: "X" },
                { Icon: Youtube, href: settings.youtube_url || "https://youtube.com/@hisarhospital", label: "YouTube" },
                { Icon: Instagram, href: settings.instagram_url || "https://instagram.com/hisarhospital", label: "Instagram" },
                { Icon: Linkedin, href: settings.linkedin_url || "https://linkedin.com/company/hisar-hospital", label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="opacity-80 hover:opacity-100 hover:text-white transition">
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </a>
              ))}
            </div>
            <span className="h-4 w-px bg-primary-foreground/20" />
            <nav aria-label="Ek bağlantılar" className="flex items-center gap-4 font-semibold">
              <a href="https://www.hisarhospital.com/en" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">For International Patients</a>
              <span className="h-3 w-px bg-primary-foreground/20" />
              {path.startsWith("/butunlesik-onkoloji") ? (
                <Link href={lp("/")} className="hover:text-white transition">Hisar Hospital Intercontinental</Link>
              ) : (
                <Link href={lp("/butunlesik-onkoloji")} className="hover:text-white transition">{t('header.integrated_oncology')}</Link>
              )}
              <span className="h-3 w-px bg-primary-foreground/20" />
              <Link href={lp("/hastane/camlica")} className="hover:text-white transition">Hisar Çamlıca</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Document-flow placeholder so nothing jumps when the nav goes fixed */}
      {deskStuck && <div aria-hidden className="hidden xl:block h-[var(--header-h)]" />}

      <div
        className={`w-full transition-[background-color,box-shadow] duration-200 ease-out ${
          deskStuck
            ? "xl:fixed xl:inset-x-0 xl:top-0 xl:z-40 xl:bg-background/90 xl:backdrop-blur-xl xl:border-b xl:border-border/70 xl:shadow-sm"
            : "xl:bg-background xl:border-b xl:border-transparent"
        }`}
      >
      <div
        className={`container-x flex items-center justify-between gap-4 transition-[height,opacity] duration-200 ease-out xl:h-[var(--nav-h)] xl:!visible xl:!opacity-100 ${
          compactMobile ? "invisible opacity-0" : ""
        } ${
          condensed ? "h-12" : "h-[var(--header-h)]"
        }`}
        style={{ ["--nav-h" as string]: deskStuck ? `${DESKTOP_STICKY_NAV_H}px` : "var(--header-h)" }}
      >


        {/* Mobile menu button */}
        <div className="flex items-center xl:hidden flex-1 justify-start">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-primary hover:bg-primary-soft/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            aria-label="Menüyü aç"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className={`xl:flex-none flex justify-center xl:justify-start origin-left transition-transform duration-200 ease-out ${deskStuck ? "xl:scale-[0.96]" : "xl:scale-100"}`}>
          <Logo compact={condensed} />
        </div>



        <div className="flex items-center gap-0.5 xl:hidden flex-1 justify-end">
          <button
            type="button"
            onClick={() => setSearch(true)}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-primary hover:bg-primary-soft/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            aria-label="Ara"
          >
            <Search className="h-5 w-5" aria-hidden />
          </button>
        </div>


        {/* Desktop nav */}
        <nav aria-label="Ana menü" className="hidden xl:flex items-center mx-auto min-w-0">
          <ul className="flex items-center gap-px">
            {NAV.map((item) => {
              const active = isNavActive(path, item.matches);
              if ("direct" in item) {
                return (
                  <li key={item.key}>
                    <Link
                      href={lp(item.to)}
                      aria-current={active ? "page" : undefined}
                      className={`group relative inline-flex items-center px-2.5 py-2 text-[13.5px] font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-md ${
                        active ? "text-primary" : "text-foreground/75 hover:text-primary"
                      }`}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute left-2.5 right-2.5 -bottom-[3px] h-[2px] rounded-full bg-brand-orange origin-left transition-transform duration-300 ${
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 opacity-70"
                        }`}
                      />
                    </Link>
                  </li>
                );
              }
              return (
                <DesktopDropdown
                  key={item.key}
                  group={item}
                  active={active}
                  openKey={openKey}
                  setOpenKey={setOpenKey}
                  path={path}
                />
              );
            })}
          </ul>
        </nav>

        {/* Right actions */}
        <div className="hidden xl:flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearch(true)}
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-primary-soft/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            aria-label="Ara"
          >
            <Search className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
      </div>


      {/* Mobile Drawer */}
      {mobileOpen && typeof document !== "undefined" && createPortal(
        <MobileDrawer
          nav={NAV}
          copy={copy}
          onClose={() => setMobileOpen(false)}
          lang={locale === "en" ? "EN" : "TR"}
          setLang={setLang}
        />,
        document.body
      )}

      <MobileCompactHeader
        active={compactMobile}
        onOpenMenu={() => setMobileOpen(true)}
        onOpenSearch={() => setSearch(true)}
        labels={{ menu: "Menüyü aç", search: "Ara", home: "Hisar Hospital ana sayfa" }}
      />

      {search && <SearchOverlay copy={copy} lang={locale} onClose={() => setSearch(false)} />}
    </header>
  );
}

/* ─────────────────────────────  DESKTOP DROPDOWN  ────────────────────────────── */

function DesktopDropdown({
  group, active, openKey, setOpenKey, path,
}: {
  group: NavGroup;
  active: boolean;
  openKey: string | null;
  setOpenKey: (k: string | null) => void;
  path: string;
}) {
  const lp = useLocalizedPath();
  const open = openKey === group.key;
  const menuId = useId();
  const wrapRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<number | null>(null);

  const clearTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openNow = useCallback(() => {
    clearTimer();
    setOpenKey(group.key);
  }, [group.key, setOpenKey]);

  const scheduleClose = useCallback(() => {
    clearTimer();
    closeTimer.current = window.setTimeout(() => setOpenKey(null), 140);
  }, [setOpenKey]);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpenKey(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, setOpenKey]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openNow();
      // Focus first item next tick
      window.setTimeout(() => {
        const first = wrapRef.current?.querySelector<HTMLElement>('[data-menu-item="1"]');
        first?.focus();
      }, 0);
    } else if (e.key === "Escape") {
      setOpenKey(null);
    }
  };

  return (
    <li
      ref={wrapRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
    >
      {group.to ? (
        <span
          className={`group/nav relative inline-flex items-center whitespace-nowrap transition-colors ${
            active || open ? "text-primary" : "text-foreground/75 hover:text-primary"
          }`}
        >
          <Link
            href={lp(group.to)}
            aria-current={active ? "page" : undefined}
            className="pl-2.5 pr-0.5 py-2 text-[13.5px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-md"
          >
            {group.label}
          </Link>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={`${group.label} alt menü`}
            onClick={() => (open ? setOpenKey(null) : openNow())}
            onKeyDown={onKeyDown}
            className="pr-2 pl-0.5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-md"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
          <span
            aria-hidden
            className={`pointer-events-none absolute left-2.5 right-2 -bottom-[3px] h-[2px] rounded-full bg-brand-orange origin-left transition-transform duration-300 ${
              active ? "scale-x-100" : open ? "scale-x-100 opacity-80" : "scale-x-0 group-hover/nav:scale-x-100 opacity-70"
            }`}
          />
        </span>
      ) : (
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => (open ? setOpenKey(null) : openNow())}
          onKeyDown={onKeyDown}
          className={`group/nav relative inline-flex items-center gap-1 px-2.5 py-2 text-[13.5px] font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-md ${
            active || open ? "text-primary" : "text-foreground/75 hover:text-primary"
          }`}
        >
          {group.label}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
          <span
            aria-hidden
            className={`pointer-events-none absolute left-2.5 right-2.5 -bottom-[3px] h-[2px] rounded-full bg-brand-orange origin-left transition-transform duration-300 ${
              active ? "scale-x-100" : open ? "scale-x-100 opacity-80" : "scale-x-0 group-hover/nav:scale-x-100 opacity-70"
            }`}
          />
        </button>
      )}

      <div
        id={menuId}
        role="menu"
        aria-label={group.label}
        onMouseEnter={openNow}
        onMouseLeave={scheduleClose}
        className={`absolute left-1/2 top-full -translate-x-1/2 pt-2 z-50 ${open ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1"} transition duration-150`}
      >
        <div
          className="rounded-2xl border border-border/70 bg-card shadow-elevated overflow-hidden"
          style={{ width: `min(92vw, ${Math.max(300, group.columns.length * 260)}px)` }}
        >
          <div
            className="p-4 grid gap-4"
            style={{ gridTemplateColumns: `repeat(${group.columns.length}, minmax(0, 1fr))` }}
          >
            {group.columns.map((col) => (
              <div key={col.title} className="min-w-0">
                <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-orange">
                  {col.title}
                </p>
                {col.items && (
                  <ul className="flex flex-col">
                    {col.items.map((it, idx) => (
                      <li key={it.label} role="none">
                        <DropdownLink item={it} index={idx + 1} onNavigate={() => setOpenKey(null)} path={path} />
                      </li>
                    ))}
                  </ul>
                )}
                {col.subgroups?.map((sg) => (
                  <div key={sg.label} className="mt-1">
                    {sg.to ? (
                      <Link
                        href={lp(sg.to)}
                        onClick={() => setOpenKey(null)}
                        className="block px-3 py-2 text-[13.5px] font-bold text-primary hover:text-brand-orange transition"
                      >
                        {sg.label}
                      </Link>
                    ) : (
                      <p className="px-3 py-2 text-[13.5px] font-bold text-primary">{sg.label}</p>
                    )}
                    <ul className="flex flex-col border-l border-border/60 ml-3 pl-1">
                      {sg.items.map((it, idx) => (
                        <li key={it.label} role="none">
                          <DropdownLink item={it} index={idx + 1} onNavigate={() => setOpenKey(null)} path={path} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

function DropdownLink({
  item, index, onNavigate, path,
}: { item: NavLeaf; index: number; onNavigate: () => void; path: string }) {
  const lp = useLocalizedPath();
  const isCurrent = !!item.to && (path === item.to || path.startsWith(item.to + "/"));
  const common =
    `group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
      isCurrent
        ? "text-primary bg-primary-soft/70 font-semibold"
        : "text-foreground/85 hover:text-primary hover:bg-primary-soft/60"
    }`;
  if (item.to) {
    return (
      <Link
        href={lp(item.to)}
        role="menuitem"
        data-menu-item={index}
        aria-current={isCurrent ? "page" : undefined}
        onClick={onNavigate}
        className={common}
      >
        <span className="inline-flex items-center gap-2">
          {isCurrent && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-orange" />}
          {item.label}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary group-hover:translate-x-0.5 transition" aria-hidden />
      </Link>
    );
  }
  return (
    <a
      href={item.href}
      role="menuitem"
      data-menu-item={index}
      onClick={onNavigate}
      className={common}
    >
      <span>{item.label}</span>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary group-hover:translate-x-0.5 transition" aria-hidden />
    </a>
  );
}

/* Suppress unused-import warnings for icons kept for future use in dropdown items. */
void [Building2, Users, Sparkles, FileText, Compass];
