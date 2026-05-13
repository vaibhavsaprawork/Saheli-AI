"use client";

import { ArrowLeft, Bell, Languages } from "lucide-react";
import { useLanguage, useToggleLocale } from "@/lib/i18n";

export function Header() {
  const { t, locale } = useLanguage();
  const toggle = useToggleLocale();

  return (
    <header className="relative shrink-0 bg-coral px-3 pb-4 pt-3 text-white">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-white/10"
          aria-label="Back"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2} />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <h1 className="truncate text-lg font-bold leading-tight">{t.headerTitle}</h1>
          <p className="mt-0.5 text-xs font-medium text-white/90">{t.headerSubtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={toggle}
            className="flex h-10 min-w-[3rem] items-center justify-center gap-1 rounded-full border border-white/40 px-2 text-xs font-semibold uppercase tracking-wide active:bg-white/10"
            aria-label={
              locale === "hi"
                ? "भाषा: हिंदी। अंग्रेज़ी पर बदलने के लिए टैप करें।"
                : "Language: English. Tap to switch to Hindi."
            }
          >
            <Languages className="h-4 w-4 shrink-0" />
            <span
              className={
                locale === "en" ? "text-white" : "text-white/55"
              }
            >
              {t.langShortEn}
            </span>
            <span className="text-white/50">|</span>
            <span
              className={locale === "hi" ? "text-white" : "text-white/55"}
            >
              {t.langShortHi}
            </span>
          </button>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full active:bg-white/10"
            aria-label="Notifications"
          >
            <Bell className="h-6 w-6" strokeWidth={2} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-coral" />
          </button>
        </div>
      </div>
    </header>
  );
}
