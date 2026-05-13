# Saheli AI

Mobile-first Next.js chat assistant for Anganwadi workers under **POSHAN Abhiyaan**. UI matches the POSHAN Tracker-style coral theme. Supports English and Hindi in the interface; the model follows the selected language and the worker’s messages.

## Features

- **Splash** — Branded intro on first visit (skipped if onboarding is already complete).
- **Onboarding** — Three swipeable slides; **Skip** or **Get Started** saves progress in `localStorage` (`saheli_onboarded=true`).
- **Chat** — Streaming replies via Groq (`llama-3.1-8b-instant`).
- **Follow-up chips** — After each assistant reply, contextual suggestions from `/api/suggestions`.
- **Offline banner** — Warns when the device is offline (uses `navigator.onLine` and browser events).

## Setup

```bash
cd saheli-ai
npm install
```

Create `.env.local`:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

Run locally:

```bash
npm run dev
```

## Deploy (Vercel)

Connect the repo, set `GROQ_API_KEY` in project **Environment Variables**, and deploy. No extra framework config is required.

## Reset onboarding (development)

In the browser console:

```js
localStorage.removeItem("saheli_onboarded");
location.reload();
```

## Project layout

- `app/page.tsx` — Routes splash → onboarding → main chat.
- `app/api/chat/route.ts` — Streaming chat completions.
- `app/api/suggestions/route.ts` — JSON follow-up question suggestions.
- `components/` — UI pieces (`SplashScreen`, `Onboarding`, `OfflineBanner`, `ChatLayout`, chat UI).
