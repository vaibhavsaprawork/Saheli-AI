"use client";

import type { AppLocale } from "@/lib/systemPrompt";
import { formatAssistantReplyForDisplay } from "@/lib/formatAssistantReply";

export type UiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  streaming?: boolean;
};

function formatTime(ts: number, locale: AppLocale) {
  return new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ts));
}

export function MessageBubble({
  message,
  appLocale,
}: {
  message: UiMessage;
  appLocale: AppLocale;
}) {
  const time = formatTime(message.createdAt, appLocale);

  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end gap-1">
        <div
          className="max-w-[85%] whitespace-pre-wrap rounded-[16px] rounded-br-[4px] bg-coral px-3.5 py-2.5 text-[15px] leading-snug text-white shadow-card"
          style={{ wordBreak: "break-word" }}
        >
          {message.content}
        </div>
        <span className="px-1 text-[11px] text-stamp">{time}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex max-w-[92%] items-end gap-2">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coral text-[10px] font-bold leading-tight text-white"
          aria-hidden
        >
          SA
        </div>
        <div
          className="min-w-0 flex-1 whitespace-pre-wrap rounded-[16px] rounded-bl-[4px] bg-white px-3.5 py-2.5 text-[15px] leading-snug text-ink shadow-card"
          style={{ wordBreak: "break-word" }}
        >
          {message.streaming && !message.content ? (
            <span className="inline-flex items-center gap-1 py-0.5">
              <span className="loading-dot" />
              <span className="loading-dot animation-delay-150" />
              <span className="loading-dot animation-delay-300" />
            </span>
          ) : (
            formatAssistantReplyForDisplay(message.content)
          )}
        </div>
      </div>
      <span className="pl-10 text-[11px] text-stamp">{time}</span>
    </div>
  );
}
