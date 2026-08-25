import type { ComponentProps, JSX, ReactNode } from "react";
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";

/**
 * Single source of truth for the orange appointment CTA (with the subtle
 * `cta-orbit` shine). Never copy these classes into pages — use this component.
 */
export const appointmentCtaClass =
  "cta-orbit inline-flex items-center justify-center gap-2 rounded-full bg-gradient-orange px-5 py-2.5 text-sm font-bold text-brand-orange-foreground shadow-orange hover:-translate-y-0.5 transition";

type BaseProps = {
  className?: string;
  children: ReactNode;
};

/** Router-linked appointment CTA. */
export function AppointmentCTA({
  className,
  children,
  ...rest
}: BaseProps & Record<string, unknown>) {
  const LinkAny = Link as unknown as (props: Record<string, unknown>) => JSX.Element;
  return (
    <LinkAny {...rest} className={cn(appointmentCtaClass, className)}>
      {children}
    </LinkAny>
  );
}

/** Same visual language for button-driven appointment actions. */
export function AppointmentCTAButton({
  className,
  children,
  type = "button",
  ...rest
}: BaseProps & ComponentProps<"button">) {
  return (
    <button {...rest} type={type} className={cn(appointmentCtaClass, className)}>
      {children}
    </button>
  );
}
