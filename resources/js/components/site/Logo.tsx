import { Link } from "@inertiajs/react";
import { useLocalizedPath } from "@/lib/i18n";

export function Logo({ compact = false }: { compact?: boolean }) {
  const lp = useLocalizedPath();
  return (
    <Link href={lp("/")} className="flex items-center" aria-label="Hisar Hospital">
      <img
        src="/assets/hisar-emblem.png"
        alt="Hisar Hospital"
        className={compact ? "h-8 w-auto" : "h-10 lg:h-11 w-auto"}
        loading="eager"
      />
    </Link>
  );
}
