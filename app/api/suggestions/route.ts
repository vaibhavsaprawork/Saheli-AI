import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SUGGESTIONS_SYSTEM = `You are a helpful assistant for Anganwadi workers.
Based on the conversation context provided, suggest exactly 3 short follow-up questions the health worker might want to ask next.
Return ONLY a JSON array of 3 strings, nothing else. Each question max 8 words.
Example: ["What foods are rich in iron?", "How often should I check weight?", "When to refer to hospital?"]`;

const DEFAULT_CHIPS = [
  "Tell me more",
  "How to prevent this?",
  "When to refer?",
];

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

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Server misconfiguration: GROQ_API_KEY is not set." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

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

  const userPayload = JSON.stringify(
    { lastQuestion, lastAnswer },
    null,
    0,
  );

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SUGGESTIONS_SYSTEM },
        { role: "user", content: userPayload },
      ],
      max_tokens: 256,
      temperature: 0.2,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    let suggestions = parseSuggestions(raw);
    if (suggestions.length !== 3) {
      suggestions = [...DEFAULT_CHIPS];
    }

    return new Response(JSON.stringify({ suggestions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Groq request failed.";
    return new Response(
      JSON.stringify({ suggestions: DEFAULT_CHIPS, error: message }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }
}
