"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Check, Mic, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import type { Language } from "@/lib/translations";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
  language: Language;
};

type VoiceUi = "idle" | "recording" | "transcribing";

const MAX_RECORD_MS = 60_000;
const AUTO_STOP_SHOW_60_MS = 100;
const ERROR_BORDER_MS = 300;
const MIC_ERROR_MS = 2000;
const CHAR_PREVIEW_MS = 500;

function formatRecordTime(totalSec: number) {
  const s = Math.min(60, Math.max(0, totalSec));
  return `0:${String(s).padStart(2, "0")}`;
}

export function InputBar({
  value,
  onChange,
  onSend,
  disabled,
  language,
}: Props) {
  const { t } = useLanguage();
  const [voiceUi, setVoiceUi] = useState<VoiceUi>("idle");
  const voiceUiRef = useRef<VoiceUi>("idle");
  useEffect(() => {
    voiceUiRef.current = voiceUi;
  }, [voiceUi]);

  const [recordSeconds, setRecordSeconds] = useState(0);
  const [micError, setMicError] = useState(false);
  const [errorBorderFlash, setErrorBorderFlash] = useState(false);
  const [freezeWaveform, setFreezeWaveform] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordStartMsRef = useRef(0);
  const tickIntervalRef = useRef<number | null>(null);
  const autoStopRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const finishingRef = useRef(false);

  const clearRecordTimers = useCallback(() => {
    if (tickIntervalRef.current != null) {
      window.clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
    if (autoStopRef.current != null) {
      window.clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
  }, []);

  const stopMediaRecorder = useCallback(async (): Promise<{
    mime: string;
    parts: Blob[];
  } | null> => {
    const rec = recorderRef.current;
    if (!rec || rec.state === "inactive") {
      recorderRef.current = null;
      return null;
    }
    const mime = rec.mimeType || "audio/webm";
    const stream = rec.stream;
    await new Promise<void>((resolve) => {
      rec.addEventListener("stop", () => resolve(), { once: true });
      try {
        rec.stop();
      } catch {
        resolve();
      }
    });
    stream.getTracks().forEach((tr) => tr.stop());
    recorderRef.current = null;
    const parts = [...chunksRef.current];
    chunksRef.current = [];
    return { mime, parts };
  }, []);

  const showTranscribeError = useCallback(() => {
    setFreezeWaveform(false);
    setErrorBorderFlash(true);
    window.setTimeout(() => setErrorBorderFlash(false), ERROR_BORDER_MS);
    setMicError(true);
    window.setTimeout(() => setMicError(false), MIC_ERROR_MS);
    setVoiceUi("idle");
    setRecordSeconds(0);
  }, []);

  const finishRecording = useCallback(async () => {
    if (voiceUiRef.current !== "recording" || finishingRef.current) return;
    finishingRef.current = true;
    setFreezeWaveform(true);
    clearRecordTimers();

    try {
      const result = await stopMediaRecorder();
      if (!result || result.parts.length === 0) {
        showTranscribeError();
        return;
      }
      const blob = new Blob(result.parts, { type: result.mime });
      if (blob.size < 80) {
        showTranscribeError();
        return;
      }

      setVoiceUi("transcribing");

      const fd = new FormData();
      fd.append("audio", blob, "audio.webm");
      fd.append("language", language);

      let res: Response;
      try {
        res = await fetch("/api/transcribe", { method: "POST", body: fd });
      } catch {
        showTranscribeError();
        return;
      }

      let data: { text?: string; error?: string };
      try {
        data = (await res.json()) as { text?: string; error?: string };
      } catch {
        showTranscribeError();
        return;
      }

      if (!res.ok || typeof data.text !== "string") {
        showTranscribeError();
        return;
      }

      const text = data.text.trim();
      if (!text) {
        showTranscribeError();
        return;
      }

      const n = text.length;
      onChange(t.micCharCountPreview.replace("{n}", String(n)));
      setFreezeWaveform(false);
      setVoiceUi("idle");
      setRecordSeconds(0);

      window.setTimeout(() => {
        onChange(text);
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }, CHAR_PREVIEW_MS);
    } finally {
      finishingRef.current = false;
    }
  }, [clearRecordTimers, language, onChange, showTranscribeError, stopMediaRecorder, t]);

  const cancelRecording = useCallback(async () => {
    if (finishingRef.current) return;
    if (voiceUiRef.current !== "recording") return;
    clearRecordTimers();
    setFreezeWaveform(false);
    finishingRef.current = true;
    try {
      await stopMediaRecorder();
    } finally {
      finishingRef.current = false;
      chunksRef.current = [];
      setVoiceUi("idle");
      setRecordSeconds(0);
    }
  }, [clearRecordTimers, stopMediaRecorder]);

  const startRecording = useCallback(async () => {
    if (disabled || voiceUiRef.current !== "idle") return;
    setMicError(false);
    setFreezeWaveform(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";
      const rec = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.start(250);
      recorderRef.current = rec;
      recordStartMsRef.current = Date.now();
      setRecordSeconds(0);
      setVoiceUi("recording");

      tickIntervalRef.current = window.setInterval(() => {
        const s = Math.min(
          60,
          Math.floor((Date.now() - recordStartMsRef.current) / 1000),
        );
        setRecordSeconds(s);
      }, 100);

      autoStopRef.current = window.setTimeout(() => {
        if (voiceUiRef.current !== "recording") return;
        setRecordSeconds(60);
        window.setTimeout(() => {
          void finishRecording();
        }, AUTO_STOP_SHOW_60_MS);
      }, MAX_RECORD_MS);
    } catch {
      setMicError(true);
      window.setTimeout(() => setMicError(false), MIC_ERROR_MS);
    }
  }, [disabled, finishRecording]);

  useEffect(() => {
    return () => {
      clearRecordTimers();
      const r = recorderRef.current;
      if (r && r.state !== "inactive") {
        try {
          r.stop();
        } catch {
          /* ignore */
        }
        r.stream.getTracks().forEach((tr) => tr.stop());
      }
    };
  }, [clearRecordTimers]);

  const placeholder = micError ? t.micError : t.inputPlaceholder;

  const pillRecordingStyle =
    voiceUi === "recording" || voiceUi === "transcribing";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!disabled && value.trim() && voiceUi === "idle") onSend();
  }

  const recordingButtonsDisabled = disabled || freezeWaveform;

  return (
    <div className="mx-4 mb-3 shrink-0">
      <form
        onSubmit={submit}
        className={`flex min-h-[56px] items-center gap-2 rounded-[30px] shadow-[0_2px_12px_rgba(0,0,0,0.10)] transition-all duration-200 ease-in-out ${
          pillRecordingStyle
            ? "border-[1.5px] border-coral bg-[#FFF0EF]"
            : "border-[1.5px] border-transparent bg-white"
        } ${errorBorderFlash ? "mic-pill-error-flash" : ""}`}
        style={{ padding: "6px 6px 6px 16px" }}
      >
        {voiceUi === "idle" && (
          <>
            <button
              type="button"
              onClick={() => void startRecording()}
              disabled={disabled}
              aria-label={t.ariaMic}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-coral bg-white text-coral transition-all duration-200 ease-in-out disabled:opacity-40"
            >
              <Mic className="h-5 w-5" strokeWidth={2.2} />
            </button>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className="min-h-[44px] min-w-0 flex-1 border-0 bg-transparent text-[15px] text-ink outline-none ring-0 transition-all duration-200 ease-in-out placeholder:text-navInactive disabled:opacity-60"
              autoComplete="off"
              enterKeyHint="send"
            />
            <button
              type="submit"
              disabled={disabled || !value.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral text-white transition-all duration-200 ease-in-out active:scale-95 disabled:pointer-events-none disabled:opacity-40"
              aria-label={t.ariaSend}
            >
              <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </>
        )}

        {voiceUi === "recording" && (
          <>
            <button
              type="button"
              onClick={() => void cancelRecording()}
              disabled={recordingButtonsDisabled}
              aria-label={t.ariaCancelRecording}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D32F2F] text-white transition-all duration-200 ease-in-out active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <div className="flex min-h-[44px] min-w-0 flex-1 items-center justify-center gap-3 px-1">
              <span
                className="shrink-0 font-mono text-[13px] font-medium tabular-nums text-coral"
                aria-live="polite"
              >
                {formatRecordTime(recordSeconds)}
              </span>
              <div
                className={`wave-bars-wrap ${freezeWaveform ? "waveform-frozen" : ""}`}
                aria-hidden
              >
                <span className="wave-bar wave-bar-1" />
                <span className="wave-bar wave-bar-2" />
                <span className="wave-bar wave-bar-3" />
                <span className="wave-bar wave-bar-4" />
                <span className="wave-bar wave-bar-5" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => void finishRecording()}
              disabled={recordingButtonsDisabled}
              aria-label={t.ariaSubmitRecording}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] text-white transition-all duration-200 ease-in-out active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              <Check className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </>
        )}

        {voiceUi === "transcribing" && (
          <>
            <button
              type="button"
              disabled
              aria-hidden
              className="pointer-events-none flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D32F2F] text-white opacity-50"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <div className="flex min-h-[44px] min-w-0 flex-1 items-center justify-center px-2">
              <p className="mic-transcribing-text text-center text-[14px] italic text-coral">
                {t.micTranscribing}
              </p>
            </div>
            <button
              type="button"
              disabled
              aria-hidden
              className="pointer-events-none flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] text-white opacity-50"
            >
              <Check className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </>
        )}
      </form>
    </div>
  );
}
