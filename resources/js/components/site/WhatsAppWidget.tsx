import { Clock, MapPin, X } from "lucide-react";
import { useState } from "react";
import { useSettings, waHref } from "@/lib/settings";

function WaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.53.07-.8.38-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.12 3.24 5.13 4.54.72.31 1.28.5 1.71.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 01-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 01-1.44-5A9.44 9.44 0 0112.06 2.6a9.4 9.4 0 016.67 2.77 9.4 9.4 0 012.76 6.67c0 5.2-4.24 9.44-9.44 9.44zM20.5 3.49A11.36 11.36 0 0012.05.19C5.8.19.72 5.27.72 11.52c0 2 .52 3.95 1.5 5.67L.63 23.19l6.15-1.61a11.32 11.32 0 005.27 1.34h.01c6.25 0 11.33-5.08 11.33-11.33a11.26 11.26 0 00-3.32-8.02z" />
    </svg>
  );
}

export function WhatsAppWidget() {
  const settings = useSettings();
  const [open, setOpen] = useState(false);

  const number = (settings.whatsapp_number || "").replace(/\D/g, "");
  const enabled = settings.whatsapp_enabled !== "0";
  if (!enabled || !number) return null;

  const href = waHref(settings.whatsapp_number, settings.whatsapp_message);

  return (
    // Desktop only — mobile already surfaces WhatsApp in the bottom nav.
    <div className="hidden lg:block fixed bottom-6 right-6 z-40">
      {open && (
        <div className="mb-3 w-72 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
              <WaIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight">Hisar Hospital</p>
              <p className="text-[11px] text-white/80">WhatsApp</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              className="ml-auto grid h-7 w-7 place-items-center rounded-full hover:bg-white/15"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 p-4">
            {settings.whatsapp_greeting && (
              <p className="rounded-xl rounded-tl-sm bg-primary-soft/60 px-3 py-2 text-[13px] text-foreground/90">
                {settings.whatsapp_greeting}
              </p>
            )}
            {settings.whatsapp_hours && (
              <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0 text-brand-cyan" /> {settings.whatsapp_hours}
              </p>
            )}
            {settings.whatsapp_location && (
              <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-cyan" /> {settings.whatsapp_location}
              </p>
            )}
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95"
            >
              <WaIcon className="h-4 w-4" /> Sohbeti başlat
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
      >
        <WaIcon className="h-7 w-7" />
      </button>
    </div>
  );
}
