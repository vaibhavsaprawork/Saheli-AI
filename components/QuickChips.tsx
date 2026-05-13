"use client";

import { useLanguage } from "@/lib/i18n";

type Props = {
  onPick: (text: string) => void;
};

const CHIP_KEYS = ["anemia", "bf", "stunting", "referral"] as const;

export function QuickChips({ onPick }: Props) {
  const { t } = useLanguage();
  const chips: { key: (typeof CHIP_KEYS)[number]; label: string }[] = [
    { key: "anemia", label: t.chipAnemia },
    { key: "bf", label: t.chipBreastfeeding },
    { key: "stunting", label: t.chipStunting },
    { key: "referral", label: t.chipReferral },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onPick(label)}
          className="rounded-[20px] border border-coral bg-white px-3 py-2 text-left text-[13px] font-medium leading-snug text-coral shadow-sm active:bg-coral/5"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
