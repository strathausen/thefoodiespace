"use client";

import { useChangeLocale, useCurrentLocale } from "locales/client";
import { useState } from "react";
import { FaLanguage, FaX } from "react-icons/fa6";

const locales = ["en", "de", "ko", "id", "vi", "ro"] as const;

export const LanguageSwitcher = () => {
  const [showLanguage, setShowLanguage] = useState(false);
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();

  return (
    <button
      className="relative text-primary-darker"
      onClick={() => setShowLanguage(!showLanguage)}
    >
      <FaLanguage />
      {showLanguage && (
        <div className="absolute bottom-0 left-0 -mb-1 ml-8 flex flex-row gap-2 rounded bg-white/60 px-3 py-1 shadow">
          {locales.map((lang) => (
            <button
              key={lang}
              onClick={() => changeLocale(lang)}
              className={`${lang === locale ? "font-bold" : ""}`}
            >
              {lang}
            </button>
          ))}
          <button onClick={() => setShowLanguage(false)}>
            <FaX />
          </button>
        </div>
      )}
    </button>
  );
};
