export async function onRequestGet(context) {
  const email = await getAccessEmail(context);
  const role = isListed(email, context.env.OPERATOR_EMAILS) ? "operator" : "user";
  const approved = role === "operator" || isListed(email, context.env.APPROVED_USER_EMAILS);
  const canRequestExpression = role === "operator" || isListed(email, context.env.REQUEST_ENABLED_EMAILS);

  return json({
    email,
    role: email ? role : "anonymous",
    status: approved ? "approved" : "pending",
    canRequestExpression,
    authSource: email ? "cloudflare-access" : "none",
  });
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
