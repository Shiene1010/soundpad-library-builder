const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";

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
      "Return strict JSON only for a Sound Chunk draft.",
      "Schema: { id, text, level, chunks:[{text,hint}], tones:[{key,emoji,label,pitch,rate,text}], ccq:[{answer,question}], sourceRequestId }.",
      "Use Korean hints. Make 2 chunks, 3 tones, and 2 CCQ questions.",
      "Every ccq.answer must be exactly yes or no.",
      `Expression: ${text}`,
      `Usage context: ${usageContext || "not provided"}`,
      `sourceRequestId: ${requestId || "manual"}`,
    ].join("\n");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort("gemini_timeout"), 45000);
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "gemini-3.8-flash",
        input: prompt,
        store: false,
        generation_config: {
          temperature: 0.3,
        },
      }),
    });
    clearTimeout(timeout);

    const result = await response.json();
    if (!response.ok) {
      return json({
        error: "gemini_generation_failed",
        traceId,
        status: response.status,
        message: sanitizeText(result.error?.message || "", 240),
      }, 502);
    }

    const raw = extractOutputText(result);
    const draft = JSON.parse(raw);
    return json({ draft, traceId });
  } catch (error) {
    const message = sanitizeText(error?.message || String(error), 160);
    const isTimeout = message.includes("abort") || message.includes("timeout") || String(error).includes("gemini_timeout");
    return json({ error: isTimeout ? "gemini_timeout" : "gemini_unhandled_error", traceId, message }, isTimeout ? 504 : 500);
  }
}

function extractOutputText(interaction) {
  const texts = [];
  for (const step of interaction.steps || []) {
    if (step.type !== "model_output") continue;
    for (const item of step.content || []) {
      if (item.type === "text" && item.text) texts.push(item.text);
    }
  }
  return texts.join("\n").trim();
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
