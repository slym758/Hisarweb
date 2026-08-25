import { useSyncExternalStore } from "react";

export type DetailPageType =
  | "department"
  | "disease"
  | "treatment"
  | "technology"
  | "doctor"
  | "article"
  | "generic";

export type DetailLeadState = {
  active: boolean;
  open: boolean;
  pageTitle: string;
  pageType: DetailPageType;
  lang: "tr" | "en";
};

const initial: DetailLeadState = {
  active: false,
  open: false,
  pageTitle: "",
  pageType: "generic",
  lang: "tr",
};

let state: DetailLeadState = initial;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function set(patch: Partial<DetailLeadState>) {
  state = { ...state, ...patch };
  emit();
}

export function registerDetailLead(info: {
  pageTitle: string;
  pageType: DetailPageType;
  lang: "tr" | "en";
}) {
  set({ active: true, ...info });
  return () => {
    set({ active: false, open: false });
  };
}

let lastTrigger: HTMLElement | null = null;

export function openDetailLead() {
  if (typeof document !== "undefined") {
    lastTrigger = document.activeElement as HTMLElement | null;
  }
  set({ open: true });
}

export function closeDetailLead() {
  set({ open: false });
  if (lastTrigger?.isConnected) lastTrigger.focus();
  lastTrigger = null;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const serverSnapshot = () => initial;

export function useDetailLead() {
  return useSyncExternalStore(subscribe, () => state, serverSnapshot);
}
