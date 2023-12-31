"use client";
import { createI18nClient } from "next-international/client";

export const { useI18n, useScopedI18n, I18nProviderClient } = createI18nClient({
  en: () => import("./en"),
  fr: () => import("./fr"),
  de: () => import("./de"),
  ro: () => import("./ro"),
  vn: () => import("./vn"),
  id: () => import("./id"),
  // es: () => import("./es"),
  // it: () => import("./it"),
});
