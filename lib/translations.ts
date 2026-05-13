export type Language = "en" | "hi";

export const translations = {
  en: {
    appName: "Saheli AI",
    appSubtitle: "Your Health Assistant",
    langShortEn: "EN",
    langShortHi: "हिं",

    welcomeTitle: "Namaskar! 🙏",
    welcomeText:
      "I am Saheli AI, your health assistant. Ask me anything about child nutrition, anemia, breastfeeding, or POSHAN guidelines.",

    chip1: "Signs of anemia in children?",
    chip2: "Breastfeeding guidance",
    chip3: "Foods for stunting?",
    chip4: "When to refer to doctor?",

    tipsLabel: "HEALTH TIPS",
    tip1Title: "Signs of Anemia",
    tip1Subtitle:
      "Pale skin, fatigue & weakness are early signs in children",
    tip2Title: "Breastfeeding",
    tip2Subtitle:
      "Feed exclusively for first 6 months for best child growth",
    tip3Title: "Iron-Rich Foods",
    tip3Subtitle:
      "Green leafy vegetables, dal & eggs boost iron levels",
    tip4Title: "Growth Monitoring",
    tip4Subtitle:
      "Measure height & weight monthly to detect stunting early",
    tip5Title: "When to Refer",
    tip5Subtitle:
      "SAM children need immediate referral to NRC facility",
    tip5Prompt:
      "When should SAM children be referred to an NRC facility?",

    inputPlaceholder: "Type your question...",

    navHome: "Home",
    navBeneficiaries: "Beneficiaries",
    navAsk: "Ask Saheli AI",
    navMore: "More",

    offlineText:
      "You are offline. Questions will be sent when connection restores.",
    backOnlineText: "You are back online!",

    slide1Title: "Namaskar, Saheli!",
    slide1Subtitle:
      "I am your AI health assistant, here to help you with nutrition, anemia, and child health guidance.",
    slide2Title: "Ask Anything",
    slide2Subtitle:
      "Get instant answers on breastfeeding, stunting, dietary counselling, and POSHAN guidelines — anytime, anywhere.",
    slide3Title: "Works Offline Too",
    slide3Subtitle:
      "No internet? No problem. Saheli AI saves your questions and answers them when you're back online.",
    onboardChip1: "POSHAN",
    onboardChip2: "24×7",
    onboardChip3: "Sync",
    next: "Next",
    getStarted: "Get Started",
    skip: "Skip",

    onboardSwipe: "Swipe for more",
    onboardSlide: "Slide",

    connectionError: "Connection error. Please try again.",
    serverConfigError:
      "Could not connect to the server. On Vercel: add GROQ_API_KEY for Production and Preview, then Redeploy.",
    somethingWrong: "Something went wrong.",
    noResponseBody: "No response body.",
    readResponseError: "Could not read response.",

    micStart: "Tap to speak",
    micListening: "Listening...",
    micTranscribing: "Transcribing...",
    micError: "Could not hear you. Try again.",
    micCharCountPreview: "{n} chars",

    splashTitle: "Saheli AI",
    splashTagline: "Aapki Swasthya Saheli",
    splashTaglineEn: "(Your Health Companion)",
    splashPowered: "Powered by POSHAN Abhiyaan",

    ariaBack: "Back",
    ariaNotifications: "Notifications",
    ariaLanguageToggle: "Switch language",
    ariaSend: "Send",
    ariaMic: "Voice input",
    ariaCancelRecording: "Cancel recording",
    ariaSubmitRecording: "Finish and transcribe",
    ariaWelcome: "Welcome",
    ariaHealthTips: "Health tips",
    ariaSuggestedFollowUps: "Suggested follow-up questions",
    ariaLoading: "Loading",

    suggestionDefault1: "Tell me more",
    suggestionDefault2: "How to prevent this?",
    suggestionDefault3: "When to refer?",
  },

  hi: {
    appName: "सहेली AI",
    appSubtitle: "आपकी स्वास्थ्य सहेली",
    langShortEn: "EN",
    langShortHi: "हिं",

    welcomeTitle: "नमस्कार! 🙏",
    welcomeText:
      "मैं सहेली AI हूं, आपकी स्वास्थ्य सहेली। बाल पोषण, खून की कमी, स्तनपान या POSHAN दिशानिर्देशों के बारे में कुछ भी पूछें।",

    chip1: "बच्चों में खून की कमी के लक्षण?",
    chip2: "स्तनपान मार्गदर्शन",
    chip3: "कुपोषण के लिए आहार?",
    chip4: "डॉक्टर के पास कब भेजें?",

    tipsLabel: "स्वास्थ्य सुझाव",
    tip1Title: "खून की कमी के लक्षण",
    tip1Subtitle:
      "पीली त्वचा, थकान और कमजोरी बच्चों में शुरुआती लक्षण हैं",
    tip2Title: "स्तनपान",
    tip2Subtitle:
      "पहले 6 महीने केवल स्तनपान से बच्चे का विकास सबसे अच्छा होता है",
    tip3Title: "आयरन युक्त आहार",
    tip3Subtitle:
      "हरी पत्तेदार सब्जियां, दाल और अंडे आयरन बढ़ाते हैं",
    tip4Title: "विकास की निगरानी",
    tip4Subtitle:
      "कुपोषण का पता लगाने के लिए हर महीने लंबाई और वजन मापें",
    tip5Title: "कब भेजें",
    tip5Subtitle:
      "SAM बच्चों को तुरंत NRC केंद्र भेजना जरूरी है",
    tip5Prompt:
      "SAM बच्चों को NRC केंद्र कब भेजना चाहिए?",

    inputPlaceholder: "अपना सवाल लिखें...",

    navHome: "होम",
    navBeneficiaries: "लाभार्थी",
    navAsk: "सहेली AI से पूछें",
    navMore: "अधिक",

    offlineText:
      "आप ऑफलाइन हैं। कनेक्शन वापस आने पर सवाल भेजे जाएंगे।",
    backOnlineText: "आप वापस ऑनलाइन हैं!",

    slide1Title: "नमस्कार, सहेली!",
    slide1Subtitle:
      "मैं आपकी AI स्वास्थ्य सहेली हूं, पोषण, खून की कमी और बाल स्वास्थ्य में आपकी मदद के लिए यहां हूं।",
    slide2Title: "कुछ भी पूछें",
    slide2Subtitle:
      "स्तनपान, कुपोषण, आहार परामर्श और POSHAN दिशानिर्देशों पर तुरंत जवाब पाएं — कभी भी, कहीं भी।",
    slide3Title: "ऑफलाइन भी काम करता है",
    slide3Subtitle:
      "इंटरनेट नहीं? कोई बात नहीं। सहेली AI आपके सवाल सहेजता है और वापस ऑनलाइन होने पर जवाब देता है।",
    onboardChip1: "पोषण",
    onboardChip2: "२४×७",
    onboardChip3: "सिंक",
    next: "आगे",
    getStarted: "शुरू करें",
    skip: "छोड़ें",

    onboardSwipe: "और देखने के लिए स्वाइप करें",
    onboardSlide: "स्लाइड",

    connectionError: "कनेक्शन त्रुटि। कृपया फिर से प्रयास करें।",
    serverConfigError:
      "सर्वर से जुड़ नहीं सके। Vercel पर Production व Preview दोनों के लिए GROQ_API_KEY जोड़कर Redeploy करें।",
    somethingWrong: "कुछ गलत हो गया।",
    noResponseBody: "उत्तर नहीं मिला।",
    readResponseError: "पढ़ने में त्रुटि।",

    micStart: "बोलने के लिए दबाएं",
    micListening: "सुन रहा हूं...",
    micTranscribing: "ट्रांसक्राइब हो रहा है...",
    micError: "आवाज नहीं सुनाई दी। फिर कोशिश करें।",
    micCharCountPreview: "{n} अक्षर",

    splashTitle: "सहेली AI",
    splashTagline: "आपकी स्वास्थ्य सहेली",
    splashTaglineEn: "(आपका स्वास्थ्य साथी)",
    splashPowered: "पोषण अभियान द्वारा संचालित",

    ariaBack: "वापस",
    ariaNotifications: "सूचनाएं",
    ariaLanguageToggle: "भाषा बदलें",
    ariaSend: "भेजें",
    ariaMic: "आवाज़ इनपुट",
    ariaCancelRecording: "रिकॉर्डिंग रद्द करें",
    ariaSubmitRecording: "समाप्त करके लिखित करें",
    ariaWelcome: "स्वागत",
    ariaHealthTips: "स्वास्थ्य सुझाव",
    ariaSuggestedFollowUps: "अनुवर्ती सुझाव",
    ariaLoading: "लोड हो रहा है",

    suggestionDefault1: "और बताएं",
    suggestionDefault2: "इससे कैसे बचें?",
    suggestionDefault3: "कब रेफ़र करें?",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export type Translations = (typeof translations)[Language];
