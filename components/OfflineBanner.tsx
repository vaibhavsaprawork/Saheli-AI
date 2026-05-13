"use client";

import { useEffect, useRef, useState } from "react";
import { WifiOff } from "lucide-react";

const HIDE_DELAY_MS = 2000;
const TRANSITION_MS = 300;

export function OfflineBanner() {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const openRef = useRef(false);

  openRef.current = open;

  useEffect(() => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    const clearTimer = () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    const onOffline = () => {
      clearTimer();
      setLeaving(false);
      setOpen(true);
    };

    const onOnline = () => {
      if (!openRef.current) return;
      setLeaving(true);
      clearTimer();
      hideTimerRef.current = window.setTimeout(() => {
        setOpen(false);
        setLeaving(false);
        hideTimerRef.current = null;
      }, HIDE_DELAY_MS);
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      clearTimer();
    };
  }, []);

  return (
    <div
      className="relative z-20 shrink-0 overflow-hidden transition-[max-height] ease-in-out"
      style={{
        maxHeight: open ? 120 : 0,
        transitionDuration: `${TRANSITION_MS}ms`,
      }}
      aria-live="polite"
    >
      <div
        className={`flex items-center gap-3 bg-[#D32F2F] px-4 py-2.5 text-[13px] leading-snug text-white transition-[transform,opacity] ease-in-out ${
          leaving ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
        style={{ transitionDuration: `${TRANSITION_MS}ms` }}
      >
        <WifiOff className="h-5 w-5 shrink-0 text-white" strokeWidth={2} aria-hidden />
        <p className="min-w-0 flex-1 font-medium">
          You are offline. Questions will be sent when connection restores.
        </p>
      </div>
    </div>
  );
}
