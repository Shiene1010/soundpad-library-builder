export async function onRequestGet(context) {
  try {
    const email = await getAccessEmail(context);
    if (!email) return json({ error: "login_required" }, 401);
    if (!context.env.REQUESTS_KV) return json({ error: "requests_kv_not_configured" }, 500);

    const operator = isListed(email, context.env.OPERATOR_EMAILS);
    const requests = operator
      ? await listRequests(context.env.REQUESTS_KV)
      : (await listRequests(context.env.REQUESTS_KV)).filter((request) => request.createdBy === email);

    return json({ requests });
  } catch (error) {
    return json({ error: "requests_fetch_failed", trace: getTrace(error) }, 500);
  }
}

export async function onRequestPost(context) {
  try {
    const email = await getAccessEmail(context);
    if (!email) return json({ error: "login_required" }, 401);
    if (!context.env.REQUESTS_KV) return json({ error: "requests_kv_not_configured" }, 500);

    const operator = isListed(email, context.env.OPERATOR_EMAILS);
    if (!operator && !context.env.USERS_KV) return json({ error: "users_kv_not_configured" }, 500);
    const user = operator ? null : await getUser(context.env.USERS_KV, email);
    if (!operator && (user?.status !== "approved" || !user?.canRequestExpression)) {
      return json({ error: "request_access_required" }, 403);
    }

    const input = await readJsonBody(context.request);
    if (!input) return json({ error: "invalid_json" }, 400);
    const text = sanitizeText(input.text, 300);
    const usageContext = sanitizeText(input.context, 800);
    if (!text) return json({ error: "missing_expression_text" }, 400);

    const now = new Date().toISOString();
    const request = {
      id: `req-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      text,
      context: usageContext,
      status: "new",
      createdBy: email,
      createdAt: now,
      updatedAt: now,
    };
    await putRequest(context.env.REQUESTS_KV, request);
    return json({ request }, 201);
  } catch (error) {
    return json({ error: "request_create_failed", trace: getTrace(error) }, 500);
  }
}

export async function onRequestPatch(context) {
  try {
    const email = await getAccessEmail(context);
    if (!isListed(email, context.env.OPERATOR_EMAILS)) {
      return json({ error: "operator_access_required" }, 403);
    }
    if (!context.env.REQUESTS_KV) return json({ error: "requests_kv_not_configured" }, 500);

    const input = await readJsonBody(context.request);
    if (!input) return json({ error: "invalid_json" }, 400);
    const id = sanitizeText(input.id, 120);
    const action = sanitizeText(input.action, 40);
    if (!id) return json({ error: "missing_request_id" }, 400);

    const existing = await getRequest(context.env.REQUESTS_KV, id);
    if (!existing) return json({ error: "request_not_found" }, 404);

    const now = new Date().toISOString();
    const next = { ...existing, updatedAt: now };
    if (["reviewing", "approved", "rejected"].includes(action)) {
      next.status = action;
    } else if (action === "save_draft") {
      next.status = "draft";
      next.draft = input.draft;
      next.validation = input.validation;
    } else {
      return json({ error: "unknown_action" }, 400);
    }

    await putRequest(context.env.REQUESTS_KV, next);
    return json({ request: next });
  } catch (error) {
    return json({ error: "request_update_failed", trace: getTrace(error) }, 500);
  }
}

async function listRequests(kv) {
  if (!kv) return [];
  const listed = await kv.list({ prefix: "request:" });
  const requests = await Promise.all(listed.keys.map((key) => kv.get(key.name, "json")));
  return requests
    .filter(Boolean)
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
}

async function getRequest(kv, id) {
  if (!kv) return null;
  return kv.get(requestKey(id), "json");
}

async function putRequest(kv, request) {
  if (!kv) throw new Error("requests_kv_not_configured");
  await kv.put(requestKey(request.id), JSON.stringify(request));
}

async function getUser(kv, email) {
  if (!kv) return null;
  return kv.get(`user:${sanitizeEmail(email)}`, "json");
}

async function getAccessEmail(context) {
  const accessIdentity = await context.access?.getIdentity?.().catch(() => null);
  const accessEmail = sanitizeEmail(accessIdentity?.email);
  if (accessEmail) return accessEmail;
  return sanitizeEmail(context.request.headers.get("cf-access-authenticated-user-email"));
}

async function readJsonBody(request) {
  try {
    const input = await request.json();
    return input && typeof input === "object" ? input : null;
  } catch {
    return null;
  }
}

function requestKey(id) {
  return `request:${sanitizeText(id, 120)}`;
}

function isListed(email, allowlist) {
  if (!email) return false;
  return String(allowlist || "")
    .split(",")
    .map((item) => sanitizeEmail(item))
    .filter(Boolean)
    .includes(email);
}

function sanitizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function sanitizeText(value, limit) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, limit);
}

function getTrace(error) {
  return error?.message ? sanitizeText(error.message, 120) : "unknown";
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
