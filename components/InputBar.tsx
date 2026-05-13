"use client";

import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export function InputBar({ value, onChange, onSend, disabled }: Props) {
  const { t } = useLanguage();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!disabled && value.trim()) onSend();
  }

  return (
    <form
      onSubmit={submit}
      className="shrink-0 border-t border-black/5 bg-white px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.inputPlaceholder}
          disabled={disabled}
          className="min-h-[44px] flex-1 rounded-full bg-surface px-4 text-[15px] text-ink placeholder:text-navInactive outline-none ring-0 focus:ring-2 focus:ring-coral/30 disabled:opacity-60"
          autoComplete="off"
          enterKeyHint="send"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral text-white shadow-md transition active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          aria-label="Send"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}
