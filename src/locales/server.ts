import { createI18nServer } from "next-international/server";

export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } =
  createI18nServer({
    en: () => import("./en"),
    de: () => import("./de"),
    ro: () => import("./ro"),
    vi: () => import("./vi"),
    id: () => import("./id"),
    ko: () => import("./ko"),
  });
