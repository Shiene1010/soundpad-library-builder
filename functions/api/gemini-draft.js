const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent";

export async function onRequestPost(context) {
  const traceId = crypto.randomUUID();
  try {
    const env = context.env;
    const input = await context.request.json();
    const text = sanitizeText(input.text, 300);
    const requestId = sanitizeText(input.requestId || "", 120);
    const usageContext = sanitizeText(input.context || "", 800);

    if (!text) return json({ error: "missing_expression_text", traceId }, 400);
    if (!env.GEMINI_API_KEY) return json({ error: "gemini_not_configured", traceId }, 503);

    const prompt = [
      "Create a Sound Chunk expression library draft as strict JSON only.",
      "Schema: { id, text, level, chunks:[{text,hint}], tones:[{key,emoji,label,pitch,rate,text}], ccq:[{answer,question}], sourceRequestId }.",
      "Use simple Korean hints. Make 2-5 chunks, 5 tones, and 3 CCQ questions.",
      `Expression: ${text}`,
      `Usage context: ${usageContext || "not provided"}`,
      `sourceRequestId: ${requestId || "manual"}`,
    ].join("\n");

    const response = await fetch(`${GEMINI_URL}?key=${env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      return json({
        error: "gemini_generation_failed",
        traceId,
        status: response.status,
        message: sanitizeText(result.error?.message || "", 240),
      }, 502);
    }

    const raw = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const draft = JSON.parse(raw);
    return json({ draft, traceId });
  } catch {
    return json({ error: "gemini_unhandled_error", traceId }, 500);
  }
}

function sanitizeText(value, limit) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, limit);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
