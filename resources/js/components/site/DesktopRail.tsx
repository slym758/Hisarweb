import { Link } from '@inertiajs/react';
import {
  CalendarDays, ClipboardList, Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocalizedPath } from "@/lib/i18n";

export function DesktopRail() {
  const [visible, setVisible] = useState(false);

  // Rail sadece hero/banner geçildikten sonra görünür; footer'a yaklaşınca gizlenir.
  useEffect(() => {
    const onScroll = () => {
      const footer = document.querySelector("footer");
      const nearFooter = footer
        ? footer.getBoundingClientRect().top <= window.innerHeight - 80
        : false;
      const pastHero = window.scrollY > window.innerHeight * 0.6;
      setVisible(pastHero && !nearFooter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <aside
      className={`hidden xl:flex fixed left-3 top-1/2 -translate-y-1/2 z-30 flex-col items-stretch gap-1.5 rounded-2xl bg-card/85 backdrop-blur-xl border border-border/50 p-2 shadow-[0_8px_30px_rgba(8,18,46,0.12)] transition-all duration-300 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
      }`}
    >

      <RailItem to="/randevu-al" label="Randevu Al" icon={CalendarDays} primary />
      <RailItem to="/online-hizmetler" label="E-Sonuç" icon={ClipboardList} />
      <RailItem to="/iletisim" label="İletişim" icon={Phone} />
    </aside>
  );
}

function RailItem({
  to, label, icon: Icon, primary,
}: {
  to: string;
  label: string;
  icon: typeof Phone;
  primary?: boolean;
}) {
  const lp = useLocalizedPath();
  return (
    <Link
      href={lp(to)}
      title={label}
      aria-label={label}
      className="group relative flex items-center justify-center rounded-xl"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105 ${
          primary
            ? "bg-gradient-orange text-brand-orange-foreground shadow-orange"
            : "bg-primary-soft text-primary group-hover:bg-primary/10"
        }`}
      >
        <Icon className="h-4.5 w-4.5" />
      </span>
      {/* Tooltip */}
      <span
        className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground opacity-0 -translate-x-1 shadow-md transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
        role="tooltip"
      >
        {label}
      </span>
    </Link>
  );
}
