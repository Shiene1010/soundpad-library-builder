const MAX_APPROVED_USERS = 45;

export async function onRequestGet(context) {
  const operator = await requireOperator(context);
  if (!operator.ok) return json(operator.body, operator.status);

  const users = await listUsers(context.env.USERS_KV);
  return json({ users });
}

export async function onRequestPost(context) {
  const operator = await requireOperator(context);
  if (!operator.ok) return json(operator.body, operator.status);

  const input = await context.request.json();
  const email = sanitizeEmail(input.email);
  const action = String(input.action || "").trim();
  if (!email) return json({ error: "missing_email" }, 400);

  const existing = await getUser(context.env.USERS_KV, email);
  if (!existing) return json({ error: "user_not_found" }, 404);

  const now = new Date().toISOString();
  const next = { ...existing, updatedAt: now };
  if (action === "approve") {
    const approvedCount = await countApprovedUsers(context.env.USERS_KV, email);
    if (approvedCount >= MAX_APPROVED_USERS) return json({ error: "approved_user_limit_reached" }, 409);
    next.status = "approved";
    next.approvedAt = existing.approvedAt || now;
  } else if (action === "reject") {
    next.status = "rejected";
    next.canRequestExpression = false;
  } else if (action === "enable_requests") {
    next.canRequestExpression = true;
  } else if (action === "disable_requests") {
    next.canRequestExpression = false;
  } else {
    return json({ error: "unknown_action" }, 400);
  }

  await putUser(context.env.USERS_KV, next);
  return json({ user: next });
}

async function requireOperator(context) {
  const email = await getAccessEmail(context);
  if (!isListed(email, context.env.OPERATOR_EMAILS)) {
    return { ok: false, status: 403, body: { error: "operator_access_required" } };
  }
  return { ok: true, email };
}

async function listUsers(kv) {
  if (!kv) return [];
  const listed = await kv.list({ prefix: "user:" });
  const users = await Promise.all(listed.keys.map((key) => kv.get(key.name, "json")));
  return users
    .filter(Boolean)
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
}

async function countApprovedUsers(kv, exceptEmail) {
  const users = await listUsers(kv);
  return users.filter((user) => (
    user.status === "approved" && user.role !== "operator" && user.email !== exceptEmail
  )).length;
}

async function getUser(kv, email) {
  if (!kv) return null;
  return kv.get(userKey(email), "json");
}

async function putUser(kv, user) {
  if (!kv) throw new Error("users_kv_not_configured");
  await kv.put(userKey(user.email), JSON.stringify(user));
}

async function getAccessEmail(context) {
  const accessIdentity = await context.access?.getIdentity?.();
  const accessEmail = sanitizeEmail(accessIdentity?.email);
  if (accessEmail) return accessEmail;
  return sanitizeEmail(context.request.headers.get("cf-access-authenticated-user-email"));
}

function userKey(email) {
  return `user:${sanitizeEmail(email)}`;
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

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
