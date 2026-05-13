"use client";

import { useLanguage } from "@/lib/LanguageContext";

type Props = {
  onPick: (text: string) => void;
};

const CHIP_KEYS = ["c1", "c2", "c3", "c4"] as const;

export function QuickChips({ onPick }: Props) {
  const { t } = useLanguage();
  const chips: { key: (typeof CHIP_KEYS)[number]; label: string }[] = [
    { key: "c1", label: t.chip1 },
    { key: "c2", label: t.chip2 },
    { key: "c3", label: t.chip3 },
    { key: "c4", label: t.chip4 },
  ];

  return (
    <div className="scrollbar-none flex flex-nowrap gap-2 overflow-x-auto pl-4">
      {chips.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onPick(label)}
          className="shrink-0 rounded-[20px] border border-coral bg-white px-3 py-2 text-left text-[13px] font-medium leading-snug text-coral shadow-sm active:bg-coral/5"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
