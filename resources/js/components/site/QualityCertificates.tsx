import { Link } from "@inertiajs/react";
import { ShieldCheck } from "lucide-react";
import { useLocale, useLocalizedPath } from "@/lib/i18n";

// TODO: real asset
const jciImg =
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80";
// TODO: real asset
const healthTurkiyeImg =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80";
// TODO: real asset
const isoImg =
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80";
// TODO: real asset
const turqualityImg =
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80";

type CertItem = {
  key: string;
  title: string;
  note?: string;
  alt: string;
  img?: string;
};

/**
 * Only official document/accreditation content already present in the project is used:
 * - JCI (jci-certified)
 * - Health Türkiye (health-turkiye, footer)
 * - ISO 9001 / ISO 27001 (iso-logo)
 * - TURQUALITY
 */
const ITEMS_TR: CertItem[] = [
  {
    key: "jci",
    title: "JCI Akreditasyon Sertifikası",
    note: "Uluslararası akreditasyon",
    alt: "Joint Commission International akreditasyon amblemi",
    img: jciImg,
  },
  {
    key: "health-turkiye",
    title: "Health Türkiye",
    note: "Sağlık Bakanlığı uluslararası sağlık turizmi markası",
    alt: "Health Türkiye amblemi",
    img: healthTurkiyeImg,
  },
  {
    key: "turquality",
    title: "TURQUALITY",
    note: "Devlet destekli markalaşma programı",
    alt: "TURQUALITY marka destek programı amblemi",
    img: turqualityImg,
  },
  {
    key: "iso9001",
    title: "ISO 9001 Kalite Yönetim Sistemi",
    note: "Kalite yönetim standardı",
    alt: "ISO 9001 Kalite Yönetim Sistemi belgesi",
    img: isoImg,
  },
  {
    key: "iso27001",
    title: "ISO 27001 Bilgi Güvenliği Yönetimi",
    note: "Bilgi güvenliği standardı",
    alt: "ISO 27001 Bilgi Güvenliği Yönetimi belgesi",
    img: isoImg,
  },
];

const ITEMS_EN: CertItem[] = [
  {
    key: "jci",
    title: "JCI Accreditation Certificate",
    note: "International accreditation",
    alt: "Joint Commission International accreditation emblem",
    img: jciImg,
  },
  {
    key: "health-turkiye",
    title: "Health Türkiye",
    note: "Ministry of Health international healthcare brand",
    alt: "Health Türkiye emblem",
    img: healthTurkiyeImg,
  },
  {
    key: "turquality",
    title: "TURQUALITY",
    note: "State-backed international branding programme",
    alt: "TURQUALITY branding support programme emblem",
    img: turqualityImg,
  },
  {
    key: "iso9001",
    title: "ISO 9001 Quality Management System",
    note: "Quality management standard",
    alt: "ISO 9001 Quality Management System certificate",
    img: isoImg,
  },
  {
    key: "iso27001",
    title: "ISO 27001 Information Security Management",
    note: "Information security standard",
    alt: "ISO 27001 Information Security Management certificate",
    img: isoImg,
  },
];

export function QualityCertificates({ lang }: { lang?: "tr" | "en" }) {
  const locale = useLocale();
  const active = lang ?? locale;
  const lp = useLocalizedPath();
  const en = active === "en";
  const items = en ? ITEMS_EN : ITEMS_TR;
  const heading = en ? "Certificates & accreditations" : "Belgelerimiz ve akreditasyonlarımız";

  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {heading}
      </h3>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((it) => {
          const inner = (
            <>
              <span className="shrink-0 grid place-items-center h-12 w-12 rounded-xl bg-primary-soft/50 overflow-hidden">
                {it.img ? (
                  /* TODO: real asset */
                  <img
                    src={it.img}
                    alt={it.alt}
                    loading="lazy"
                    decoding="async"
                    className="max-h-9 max-w-[40px] w-auto h-auto object-contain"
                  />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-primary leading-snug">{it.title}</span>
                {it.note && (
                  <span className="mt-0.5 block text-[11px] text-muted-foreground leading-snug">{it.note}</span>
                )}
              </span>
            </>
          );

          return (
            <li key={it.key} className="min-w-0">
              {en ? (
                <div className="flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3">
                  {inner}
                </div>
              ) : (
                <Link
                  href={lp("/kalite-calismalari")}
                  className="flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 hover:border-primary/30 hover:bg-primary-soft/20 transition"
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
