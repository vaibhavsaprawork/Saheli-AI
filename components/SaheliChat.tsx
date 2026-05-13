"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import type { AppLocale } from "@/lib/systemPrompt";
import type { Language } from "@/lib/translations";
import { ChatWindow } from "@/components/ChatWindow";
import { InputBar } from "@/components/InputBar";
import type { UiMessage } from "@/components/MessageBubble";

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);
}

function buildApiMessages(list: UiMessage[]): { role: "user" | "assistant"; content: string }[] {
  return list
    .filter((m) => m.role === "user" || (m.role === "assistant" && m.content.trim().length > 0))
    .map((m) => ({ role: m.role, content: m.content }));
}

function lastUserContent(messages: UiMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

async function fetchFollowUps(
  lastQuestion: string,
  lastAnswer: string,
  language: Language,
): Promise<string[]> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return [];
  }
  try {
    const res = await fetch("/api/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lastQuestion,
        lastAnswer: lastAnswer.slice(0, 6000),
        language,
      }),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { suggestions?: unknown };
    if (Array.isArray(data.suggestions)) {
      return data.suggestions
        .filter((x): x is string => typeof x === "string")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);
    }
  } catch {
    /* ignore */
  }
  return [];
}

export function SaheliChat() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [followUps, setFollowUps] = useState<string[] | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasUserMessage = messages.some((m) => m.role === "user");

  const scrollToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, followUps, scrollToEnd]);

  const runAssistant = useCallback(
    async (nextMessages: UiMessage[], appLocale: AppLocale) => {
      setFollowUps(null);

      const assistantId = newId();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          createdAt: Date.now(),
          streaming: true,
        },
      ]);

      const payload = buildApiMessages(nextMessages);
      let res: Response;
      try {
        res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payload, language: appLocale }),
          cache: "no-store",
        });
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: t.serverConfigError,
                  streaming: false,
                }
              : m,
          ),
        );
        return;
      }

      if (!res.ok) {
        let errText: string = t.somethingWrong;
        try {
          const j = (await res.json()) as { error?: string };
          if (j.error) errText = j.error;
        } catch {
          /* ignore */
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: errText, streaming: false } : m,
          ),
        );
        return;
      }

      let accumulated = "";
      try {
        accumulated = await res.text();
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: t.readResponseError,
                  streaming: false,
                }
              : m,
          ),
        );
        return;
      }

      if (!accumulated.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: t.noResponseBody,
                  streaming: false,
                }
              : m,
          ),
        );
        return;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, streaming: false, content: accumulated } : m,
        ),
      );

      const trimmed = accumulated.trim();
      if (trimmed.length > 0) {
        const lastQ = lastUserContent(nextMessages);
        const chips = await fetchFollowUps(lastQ, trimmed, appLocale);
        if (chips.length >= 2) {
          setFollowUps(chips.slice(0, 3));
        }
      }
    },
    [t],
  );

  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;

      setFollowUps(null);

      const userMsg: UiMessage = {
        id: newId(),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };

      const next = [...messages, userMsg];
      setMessages(next);
      setInput("");
      setBusy(true);
      await runAssistant(next, language);
      setBusy(false);
    },
    [busy, messages, language, runAssistant],
  );

  return (
    <>
      <ChatWindow
        messages={messages}
        hasUserMessage={hasUserMessage}
        onChipPick={(q) => void sendText(q)}
        followUps={followUps}
        onFollowUpPick={(q) => void sendText(q)}
        scrollRef={scrollRef}
        endRef={endRef}
        language={language}
      />

      <InputBar
        value={input}
        onChange={setInput}
        disabled={busy}
        onSend={() => void sendText(input)}
        language={language}
      />
    </>
  );
}
