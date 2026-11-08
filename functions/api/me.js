export async function onRequestGet(context) {
  const email = await getAccessEmail(context);
  if (!email) {
    return json({
      email: "",
      role: "anonymous",
      status: "pending",
      canRequestExpression: false,
      authSource: "none",
    });
  }

  const now = new Date().toISOString();
  const operator = isListed(email, context.env.OPERATOR_EMAILS);
  const existing = await getUser(context.env.USERS_KV, email);
  const user = {
    email,
    role: operator ? "operator" : existing?.role || "user",
    status: operator ? "approved" : existing?.status || "pending",
    canRequestExpression: operator ? true : Boolean(existing?.canRequestExpression),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    approvedAt: operator ? existing?.approvedAt || now : existing?.approvedAt || "",
  };

  await putUser(context.env.USERS_KV, user);

  return json({
    email: user.email,
    role: user.role,
    status: user.status,
    canRequestExpression: user.canRequestExpression,
    authSource: "cloudflare-access",
  });
}

async function getUser(kv, email) {
  if (!kv) return null;
  const value = await kv.get(userKey(email), "json");
  return value && typeof value === "object" ? value : null;
}

async function putUser(kv, user) {
  if (!kv) return;
  await kv.put(userKey(user.email), JSON.stringify(user));
}

function userKey(email) {
  return `user:${sanitizeEmail(email)}`;
}

async function getAccessEmail(context) {
  const accessIdentity = await context.access?.getIdentity?.();
  const accessEmail = sanitizeEmail(accessIdentity?.email);
  if (accessEmail) return accessEmail;
  return sanitizeEmail(context.request.headers.get("cf-access-authenticated-user-email"));
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
