import { Link, router } from "@inertiajs/react";
import {
  Search, X, ChevronRight, ChevronDown, Stethoscope, UserRound, Activity, ArrowRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { useLocalizedPath } from "@/lib/i18n";

/* ─────────────────────────  SHARED NAV MODEL  ───────────────────────── */

export type NavLeaf = { label: string; to?: string; href?: string; note?: string };
export type NavSubgroup = { label: string; to?: string; items: NavLeaf[] };
export type NavColumn = { title: string; items?: NavLeaf[]; subgroups?: NavSubgroup[] };
export type NavGroup = {
  key: string;
  label: string;
  to?: string;
  href?: string;
  matches: string[];
  mega: true;
  columns: NavColumn[];
};
export type NavDirect = {
  key: string;
  label: string;
  to?: string;
  href?: string;
  matches: string[];
  direct: true;
};
export type NavItem = NavGroup | NavDirect;

/* ─────────────────────────  SHARED COPY  ───────────────────────── */

export type HeaderCopy = {
  openMenu: string;
  closeMenu: string;
  close: string;
  search: string;
  siteMenu: string;
  mobileMenu: string;
  submenuSuffix: (label: string) => string;
  searchDialog: string;
  searchPlaceholder: string;
  quickAccess: string;
  quickItems: { label: string; to?: string }[];
  searchTip: string;
  groupSymptom: string;
  groupSymptomSuffix: string;
  groupDepartments: string;
  groupDoctors: string;
  groupTreatments: string;
  noResults: string;
  noResultsCta: string;
  noResultsAfter: string;
  cta: { label: string; to?: string; href?: string };
  phone: { label: string; href: string };
  langLabel?: string;
};

export const TR_COPY: HeaderCopy = {
  openMenu: "Menüyü aç",
  closeMenu: "Menüyü kapat",
  close: "Kapat",
  search: "Ara",
  siteMenu: "Site menüsü",
  mobileMenu: "Mobil menü",
  submenuSuffix: (l) => `${l} alt menü`,
  searchDialog: "Site arama",
  searchPlaceholder: "Doktor, bölüm, hastalık veya tedavi ara…",
  quickAccess: "Hızlı erişim",
  quickItems: [
    { label: "Doktor Ara", to: "/doktorlarimiz" },
    { label: "Bölüm Seç", to: "/bolumlerimiz" },
    { label: "Tedavi Yöntemleri", to: "/tedavi-yontemleri" },
    { label: "Online Hizmetler", to: "/online-hizmetler" },
  ],
  searchTip:
    'İpucu: "baş ağrısı", "çarpıntı", "safra kesesi", "katarakt" gibi belirti veya hastalık adıyla da arayabilirsiniz.',
  groupSymptom: "Belirti / hastalık → bölüm",
  groupSymptomSuffix: " — ilgili bölüm",
  groupDepartments: "Bölümler",
  groupDoctors: "Doktorlar",
  groupTreatments: "Tedavi yöntemleri",
  noResults: "Sonuç bulunamadı.",
  noResultsCta: "İletişime geçin",
  noResultsAfter: ", doğru bölüme yönlendirelim.",
  cta: { label: "Randevu Al", to: "/randevu-al" },
  phone: { label: "444 5 888", href: "tel:4445888" },
  langLabel: "Dil:",
};

export const EN_COPY: HeaderCopy = {
  openMenu: "Open menu",
  closeMenu: "Close menu",
  close: "Close",
  search: "Search",
  siteMenu: "Site menu",
  mobileMenu: "Mobile menu",
  submenuSuffix: (l) => `${l} submenu`,
  searchDialog: "Site search",
  searchPlaceholder: "Search doctors, departments, diseases or treatments…",
  quickAccess: "Quick access",
  quickItems: [
    { label: "Find a Doctor", to: "/doktorlarimiz" },
    { label: "Choose a Department", to: "/bolumlerimiz" },
    { label: "Treatment Methods", to: "/tedavi-yontemleri" },
    { label: "Online Services", to: "/online-hizmetler" },
  ],
  searchTip:
    'Tip: you can also search by symptom or condition, such as "headache", "palpitations", "gallbladder" or "cataract".',
  groupSymptom: "Symptom / condition → department",
  groupSymptomSuffix: " — related department",
  groupDepartments: "Departments",
  groupDoctors: "Doctors",
  groupTreatments: "Treatment methods",
  noResults: "No results found.",
  noResultsCta: "Contact us",
  noResultsAfter: " and we will guide you to the right department.",
  cta: { label: "Get a Free Second Opinion", href: "#second-opinion" },
  phone: { label: "+90 212 444 0 888", href: "tel:+902124440888" },
};

/* ─────────────────────────  SEARCH OVERLAY  ───────────────────────── */

const QUICK_ICONS = [UserRound, Stethoscope, Activity, ArrowRight];

/** Shape of the DB-backed `/api/search` response (see App\Http\Controllers\SearchController). */
type SearchItem = { label: string; to: string; meta?: string | null };
type SearchGroup = { type: string; label: string; items: SearchItem[] };
type SearchResponse = { query: string; empty: boolean; emptyMessage: string; groups: SearchGroup[] };

export function SearchOverlay({
  copy, lang, onClose,
}: { copy: HeaderCopy; lang: "tr" | "en"; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const lp = useLocalizedPath();

  // Debounced (250ms) DB-backed search. The endpoint is locale-agnostic; the active
  // locale rides as a query param and the returned `to` paths are localized here via lp().
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&locale=${encodeURIComponent(lang)}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      })
        .then((res) => (res.ok ? (res.json() as Promise<SearchResponse>) : Promise.reject(new Error(String(res.status)))))
        .then((data) => setResults(data))
        .catch((err) => {
          if (err?.name === "AbortError") return;
          // Graceful failure: show the no-results state instead of crashing.
          setResults({ query: q, empty: true, emptyMessage: copy.noResults, groups: [] });
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, lang, copy.noResults]);

  const closeSearch = () => { setQuery(""); setResults(null); onClose(); };

  /** Locale-agnostic `to` from the API, localized here (EN → /en/…) so every locale lands
   *  on its real page. */
  const go = (to?: string) => {
    closeSearch();
    if (!to) return;
    router.visit(lp(to));
  };

  const showQuick = query.trim().length < 2;

  return (
    <div className="fixed inset-0 z-50 bg-primary/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4" role="dialog" aria-modal="true" aria-label={copy.searchDialog}>
      <div className="w-full max-w-2xl rounded-2xl bg-card shadow-elevated overflow-hidden">
        <div className="flex items-center gap-2 px-4 border-b border-border/60">
          <Search className="h-5 w-5 text-muted-foreground" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.searchPlaceholder}
            className="flex-1 bg-transparent py-4 text-base outline-none placeholder:text-muted-foreground"
            aria-label={copy.search}
          />
          <button
            onClick={closeSearch}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            aria-label={copy.close}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {showQuick && (
            <div className="p-2">
              <p className="px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{copy.quickAccess}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {copy.quickItems.map((q, i) => {
                  const Icon = QUICK_ICONS[i] ?? ArrowRight;
                  return (
                    <button
                      key={q.label}
                      onClick={() => go(q.to)}
                      className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary-soft/60 transition"
                    >
                      <Icon className="h-4 w-4 text-brand-orange" aria-hidden />
                      {q.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 px-2 text-[11px] text-muted-foreground">{copy.searchTip}</p>
            </div>
          )}

          {!showQuick && (
            <div className="space-y-4 p-1">
              {loading && !results && (
                <p className="p-6 text-center text-sm text-muted-foreground" aria-live="polite">…</p>
              )}

              {results?.groups.map((group) => (
                <ResultGroup key={group.type} title={group.label}>
                  {group.items.map((item, i) => (
                    <button
                      key={`${item.to}-${i}`}
                      onClick={() => go(item.to)}
                      className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-primary-soft/60 transition text-left"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-primary truncate">{item.label}</span>
                        {item.meta && <span className="block text-xs text-muted-foreground line-clamp-1">{item.meta}</span>}
                      </span>
                      <ArrowRight className="h-4 w-4 text-brand-orange shrink-0" aria-hidden />
                    </button>
                  ))}
                </ResultGroup>
              ))}

              {results && results.groups.length === 0 && !loading && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  {results.emptyMessage}{" "}
                  <button onClick={() => go("/iletisim")} className="text-brand-orange font-semibold hover:underline">
                    {copy.noResultsCta}
                  </button>
                  {copy.noResultsAfter}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

/* ─────────────────────────  MOBILE DRAWER  ───────────────────────── */

export function MobileDrawer({
  nav, copy, onClose, lang, setLang,
}: {
  nav: NavItem[];
  copy: HeaderCopy;
  onClose: () => void;
  lang?: "TR" | "EN";
  setLang?: (l: "TR" | "EN") => void;
}) {
  const lp = useLocalizedPath();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-[300]" role="dialog" aria-modal="true" aria-label={copy.siteMenu}>
      <button
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
        aria-label={copy.closeMenu}
        onClick={onClose}
      />
      <aside id="mobile-menu" className="absolute right-0 top-0 h-full w-[88%] max-w-[380px] bg-background shadow-elevated flex flex-col">
        <div className="flex items-center justify-between border-b px-5 h-[var(--header-h)]">
          <Logo />
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-primary hover:bg-primary-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            aria-label={copy.close}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav aria-label={copy.mobileMenu} className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col">
            {nav.map((item) => {
              if ("direct" in item) {
                const cls = "flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-semibold text-primary hover:bg-primary-soft/60 transition";
                return (
                  <li key={item.key}>
                    {item.to ? (
                      <Link href={lp(item.to)} onClick={onClose} className={cls}>
                        {item.label}
                        <ChevronRight className="h-4 w-4 text-primary/50" aria-hidden />
                      </Link>
                    ) : (
                      <a href={item.href ?? "#"} onClick={onClose} className={cls}>
                        {item.label}
                        <ChevronRight className="h-4 w-4 text-primary/50" aria-hidden />
                      </a>
                    )}
                  </li>
                );
              }
              const open = openKey === item.key;
              const panelId = `m-panel-${item.key}`;
              return (
                <li key={item.key} className="border-b border-border/40 last:border-0">
                  {item.to ? (
                    <div className="flex items-stretch">
                      <Link
                        href={lp(item.to)}
                        onClick={onClose}
                        className="flex-1 flex items-center rounded-l-xl px-4 py-3.5 text-[15px] font-semibold text-primary hover:bg-primary-soft/60 transition"
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        aria-label={copy.submenuSuffix(item.label)}
                        onClick={() => setOpenKey(open ? null : item.key)}
                        className="px-4 rounded-r-xl text-primary hover:bg-primary-soft/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                      >
                        <ChevronDown
                          className={`h-4 w-4 text-primary/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenKey(open ? null : item.key)}
                      className="w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-semibold text-primary hover:bg-primary-soft/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 text-primary/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>
                  )}
                  <div
                    id={panelId}
                    role="region"
                    aria-label={item.label}
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="pl-2 pb-2 space-y-3">
                        {item.columns.map((col) => (
                          <div key={col.title}>
                            <p className="px-4 pt-2 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-orange">
                              {col.title}
                            </p>
                            {col.items && (
                              <ul>
                                {col.items.map((leaf) => (
                                  <MobileLeafItem key={leaf.label} leaf={leaf} onClose={onClose} />
                                ))}
                              </ul>
                            )}
                            {col.subgroups?.map((sg) => (
                              <MobileSubgroup key={sg.label} sg={sg} onClose={onClose} />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 space-y-2 px-2">
            {copy.cta.to ? (
              <Link
                href={lp(copy.cta.to)}
                onClick={onClose}
                className="cta-orbit flex items-center justify-center rounded-full bg-gradient-orange py-3 text-sm font-semibold text-brand-orange-foreground shadow-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
              >
                {copy.cta.label}
              </Link>
            ) : (
              <a
                href={copy.cta.href ?? "#"}
                onClick={onClose}
                className="cta-orbit flex items-center justify-center rounded-full bg-gradient-orange py-3 text-sm font-semibold text-brand-orange-foreground shadow-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
              >
                {copy.cta.label}
              </a>
            )}
            <a
              href={copy.phone.href}
              className="flex items-center justify-center rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
            >
              {copy.phone.label}
            </a>
          </div>
        </nav>

        <div className="border-t px-5 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Hisar Hospital
        </div>
      </aside>
    </div>
  );
}

function MobileLeafItem({ leaf, onClose }: { leaf: NavLeaf; onClose: () => void }) {
  const lp = useLocalizedPath();
  const cls = "flex items-center justify-between rounded-lg px-4 py-3 text-[14px] font-medium text-foreground/80 hover:bg-primary-soft/60 hover:text-primary transition min-h-11";
  if (leaf.to) {
    return (
      <li>
        <Link href={lp(leaf.to)} onClick={onClose} className={cls}>
          <span className="inline-flex items-center gap-2">
            {leaf.label}
            {leaf.note && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{leaf.note}</span>}
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden />
        </Link>
      </li>
    );
  }
  return (
    <li>
      <a href={leaf.href} onClick={onClose} className={cls}>
        <span className="inline-flex items-center gap-2">
          {leaf.label}
          {leaf.note && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{leaf.note}</span>}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden />
      </a>
    </li>
  );
}

function MobileSubgroup({ sg, onClose }: { sg: NavSubgroup; onClose: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between rounded-lg px-4 py-3 text-[14px] font-bold text-primary hover:bg-primary-soft/60 transition"
      >
        {sg.label}
        <ChevronDown className={`h-4 w-4 text-primary/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <ul className="border-l border-border/60 ml-5 pl-1">
            {sg.items.map((leaf) => (
              <MobileLeafItem key={leaf.label} leaf={leaf} onClose={onClose} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────  MOBILE BAR (hamburger • logo • search)  ───────────────────────── */

/** Height of the desktop utility bar (h-9). Sticky nav engages after it scrolls away. */
export const UTILITY_BAR_H = 36;
/** Desktop main-nav height in sticky state (default is --header-h = 84px). */
export const DESKTOP_STICKY_NAV_H = 75;

export function useHeaderChrome() {
  const [scrolled, setScrolled] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [deskStuck, setDeskStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      const isMobile = window.matchMedia("(max-width: 1279px)").matches;
      setCondensed(isMobile && y > 120);
      setDeskStuck(!isMobile && y > UTILITY_BAR_H);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const isMobile = window.matchMedia("(max-width: 1279px)").matches;
    const fullH = getComputedStyle(root).getPropertyValue("--header-h").trim() || "84px";
    const next = isMobile
      ? (condensed ? "48px" : fullH)
      : (deskStuck ? `${DESKTOP_STICKY_NAV_H}px` : fullH);
    root.style.setProperty("--sticky-h", next);
    return () => { root.style.removeProperty("--sticky-h"); };
  }, [condensed, deskStuck]);

  return { scrolled, condensed, deskStuck };
}
