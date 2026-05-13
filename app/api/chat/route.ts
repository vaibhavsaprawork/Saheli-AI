import {
  getLanguageAppend,
  getSystemPrompt,
  type AppLocale,
} from "@/lib/systemPrompt";
import { groqChatCompletion } from "@/lib/groqChatCompletion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

type ChatMessage = { role: "user" | "assistant"; content: string };

function isChatMessage(x: unknown): x is ChatMessage {
  if (!x || typeof x !== "object") return false;
  const m = x as Record<string, unknown>;
  return (
    (m.role === "user" || m.role === "assistant") &&
    typeof m.content === "string"
  );
}

function parseLanguage(b: Record<string, unknown>): AppLocale {
  const lang = b.language ?? b.locale;
  return lang === "hi" ? "hi" : "en";
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "GROQ_API_KEY is not set. In Vercel: Settings → Environment Variables → add for Production and Preview, then Redeploy.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

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
    const rawMessages = b.messages;
    const language = parseLanguage(b);

    if (!Array.isArray(rawMessages)) {
      return new Response(JSON.stringify({ error: "messages must be an array." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const messages = rawMessages.filter(isChatMessage);
    if (messages.length !== rawMessages.length) {
      return new Response(
        JSON.stringify({
          error:
            "Each message must have role user|assistant and string content.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const systemContent =
      getSystemPrompt(language) + getLanguageAppend(language);

    const result = await groqChatCompletion({
      apiKey,
      messages: [{ role: "system", content: systemContent }, ...messages],
      model: "llama-3.1-8b-instant",
      max_tokens: 512,
      temperature: 0.7,
    });

    if (!result.ok) {
      return new Response(
        JSON.stringify({ error: result.error }),
        {
          status: result.status >= 400 && result.status < 600 ? result.status : 502,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(result.text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected server error";
    console.error("[api/chat]", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
