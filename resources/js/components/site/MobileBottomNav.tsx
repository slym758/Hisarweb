import { Link, usePage } from "@inertiajs/react";
import {
  ClipboardList, CalendarDays, Stethoscope, ShieldCheck, MessageSquareText, ClipboardPen,
} from "lucide-react";
import type { ComponentType } from "react";
import { openDetailLead, useDetailLead } from "@/lib/detail-lead-store";
import { useCurrentPath, useLocale, useLocalizedPath } from "@/lib/i18n";
import { isExternal, useSettings, waHref } from "@/lib/settings";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const COPY = {
  tr: {
    left: "E-Sonuç",
    center: "Randevu",
    centerAria: "Randevu al",
    whatsapp: "İletişim",
    whatsappHref: "",
  },
  en: {
    left: "Our Doctors",
    center: "Free Second Opinion",
    centerAria: "Request a free second opinion",
    whatsapp: "WhatsApp",
    whatsappHref:
      "https://wa.me/904445888?text=Hello%2C%20I%20would%20like%20information%20for%20international%20patients.",
  },
} as const;

type BottomMenuItem = { label: string; to?: string; href?: string; icon?: string };

export function MobileBottomNav({ lang }: { lang?: "tr" | "en" }) {
  const path = useCurrentPath();
  const locale = useLocale();
  const lp = useLocalizedPath();
  const settings = useSettings();
  const detail = useDetailLead();
  const isActive = (to: string) => path.startsWith(to);
  const currentLang = lang ?? locale;
  const t = COPY[currentLang];
  const isEn = currentLang === "en";
  // Admin-managed side items (TR); the center CTA and EN layout stay fixed. Falls back to
  // the hardcoded links when no menu is set.
  const bottomNav = (usePage().props as { menus?: { bottom_nav?: BottomMenuItem[] } }).menus?.bottom_nav;
  const leftItem = Array.isArray(bottomNav) && bottomNav.length > 0 ? bottomNav[0] : undefined;
  const rightItem = Array.isArray(bottomNav) && bottomNav.length >= 2 ? bottomNav[bottomNav.length - 1] : undefined;
  const leftTo = leftItem?.to ?? "/online-hizmetler";
  const rightTo = rightItem?.to ?? "/iletisim";

  // Doktor profil sayfası kendi sabit alt CTA çubuğunu kullanır
  if (path.startsWith("/doktor/")) return null;

  return (
    <nav aria-label="Mobile quick navigation" className="xl:hidden fixed bottom-0 inset-x-0 z-30 h-[var(--bottom-nav-h)] bg-background border-t border-border/70">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-cyan/60 to-transparent" />
      <div className="relative mx-auto grid h-full max-w-xs grid-cols-[1fr_auto_1fr] items-center px-4">
        {isEn ? (
          <NavItem
            to="/doktorlarimiz"
            label={t.left}
            icon={Stethoscope}
            active={isActive("/doktorlarimiz")}
          />
        ) : (
          <NavItem
            to={leftTo}
            label={leftItem?.label ?? t.left}
            icon={ClipboardList}
            active={isActive(leftTo)}
          />
        )}

        {/* Center: primary action (TR: appointment — EN: free second opinion) */}
        <div className="relative flex flex-col items-center justify-center">
          {!isEn && isExternal(settings.appointment_url) ? (
            <a
              href={settings.appointment_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.centerAria}
              className="absolute -top-7 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-card border border-border shadow-elevated"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-orange text-brand-orange-foreground">
                <CalendarDays className="h-5 w-5" />
              </span>
            </a>
          ) : (
            <Link
              href={isEn ? "/en#second-opinion" : lp(settings.appointment_url)}
              aria-label={t.centerAria}
              className="absolute -top-7 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-card border border-border shadow-elevated"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-orange text-brand-orange-foreground">
                {isEn ? <ShieldCheck className="h-5 w-5" /> : <CalendarDays className="h-5 w-5" />}
              </span>
            </Link>
          )}
          <span
            lang={currentLang}
            className={
              "mt-9 max-w-[92px] text-center text-[9px] sm:text-[10px] font-bold leading-[1.15] text-primary tracking-wider " +
              (isEn ? "" : "uppercase")
            }
          >
            {t.center}
          </span>
        </div>

        {detail.active ? (
          <NavItem
            onClick={openDetailLead}
            label={isEn ? "Get Info" : "Detaylı Bilgi Al"}
            icon={ClipboardPen}
            active={false}
            shimmer
          />
        ) : isEn ? (
          <NavItem
            href={waHref(settings.whatsapp_number, settings.whatsapp_message)}
            label={t.whatsapp}
            icon={WhatsAppIcon}
            active={false}
            whatsapp
          />
        ) : (
          <NavItem
            to={rightTo}
            label={rightItem?.label ?? t.whatsapp}
            icon={MessageSquareText}
            active={isActive(rightTo)}
          />
        )}

      </div>
    </nav>
  );
}

function NavItem({
  to, href, onClick, label, icon: Icon, active, shimmer, whatsapp,
}: {
  to?: string;
  href?: string;
  onClick?: () => void;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active: boolean;
  shimmer?: boolean;
  whatsapp?: boolean;
}) {
  const lp = useLocalizedPath();
  const cls = `flex flex-col items-center gap-0.5 whitespace-nowrap text-[9px] sm:text-[10px] font-semibold transition-transform active:scale-95 ${
    active ? "text-primary" : "text-primary/70"
  }`;
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${cls} ${shimmer ? "cta-attention px-2 py-1 text-primary" : ""}`}
      >
        <span className={shimmer ? "cta-attention-halo" : undefined}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="cta-label">{label}</span>
      </button>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        <span className={whatsapp ? "whatsapp-rotate" : undefined}>
          <Icon className={`relative z-10 h-5 w-5 ${whatsapp ? "text-[#25D366]" : ""}`} />
        </span>
        {label}
      </a>
    );
  }
  if (!to) return null;

  return (
    <Link href={lp(to)} className={cls} aria-current={active ? "page" : undefined}>
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
}
