"use client";

import { useEffect, useRef, useState } from "react";

const SPLASH_MS = 2500;
const FADE_MS = 300;

type Props = {
  onComplete: () => void;
};

export function SplashScreen({ onComplete }: Props) {
  const [fadeOut, setFadeOut] = useState(false);
  const onDoneRef = useRef(onComplete);
  onDoneRef.current = onComplete;

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFadeOut(true), SPLASH_MS - FADE_MS);
    const doneTimer = window.setTimeout(() => onDoneRef.current(), SPLASH_MS);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] flex min-h-dvh min-w-[375px] flex-col bg-coral transition-opacity ease-in-out ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
      role="presentation"
    >
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8 pt-12">
        <div className="flex h-[148px] w-[148px] shrink-0 items-center justify-center rounded-full bg-white shadow-lg">
          <span className="text-[80px] font-bold leading-none text-coral">SA</span>
        </div>
        <h1 className="mt-8 text-center text-[28px] font-bold leading-tight text-white">
          Saheli AI
        </h1>
        <p className="mt-2 text-center text-base font-light text-white">
          Aapki Swasthya Saheli
        </p>
        <p className="mt-1 text-center text-xs font-normal text-white/80">
          (Your Health Companion)
        </p>

        <div className="mt-10 h-1 w-[200px] overflow-hidden rounded-full bg-white/25">
          <div className="saheli-splash-bar h-full rounded-full bg-white" />
        </div>
      </div>

      <p className="pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-xs text-white/70">
        Powered by POSHAN Abhiyaan
      </p>
    </div>
  );
}
