"use client";
import { createI18nClient } from "next-international/client";

export const {
  useChangeLocale,
  useCurrentLocale,
  useI18n,
  useScopedI18n,
  I18nProviderClient,
} = createI18nClient({
  en: () => import("./en"),
  de: () => import("./de"),
  ro: () => import("./ro"),
  vi: () => import("./vi"),
  id: () => import("./id"),
  ko: () => import("./ko"),
});
