import { usePage } from '@inertiajs/react';

export interface SiteSettings {
  logo: string;
  logo_footer: string;
  phone_display: string;
  phone_href: string;
  whatsapp_number: string;
  whatsapp_message: string;
  whatsapp_enabled: string;
  whatsapp_greeting: string;
  whatsapp_hours: string;
  whatsapp_location: string;
  appointment_url: string;
  appointment_label: string;
  email: string;
  address: string;
  map_url: string;
  instagram_url: string;
  facebook_url: string;
  x_url: string;
  youtube_url: string;
  linkedin_url: string;
  footer_tagline: string;
}

const DEFAULTS: SiteSettings = {
  logo: '/assets/hisar-emblem.png',
  logo_footer: '',
  phone_display: '444 5 888',
  phone_href: 'tel:4445888',
  whatsapp_number: '904445888',
  whatsapp_message: '',
  whatsapp_enabled: '1',
  whatsapp_greeting: '',
  whatsapp_hours: '',
  whatsapp_location: '',
  appointment_url: 'https://online.hisarhospital.com',
  appointment_label: 'Randevu Al',
  email: 'info@hisarhospital.com',
  address: 'Yanyanevler Mah. Site Yolu Cd. No:7\nÜmraniye / İstanbul',
  map_url: 'https://www.google.com/maps/dir/?api=1&destination=Hisar+Hospital+Intercontinental',
  instagram_url: '',
  facebook_url: '',
  x_url: '',
  youtube_url: '',
  linkedin_url: '',
  footer_tagline: '',
};

export function useSettings(): SiteSettings {
  const s = (usePage().props as { settings?: Partial<SiteSettings> }).settings ?? {};
  // Ignore empty/nullish values (an unfilled setting saved as '') so they fall back to DEFAULTS.
  const clean = Object.fromEntries(Object.entries(s).filter(([, v]) => v !== '' && v != null));
  return { ...DEFAULTS, ...clean };
}

/** True for absolute http(s) URLs — these must open as real (new-tab) anchors, never Inertia links. */
export function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export function waHref(number: string, message: string): string {
  const n = number.replace(/\D/g, '');
  return n ? `https://wa.me/${n}${message ? `?text=${encodeURIComponent(message)}` : ''}` : '';
}
