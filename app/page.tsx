"use client";

import { useCallback, useEffect, useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { Onboarding } from "@/components/Onboarding";
import { ChatLayout } from "@/components/ChatLayout";
import { useLanguage } from "@/lib/LanguageContext";

const ONBOARD_KEY = "saheli_onboarded";

type Screen = "boot" | "splash" | "onboarding" | "chat";

export default function Home() {
  const { t } = useLanguage();
  const [screen, setScreen] = useState<Screen>("boot");

  const goOnboarding = useCallback(() => setScreen("onboarding"), []);
  const goChat = useCallback(() => setScreen("chat"), []);

  useEffect(() => {
    try {
      const onboarded = localStorage.getItem(ONBOARD_KEY) === "true";
      setScreen(onboarded ? "chat" : "splash");
    } catch {
      setScreen("splash");
    }
  }, []);

  if (screen === "boot") {
    return (
      <div
        className="min-h-dvh min-w-[375px] bg-surface"
        aria-busy="true"
        aria-label={t.ariaLoading}
      />
    );
  }

  if (screen === "splash") {
    return <SplashScreen onComplete={goOnboarding} />;
  }

  if (screen === "onboarding") {
    return <Onboarding onComplete={goChat} />;
  }

  return <ChatLayout />;
}
