import { Link, usePage } from '@inertiajs/react';
import {
  Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube,
  ArrowRight, Navigation, Smartphone,
} from "lucide-react";
import { useLocalizedPath, useTranslations } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";

/** A resolved footer link column shared from the backend (`menus.footer`). */
type FooterMenuLink = { label: string; to?: string; href?: string; badge?: string };
type FooterMenuCol = { title: string; links: FooterMenuLink[] };

export function SiteFooter() {
  const lp = useLocalizedPath();
  const { t } = useTranslations();
  const settings = useSettings();
  // Admin-managed footer link columns; fall back to the hardcoded columns when empty.
  const menuFooter = (usePage().props as { menus?: { footer?: FooterMenuCol[] } }).menus?.footer;
  const dbFooter = Array.isArray(menuFooter) && menuFooter.length > 0 ? menuFooter : null;
  const socials = [
    { Icon: Facebook, href: settings.facebook_url },
    { Icon: Instagram, href: settings.instagram_url },
    { Icon: Linkedin, href: settings.linkedin_url },
    { Icon: Youtube, href: settings.youtube_url },
  ];
  return (
    <>
      <footer className="bg-primary text-primary-foreground">
        <div className="container-x py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 text-center sm:text-left">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1 flex flex-col items-center sm:items-start">
            <Link href={lp("/")} aria-label="Hisar Hospital" className="inline-block">
              <img src="/assets/hisar-emblem.png" alt="Hisar Hospital" className="h-14 w-auto brightness-0 invert" loading="lazy" />
            </Link>
            <p className="text-sm text-primary-foreground/75 max-w-xs leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-2 pt-2 justify-center sm:justify-start">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href || "#"}
                  aria-label={t('footer.social')}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              <Link
                href={lp("/mobil-uygulama")}
                aria-label="Hisar Mobil Uygulama"
                title="Hisar Mobil Uygulama"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <Smartphone className="h-4 w-4" />
              </Link>
            </div>
            <Link
              href={lp("/mobil-uygulama")}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 transition px-3.5 py-2 text-xs font-semibold"
            >
              <Smartphone className="h-4 w-4 text-brand-cyan" />
              {t('footer.download_app')}
            </Link>

          </div>

          {dbFooter ? (
            dbFooter.map((col) => (
              <FooterCol key={col.title} title={col.title}>
                {col.links.map((link, i) =>
                  link.href ? (
                    <FooterLink key={`${link.label}-${i}`} to={link.href} external>{link.label}</FooterLink>
                  ) : (
                    <FooterLink key={`${link.label}-${i}`} to={link.to ?? "#"}>{link.label}</FooterLink>
                  ),
                )}
              </FooterCol>
            ))
          ) : (
            <>
              <FooterCol title={t('footer.col_corporate')}>
                <FooterLink to="/kurumsal">{t('footer.links.about_us')}</FooterLink>
                <FooterLink to="/kurumsal">{t('footer.links.quality_docs')}</FooterLink>
                <FooterLink to="/kurumsal">{t('footer.links.jci')}</FooterLink>
                <FooterLink to="/saglikli-hayat-rehberi">{t('footer.links.patient_rights')}</FooterLink>
                <FooterLink to="/kurumsal">{t('footer.links.career')}</FooterLink>
                <FooterLink to="/anlasmali-kurumlar">{t('footer.links.contracted')}</FooterLink>
              </FooterCol>

              <FooterCol title={t('footer.col_health_services')}>
                <FooterLink to="/doktorlarimiz">{t('footer.links.doctors')}</FooterLink>
                <FooterLink to="/bolumlerimiz">{t('footer.links.departments')}</FooterLink>
                <FooterLink to="/tedavi-yontemleri">{t('footer.links.treatments')}</FooterLink>
                <FooterLink to="/saglikli-hayat-rehberi">{t('footer.links.healthy_life')}</FooterLink>
                <FooterLink to="/bolumlerimiz">{t('footer.links.oncology_center')}</FooterLink>
                <FooterLink to="/iletisim">{t('footer.links.intl_patients')}</FooterLink>
              </FooterCol>

              <FooterCol title={t('footer.col_online')}>
                <FooterLink to="/randevu-al">{t('footer.links.appointment')}</FooterLink>
                <FooterLink to="/doktorlarimiz">{t('footer.links.find_doctor')}</FooterLink>
                <FooterLink to="https://online.hisarhospital.com/#/" external>{t('footer.links.eresults')}</FooterLink>
                <FooterLink to="https://online.hisarhospital.com/#/" external>{t('footer.links.hisar_online')}</FooterLink>
                <FooterLink to="/anlasmali-kurumlar">{t('footer.links.query_contracted')}</FooterLink>
              </FooterCol>
            </>
          )}

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-cyan mb-4">{t('footer.col_contact')}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/85">
              <li className="flex gap-3 justify-center sm:justify-start">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-brand-cyan" />
                <a href={settings.phone_href} className="hover:text-white">{settings.phone_display}</a>
              </li>
              <li className="flex gap-3 justify-center sm:justify-start">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-brand-cyan" />
                <a href="mailto:info@hisarhospital.com" className="hover:text-white">info@hisarhospital.com</a>
              </li>
              <li className="flex gap-3 justify-center sm:justify-start">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand-cyan" />
                <span>Yanyanevler Mah. Site Yolu Cd. No:7<br />Ümraniye / İstanbul</span>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Hisar+Hospital+Intercontinental"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3.5 py-1.5 text-xs font-semibold transition"
                >
                  <Navigation className="h-3.5 w-3.5" /> {t('footer.directions')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-x py-6 flex flex-col lg:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="rounded-lg bg-white/95 px-3 py-2">
                {/* TODO: real asset */}
                <img src="/assets/hisar-emblem.png" alt="HealthTürkiye" className="h-8 w-auto object-contain" />
              </div>
              <div className="flex items-center">
                {/* TODO: real asset */}
                <img src="/assets/hisar-emblem.png" alt="JCI Akredite" className="h-12 w-auto object-contain" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-xs text-primary-foreground/60">
              <span>© {new Date().getFullYear()} {t('footer.copyright')}</span>
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                <Link href={lp("/kvkk-politikamiz")} className="hover:text-white">{t('footer.legal.kvkk')}</Link>
                <Link href={lp("/cerez-politikasi")} className="hover:text-white">{t('footer.legal.cookie')}</Link>
                <Link href={lp("/mesafeli-satis-sozlesmesi")} className="hover:text-white">{t('footer.legal.distance_sales')}</Link>
                <Link href={lp("/web-ve-tibbi-yayin-kurulu")} className="hover:text-white">{t('footer.legal.publication_board')}</Link>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-wider text-brand-cyan mb-4">{title}</h4>
      <ul className="space-y-2.5 text-sm text-primary-foreground/85">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children, external }: { to: string; children: React.ReactNode; external?: boolean }) {
  const lp = useLocalizedPath();
  const inner = (
    <>
      {children}
      <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
    </>
  );
  return (
    <li>
      {external ? (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition inline-flex items-center gap-1.5 group whitespace-nowrap"
        >
          {inner}
        </a>
      ) : (
        <Link href={lp(to)} className="hover:text-white transition inline-flex items-center gap-1.5 group whitespace-nowrap">
          {inner}
        </Link>
      )}
    </li>
  );
}
