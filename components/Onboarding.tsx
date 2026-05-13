"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";

const SLIDE_COUNT = 3;
const ONBOARD_KEY = "saheli_onboarded";

type Props = {
  onComplete: () => void;
};

const slides = [
  {
    emoji: "👩‍⚕️",
    title: "Namaskar, Saheli!",
    subtitle:
      "I am your AI health assistant, here to help you with nutrition, anemia, and child health guidance.",
    accent: "from-coral to-[#c73d32]",
    chip: "POSHAN",
  },
  {
    emoji: "🤱",
    title: "Ask Anything",
    subtitle:
      "Get instant answers on breastfeeding, stunting, dietary counselling, and POSHAN guidelines — anytime, anywhere.",
    accent: "from-[#ff7a6e] to-coral",
    chip: "24×7",
  },
  {
    emoji: "🌐",
    title: "Works Offline Too",
    subtitle:
      "No internet? No problem. Saheli AI saves your questions and answers them when you're back online.",
    accent: "from-coral via-[#e87064] to-[#b8443a]",
    chip: "Sync",
  },
] as const;

export function Onboarding({ onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const finish = useCallback(() => {
    try {
      localStorage.setItem(ONBOARD_KEY, "true");
    } catch {
      /* ignore */
    }
    setExiting(true);
    window.setTimeout(() => onComplete(), 380);
  }, [onComplete]);

  const goNext = useCallback(() => {
    if (index < SLIDE_COUNT - 1) setIndex((i) => i + 1);
    else finish();
  }, [index, finish]);

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx < -50 && index < SLIDE_COUNT - 1) setIndex((i) => i + 1);
    if (dx > 50 && index > 0) setIndex((i) => i - 1);
  };

  const slide = slides[index];

  return (
    <div
      className={`fixed inset-0 z-[90] min-h-dvh min-w-[375px] overflow-hidden transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
        exiting ? "pointer-events-none scale-[0.98] opacity-0" : "scale-100 opacity-100"
      }`}
    >
      {/* Layered background — app-like, not flat white */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-coral via-[#ea5e52] to-surface"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.22)_0%,transparent_55%)] motion-reduce:opacity-30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L45 15L30 30L15 15z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "52px 52px",
        }}
        aria-hidden
      />

      {/* Floating orbs */}
      <div
        className="onboard-blob-a pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-white/25 blur-3xl motion-reduce:opacity-30"
        aria-hidden
      />
      <div
        className="onboard-blob-b pointer-events-none absolute -right-20 bottom-32 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl motion-reduce:opacity-25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-white/15 blur-2xl motion-reduce:hidden"
        aria-hidden
      />

      <div className="relative flex h-full min-h-dvh flex-col">
        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-100" strokeWidth={2} aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/95">
              Saheli AI
            </span>
          </div>
          <button
            type="button"
            onClick={skip}
            className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/20 active:bg-white/25"
          >
            Skip
          </button>
        </div>

        <div
          className="flex min-h-0 flex-1 flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Elevated card — reads as mobile app panel */}
          <div className="flex min-h-0 flex-1 flex-col justify-center py-4">
            <div
              key={index}
              className="onboard-content-in relative mx-auto w-full max-w-[400px] overflow-hidden rounded-[22px] border border-white/60 bg-white/95 shadow-[0_16px_48px_rgba(0,0,0,0.12)] backdrop-blur-xl"
            >
              <div
                className={`h-1.5 w-full bg-gradient-to-r ${slide.accent} motion-reduce:bg-coral`}
                aria-hidden
              />
              <div className="px-6 pb-8 pt-7">
                <div className="mb-2 flex justify-center">
                  <span className="rounded-full border border-coral/15 bg-coral/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-coral">
                    {slide.chip}
                  </span>
                </div>

                <div className="relative mx-auto mb-6 flex h-[120px] w-[120px] items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-coral/25 to-transparent motion-reduce:opacity-50"
                    aria-hidden
                  />
                  <div
                    className="absolute inset-2 rounded-full border-2 border-dashed border-coral/25 motion-reduce:border-coral/15"
                    aria-hidden
                  />
                  <div className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full bg-gradient-to-br from-white via-white to-coral/10 shadow-[0_8px_24px_rgba(232,86,74,0.25)] ring-2 ring-white">
                    <span
                      className="onboard-emoji-float select-none text-[56px] leading-none motion-reduce:animate-none"
                      aria-hidden
                    >
                      {slide.emoji}
                    </span>
                  </div>
                </div>

                <h2 className="text-center text-[22px] font-bold leading-snug tracking-tight text-ink sm:text-2xl">
                  {slide.title}
                </h2>
                <p className="mx-auto mt-3 max-w-[19rem] text-center text-[15px] leading-relaxed text-muted">
                  {slide.subtitle}
                </p>

                <p className="mt-6 flex items-center justify-center gap-1 text-center text-xs font-medium text-navInactive">
                  <span>Swipe</span>
                  <ChevronRight className="h-3.5 w-3.5 text-coral/80" aria-hidden />
                  <span>for more</span>
                </p>
              </div>
            </div>
          </div>

          {/* Dots — pill active state */}
          <div className="flex justify-center gap-2 pb-5 pt-1">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ease-out motion-reduce:transition-none ${
                  i === index
                    ? "w-8 bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                    : "w-2.5 bg-white/35 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "step" : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-coral to-[#d6453a] py-4 text-base font-bold text-white shadow-[0_10px_28px_rgba(232,86,74,0.45)] ring-1 ring-white/20 transition-transform duration-200 ease-out active:scale-[0.98] motion-reduce:active:scale-100"
          >
            <span
              className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[100%] motion-reduce:hidden"
              aria-hidden
            />
            <span className="relative">
              {index < SLIDE_COUNT - 1 ? "Next" : "Get Started"}
            </span>
            <ChevronRight
              className="relative h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={2.5}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </div>
  );
}
