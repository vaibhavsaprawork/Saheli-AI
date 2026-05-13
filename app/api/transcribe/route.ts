import type { Language } from "@/lib/translations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const GROQ_TRANSCRIBE = "https://api.groq.com/openai/v1/audio/transcriptions";

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    return Response.json({ error: "GROQ_API_KEY is not set." }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");
    const langRaw = formData.get("language");
    const language: Language =
      langRaw === "hi" || langRaw === "en" ? langRaw : "en";

    if (!audioFile || !(audioFile instanceof Blob)) {
      return Response.json({ error: "No audio file" }, { status: 400 });
    }

    const fd = new FormData();
    fd.append("file", audioFile, "audio.webm");
    fd.append("model", "whisper-large-v3-turbo");
    fd.append("language", language === "hi" ? "hi" : "en");
    fd.append("response_format", "json");

    const res = await fetch(GROQ_TRANSCRIBE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: fd,
    });

    const raw = await res.text();
    let json: { text?: string; error?: { message?: string } };
    try {
      json = JSON.parse(raw) as { text?: string; error?: { message?: string } };
    } catch {
      return Response.json(
        { error: raw.slice(0, 200) || `Groq HTTP ${res.status}` },
        { status: res.ok ? 500 : res.status },
      );
    }

    if (!res.ok) {
      return Response.json(
        { error: json.error?.message || raw.slice(0, 200) },
        { status: res.status },
      );
    }

    const text = typeof json.text === "string" ? json.text : "";
    return Response.json({ text });
  } catch (e) {
    console.error("[api/transcribe]", e);
    return Response.json(
      { error: e instanceof Error ? e.message : "Transcription failed" },
      { status: 500 },
    );
  }
}
