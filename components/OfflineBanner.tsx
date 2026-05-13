"use client";

import { useEffect, useRef, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const ONLINE_FLASH_MS = 2000;
const TRANSITION_MS = 300;

type BannerMode = "hidden" | "offline" | "online";

export function OfflineBanner() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<BannerMode>(() =>
    typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "hidden",
  );
  const hideTimerRef = useRef<number | null>(null);
  const wasOfflineRef = useRef(false);

  const clearTimer = () => {
    if (hideTimerRef.current != null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  useEffect(() => {
    const onOffline = () => {
      clearTimer();
      wasOfflineRef.current = true;
      setMode("offline");
    };

    const onOnline = () => {
      clearTimer();
      if (wasOfflineRef.current) {
        wasOfflineRef.current = false;
        setMode("online");
        hideTimerRef.current = window.setTimeout(() => {
          setMode("hidden");
          hideTimerRef.current = null;
        }, ONLINE_FLASH_MS);
      } else {
        setMode("hidden");
      }
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      clearTimer();
    };
  }, []);

  const open = mode !== "hidden";

  return (
    <div
      className="relative z-20 shrink-0 overflow-hidden transition-[max-height] ease-in-out"
      style={{
        maxHeight: open ? 120 : 0,
        transitionDuration: `${TRANSITION_MS}ms`,
      }}
      aria-live="polite"
    >
      {mode === "offline" && (
        <div
          className="flex items-center gap-3 bg-[#D32F2F] px-4 py-2.5 text-[13px] leading-snug text-white transition-[transform,opacity] ease-in-out translate-y-0 opacity-100"
          style={{ transitionDuration: `${TRANSITION_MS}ms` }}
        >
          <WifiOff className="h-5 w-5 shrink-0 text-white" strokeWidth={2} aria-hidden />
          <p className="min-w-0 flex-1 font-medium">{t.offlineText}</p>
        </div>
      )}
      {mode === "online" && (
        <div
          className="flex items-center gap-3 bg-emerald-700 px-4 py-2.5 text-[13px] leading-snug text-white transition-[transform,opacity] ease-in-out translate-y-0 opacity-100"
          style={{ transitionDuration: `${TRANSITION_MS}ms` }}
        >
          <Wifi className="h-5 w-5 shrink-0 text-white" strokeWidth={2} aria-hidden />
          <p className="min-w-0 flex-1 font-medium">{t.backOnlineText}</p>
        </div>
      )}
    </div>
  );
}
