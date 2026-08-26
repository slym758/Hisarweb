import { usePage } from '@inertiajs/react';

export interface SiteSettings {
  phone_display: string;
  phone_href: string;
  whatsapp_number: string;
  whatsapp_message: string;
  appointment_url: string;
  appointment_label: string;
  instagram_url: string;
  facebook_url: string;
  x_url: string;
  youtube_url: string;
  linkedin_url: string;
  footer_tagline: string;
}

const DEFAULTS: SiteSettings = {
  phone_display: '444 5 888',
  phone_href: 'tel:4445888',
  whatsapp_number: '904445888',
  whatsapp_message: '',
  appointment_url: '/randevu-al',
  appointment_label: 'Randevu Al',
  instagram_url: '',
  facebook_url: '',
  x_url: '',
  youtube_url: '',
  linkedin_url: '',
  footer_tagline: '',
};

export function useSettings(): SiteSettings {
  const s = (usePage().props as { settings?: Partial<SiteSettings> }).settings ?? {};
  return { ...DEFAULTS, ...s };
}

export function waHref(number: string, message: string): string {
  const n = number.replace(/\D/g, '');
  return n ? `https://wa.me/${n}${message ? `?text=${encodeURIComponent(message)}` : ''}` : '';
}
