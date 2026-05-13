import { groqChatCompletion } from "@/lib/groqChatCompletion";
import type { Language } from "@/lib/translations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

const DEFAULT_EN = [
  "Tell me more",
  "How to prevent this?",
  "When to refer?",
] as const;

const DEFAULT_HI = [
  "और बताएं",
  "इससे कैसे बचें?",
  "कब रेफ़र करें?",
] as const;

function suggestionsSystem(language: Language): string {
  if (language === "hi") {
    return `You are a helpful assistant for Anganwadi workers in India.
Based on the conversation context, suggest exactly 3 short follow-up questions the worker might ask next.
Write all 3 questions ONLY in Hindi using Devanagari script (no Romanized Hindi).
Return ONLY a JSON array of 3 strings, nothing else. Each question max 8 words.
Example: ["आयरन की कमी के लक्षण क्या हैं?", "वजन कितनी बार जाँचें?", "कब अस्पताल भेजें?"]`;
  }
  return `You are a helpful assistant for Anganwadi workers.
Based on the conversation context provided, suggest exactly 3 short follow-up questions the health worker might want to ask next.
Return ONLY a JSON array of 3 strings, nothing else. Each question max 8 words.
Example: ["What foods are rich in iron?", "How often should I check weight?", "When to refer to hospital?"]`;
}

function parseSuggestions(raw: string): string[] {
  const trimmed = raw.trim();
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed)) {
      return parsed
        .filter((x): x is string => typeof x === "string")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);
    }
  } catch {
    /* try extract JSON array substring */
  }
  const start = trimmed.indexOf("[");
  const end = trimmed.lastIndexOf("]");
  if (start >= 0 && end > start) {
    try {
      const parsed = JSON.parse(trimmed.slice(start, end + 1)) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .filter((x): x is string => typeof x === "string")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 3);
      }
    } catch {
      /* fall through */
    }
  }
  return [];
}

function defaults(language: Language): string[] {
  return language === "hi" ? [...DEFAULT_HI] : [...DEFAULT_EN];
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GROQ_API_KEY is not set." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let language: Language = "en";

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const b = body as Record<string, unknown>;
    const lastQuestion = typeof b.lastQuestion === "string" ? b.lastQuestion : "";
    const lastAnswer = typeof b.lastAnswer === "string" ? b.lastAnswer : "";
    language =
      b.language === "hi" || b.locale === "hi" ? "hi" : "en";

    const userPayload = JSON.stringify({ lastQuestion, lastAnswer }, null, 0);

    const result = await groqChatCompletion({
      apiKey,
      messages: [
        { role: "system", content: suggestionsSystem(language) },
        { role: "user", content: userPayload },
      ],
      model: "llama-3.1-8b-instant",
      max_tokens: 256,
      temperature: 0.2,
    });

    const def = defaults(language);

    if (!result.ok) {
      return new Response(
        JSON.stringify({ suggestions: def, error: result.error }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    let suggestions = parseSuggestions(result.text);
    if (suggestions.length !== 3) {
      suggestions = def;
    }

    return new Response(JSON.stringify({ suggestions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("[api/suggestions]", err);
    return new Response(
      JSON.stringify({
        suggestions: defaults(language),
        error: "Unexpected error",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }
}
