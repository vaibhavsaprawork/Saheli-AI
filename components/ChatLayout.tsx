"use client";

import { Header } from "@/components/Header";
import { OfflineBanner } from "@/components/OfflineBanner";
import { SaheliChat } from "@/components/SaheliChat";
import { BottomNav } from "@/components/BottomNav";

export function ChatLayout() {
  return (
    <div className="mx-auto flex h-dvh min-w-[375px] max-w-[430px] flex-col bg-surface shadow-xl transition-opacity duration-300 ease-in-out">
      <Header />
      <OfflineBanner />
      <SaheliChat />
      <BottomNav />
    </div>
  );
}
