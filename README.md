# Saheli AI

# Saheli AI

Mobile-first Next.js chat assistant for Anganwadi workers under **POSHAN Abhiyaan**.

🚀 **Live Demo:** : https://saheli-ai-henna.vercel.app/

UI matches the POSHAN Tracker-style coral theme. Supports English and Hindi in the interface; the model follows the selected language and the worker’s messages.

Mobile-first Next.js chat assistant for Anganwadi workers under **POSHAN Abhiyaan**. UI matches the POSHAN Tracker-style coral theme. Supports English and Hindi in the interface; the model follows the selected language and the worker’s messages.

## Features

- **Splash** — Branded intro on first visit (skipped if onboarding is already complete).
- **Onboarding** — Three swipeable slides; **Skip** or **Get Started** saves progress in `localStorage` (`saheli_onboarded=true`).
- **Chat** — Replies via Groq (`llama-3.1-8b-instant`); responses are returned in one piece for reliable Vercel serverless behaviour (not streamed token-by-token).
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

1. Import the GitHub repo in [Vercel](https://vercel.com).
2. **Environment variables** → add **`GROQ_API_KEY`** with your Groq secret.
3. Enable it for **Production** (and **Preview** if you want previews to work).
4. **Redeploy** after adding or changing env vars (Deployments → … → Redeploy).

API routes use **`runtime = "nodejs"`**, **`maxDuration = 10`** (fits Vercel Hobby), and call Groq’s HTTP API directly (no `groq-sdk`) for stable serverless behaviour.

### “Could not connect” / chat never loads

| Check | Action |
|--------|--------|
| **`GROQ_API_KEY` missing** | In Vercel → **Settings → Environment Variables**: add the key for **every** environment you use (**Production** and **Preview**). Preview URLs like `*-projects.vercel.app` only see Preview env. |
| Old deploy | **Redeploy** after saving env vars. |
| Still 502 | **Deployments → [deployment] → Logs** while sending a message; errors are logged as `[api/chat]`. |

## Reset onboarding (development)

In the browser console:

```js
localStorage.removeItem("saheli_onboarded");
location.reload();
```

## Project layout

- `app/page.tsx` — Routes splash → onboarding → main chat.
- `app/api/chat/route.ts` — Chat completion via Groq (plain text).
- `app/api/suggestions/route.ts` — JSON follow-up question suggestions.
- `lib/groqChatCompletion.ts` — Groq REST helper (no SDK).
- `components/` — UI (`SplashScreen`, `Onboarding`, `OfflineBanner`, `ChatLayout`, chat).
