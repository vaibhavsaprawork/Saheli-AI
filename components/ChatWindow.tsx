"use client";

import { useLanguage } from "@/lib/i18n";
import { QuickChips } from "@/components/QuickChips";
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
  locale: AppLocale;
};

export function ChatWindow({
  messages,
  hasUserMessage,
  onChipPick,
  followUps,
  onFollowUpPick,
  scrollRef,
  endRef,
  locale,
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
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-surface px-3 py-3"
    >
      <div className="mx-auto flex max-w-full flex-col gap-3 pb-2">
        <section
          className="rounded-card bg-white p-4 shadow-card"
          aria-label="Welcome"
        >
          <h2 className="text-base font-bold text-ink">{t.welcomeTitle}</h2>
          <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-muted">
            {t.welcomeBody}
          </p>
        </section>

        {!hasUserMessage && <QuickChips onPick={onChipPick} />}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} appLocale={locale} />
        ))}

        {followUpChips && (
          <div
            className="follow-chips-enter flex flex-wrap gap-2 pt-1"
            role="group"
            aria-label="Suggested follow-up questions"
          >
            {followUpChips.map((label, i) => (
              <button
                key={`${label}-${i}`}
                type="button"
                onClick={() => onFollowUpPick(label)}
                className="rounded-[20px] border border-coral bg-white px-3 py-2 text-left text-[13px] font-medium leading-snug text-coral shadow-sm active:bg-coral/5"
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
