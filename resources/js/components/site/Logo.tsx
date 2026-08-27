import { Link } from "@inertiajs/react";
import { useLocalizedPath } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";

export function Logo({ compact = false }: { compact?: boolean }) {
  const lp = useLocalizedPath();
  const { logo } = useSettings();
  return (
    <Link href={lp("/")} className="flex items-center" aria-label="Hisar Hospital">
      <img
        src={logo || "/assets/hisar-emblem.png"}
        alt="Hisar Hospital"
        className={compact ? "h-8 w-auto" : "h-10 lg:h-11 w-auto"}
        loading="eager"
      />
    </Link>
  );
}
