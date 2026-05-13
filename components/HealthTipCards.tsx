"use client";

import { useLanguage } from "@/lib/LanguageContext";

type Props = {
  onPick: (text: string) => void;
};

export function HealthTipCards({ onPick }: Props) {
  const { t } = useLanguage();

  const cards = [
    { emoji: "🩸", title: t.tip1Title, subtitle: t.tip1Subtitle, prompt: t.chip1 },
    { emoji: "🤱", title: t.tip2Title, subtitle: t.tip2Subtitle, prompt: t.chip2 },
    { emoji: "🥗", title: t.tip3Title, subtitle: t.tip3Subtitle, prompt: t.chip3 },
    { emoji: "📏", title: t.tip4Title, subtitle: t.tip4Subtitle, prompt: t.chip4 },
    { emoji: "🏥", title: t.tip5Title, subtitle: t.tip5Subtitle, prompt: t.tip5Prompt },
  ] as const;

  return (
    <div className="w-full">
      <p className="mx-4 mb-4 mt-4 text-left text-[12px] font-medium uppercase tracking-[1px] text-[#999]">
        {t.tipsLabel}
      </p>
      <div
        className="scrollbar-none flex gap-3 overflow-x-auto pb-1 pl-4"
        role="list"
        aria-label={t.ariaHealthTips}
      >
        {cards.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(c.prompt)}
            className="flex h-[100px] w-[200px] shrink-0 flex-col items-start rounded-[12px] bg-white p-3 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition active:scale-[0.99] motion-reduce:transition-none"
          >
            <div className="text-[24px] leading-none">{c.emoji}</div>
            <div className="mt-1.5 line-clamp-2 text-[13px] font-bold leading-snug text-[#1A1A1A]">
              {c.title}
            </div>
            <div className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[#666]">
              {c.subtitle}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
