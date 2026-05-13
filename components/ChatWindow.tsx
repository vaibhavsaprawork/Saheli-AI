"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { QuickChips } from "@/components/QuickChips";
import { HealthTipCards } from "@/components/HealthTipCards";
import { MessageBubble, type UiMessage } from "@/components/MessageBubble";
import type { AppLocale } from "@/lib/systemPrompt";
import type { RefObject } from "react";

type Props = {
  messages: UiMessage[];
  hasUserMessage: boolean;
  onChipPick: (text: string) => void;
  followUps: string[] | null;
  onFollowUpPick: (text: string) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
  endRef: RefObject<HTMLDivElement | null>;
  language: AppLocale;
};

export function ChatWindow({
  messages,
  hasUserMessage,
  onChipPick,
  followUps,
  onFollowUpPick,
  scrollRef,
  endRef,
  language,
}: Props) {
  const { t } = useLanguage();
  const last = messages[messages.length - 1];
  const followUpChips =
    followUps &&
    followUps.length >= 2 &&
    last?.role === "assistant" &&
    !last.streaming &&
    last.content.trim().length > 0
      ? followUps
      : null;

  return (
    <div
      ref={scrollRef}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-surface px-0 py-3"
    >
      <div className="mx-auto flex max-w-full flex-col gap-3 pb-2">
        <section
          className="relative mx-3 overflow-visible rounded-card border-l-[3px] border-coral bg-[#FFFAF9] p-4 pr-12 shadow-card"
          aria-label={t.ariaWelcome}
        >
          <span
            className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white"
            aria-hidden
          >
            SA
          </span>
          <h2 className="text-base font-bold text-ink">{t.welcomeTitle}</h2>
          <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-muted">
            {t.welcomeText}
          </p>
        </section>

        {!hasUserMessage && (
          <>
            <QuickChips onPick={onChipPick} />
            <HealthTipCards onPick={onChipPick} />
          </>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} appLocale={language} />
        ))}

        {followUpChips && (
          <div
            className="follow-chips-enter scrollbar-none flex gap-2 overflow-x-auto pl-4 pt-1"
            role="group"
            aria-label={t.ariaSuggestedFollowUps}
          >
            {followUpChips.map((label, i) => (
              <button
                key={`${label}-${i}`}
                type="button"
                onClick={() => onFollowUpPick(label)}
                className="shrink-0 rounded-[20px] border border-coral bg-white px-3 py-2 text-left text-[13px] font-medium leading-snug text-coral shadow-sm active:bg-coral/5"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div ref={endRef} className="h-1 shrink-0" />
      </div>
    </div>
  );
}
