"use client";

import { Home, Users, MessageCircle, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function BottomNav() {
  const { t } = useLanguage();

  const items = [
    { key: "home", label: t.navHome, Icon: Home, active: false },
    { key: "ben", label: t.navBeneficiaries, Icon: Users, active: false },
    { key: "ask", label: t.navAsk, Icon: MessageCircle, active: true },
    { key: "more", label: t.navMore, Icon: MoreHorizontal, active: false },
  ] as const;

  return (
    <nav className="shrink-0 border-t border-black/[0.06] bg-white px-1 pb-[calc(0.35rem+env(safe-area-inset-bottom))] pt-1">
      <ul className="flex items-stretch justify-between">
        {items.map(({ key, label, Icon, active }) => (
          <li key={key} className="flex-1">
            <button
              type="button"
              className={`flex w-full flex-col items-center gap-0.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${
                active ? "text-coral" : "text-navInactive"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 2} />
              <span className="max-w-[5.5rem] truncate px-0.5 leading-tight">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
