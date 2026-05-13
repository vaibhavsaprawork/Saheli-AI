"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AppLocale } from "@/lib/systemPrompt";

type Dict = {
  headerTitle: string;
  headerSubtitle: string;
  welcomeTitle: string;
  welcomeBody: string;
  chipAnemia: string;
  chipBreastfeeding: string;
  chipStunting: string;
  chipReferral: string;
  inputPlaceholder: string;
  navHome: string;
  navBeneficiaries: string;
  navAsk: string;
  navMore: string;
  langShortEn: string;
  langShortHi: string;
};

const en: Dict = {
  headerTitle: "Saheli AI",
  headerSubtitle: "Your Health Assistant",
  welcomeTitle: "Namaskar! 🙏",
  welcomeBody:
    "I am Saheli AI, your health assistant.\nAsk me anything about child nutrition,\nanemia, breastfeeding, or POSHAN guidelines.",
  chipAnemia: "Signs of anemia in children?",
  chipBreastfeeding: "Breastfeeding guidance",
  chipStunting: "Foods for stunting?",
  chipReferral: "When to refer to doctor?",
  inputPlaceholder: "Type your question...",
  navHome: "Home",
  navBeneficiaries: "Beneficiaries",
  navAsk: "Ask Saheli AI",
  navMore: "More",
  langShortEn: "EN",
  langShortHi: "हिं",
};

const hi: Dict = {
  headerTitle: "सहेली AI",
  headerSubtitle: "आपका स्वास्थ्य सहायक",
  welcomeTitle: "नमस्कार! 🙏",
  welcomeBody:
    "मैं सहेली AI, आपकी स्वास्थ्य सहायक हूँ।\nबाल पोषण, एनीमिया, स्तनपान या\nपोषण दिशा-निर्देशों के बारे में पूछें।",
  chipAnemia: "बच्चों में एनीमिया के लक्षण?",
  chipBreastfeeding: "स्तनपान मार्गदर्शन",
  chipStunting: "कुपोषण/लंबाई रोकथाम के लिए आहार?",
  chipReferral: "डॉक्टर को कब भेजें?",
  inputPlaceholder: "अपना प्रश्न लिखें...",
  navHome: "होम",
  navBeneficiaries: "लाभार्थी",
  navAsk: "सहेली AI पूछें",
  navMore: "और",
  langShortEn: "EN",
  langShortHi: "हिं",
};

const dictionaries: Record<AppLocale, Dict> = { en, hi };

type LanguageContextValue = {
  locale: AppLocale;
  setLocale: (l: AppLocale) => void;
  t: Dict;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<AppLocale>("en");

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
    }),
    [locale],
  );

  useEffect(() => {
    document.documentElement.lang = locale === "hi" ? "hi" : "en";
  }, [locale]);

  return (
    <LanguageContext.Provider value={value}>
      <div
        lang={locale === "hi" ? "hi" : "en"}
        className={
          locale === "hi" ? "font-hindi min-h-dvh" : "font-sans min-h-dvh"
        }
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

export function useToggleLocale() {
  const { locale, setLocale } = useLanguage();
  return useCallback(() => {
    setLocale(locale === "en" ? "hi" : "en");
  }, [locale, setLocale]);
}
