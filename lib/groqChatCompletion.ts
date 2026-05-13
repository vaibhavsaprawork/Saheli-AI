/**
 * Groq OpenAI-compatible chat completions via fetch.
 * More reliable on Vercel than groq-sdk (avoids bundler/runtime edge cases that can yield 502).
 */
const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

export type GroqChatRole = "system" | "user" | "assistant";

export type GroqChatMessage = { role: GroqChatRole; content: string };

export type GroqChatResult =
  | { ok: true; text: string }
  | { ok: false; status: number; error: string };

export async function groqChatCompletion(params: {
  apiKey: string;
  messages: GroqChatMessage[];
  model: string;
  max_tokens: number;
  temperature: number;
}): Promise<GroqChatResult> {
  let res: Response;
  try {
    res = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        max_tokens: params.max_tokens,
        temperature: params.temperature,
        stream: false,
      }),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Fetch to Groq failed";
    return { ok: false, status: 502, error: msg };
  }

  const raw = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(raw) as unknown;
  } catch {
    return {
      ok: false,
      status: res.status,
      error: raw.slice(0, 300) || `Groq HTTP ${res.status}`,
    };
  }

  if (!res.ok) {
    const errObj = json as { error?: { message?: string } };
    const err =
      errObj?.error?.message ||
      (typeof json === "object" && json !== null && "message" in json
        ? String((json as { message: unknown }).message)
        : raw.slice(0, 300)) ||
      `Groq HTTP ${res.status}`;
    return { ok: false, status: res.status, error: err };
  }

  const data = json as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const text = data.choices?.[0]?.message?.content ?? "";
  return { ok: true, text };
}
