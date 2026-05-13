"use client";

import { ArrowLeft, Bell, Languages } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export function Header() {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <header className="relative shrink-0 bg-coral px-3 pb-4 pt-3 text-white">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-white/10"
          aria-label={t.ariaBack}
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2} />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <h1 className="truncate text-lg font-bold leading-tight">{t.appName}</h1>
          <p className="mt-0.5 text-xs font-medium text-white/90">{t.appSubtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex h-10 min-w-[3rem] items-center justify-center gap-1 rounded-full border border-white/40 px-2 text-xs font-semibold uppercase tracking-wide active:bg-white/10"
            aria-label={t.ariaLanguageToggle}
          >
            <Languages className="h-4 w-4 shrink-0" />
            <span
              className={
                language === "en" ? "text-white" : "text-white/55"
              }
            >
              {t.langShortEn}
            </span>
            <span className="text-white/50">|</span>
            <span
              className={language === "hi" ? "text-white" : "text-white/55"}
            >
              {t.langShortHi}
            </span>
          </button>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full active:bg-white/10"
            aria-label={t.ariaNotifications}
          >
            <Bell className="h-6 w-6" strokeWidth={2} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-coral" />
          </button>
        </div>
      </div>
    </header>
  );
}
