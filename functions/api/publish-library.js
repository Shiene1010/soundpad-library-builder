const GITHUB_API = "https://api.github.com";
const OWNER = "Shiene1010";
const REPO = "soundpad-library-builder";
const BRANCH = "main";

export async function onRequestPost(context) {
  const traceId = crypto.randomUUID();
  try {
    const env = context.env;
    const input = await context.request.json();
    if (!env.GITHUB_TOKEN) return json({ error: "github_not_configured", traceId }, 503);

    const operatorEmail = await getOperatorEmail(context);
    if (!isAllowedOperator(operatorEmail, env.OPERATOR_EMAILS)) {
      return json({ error: "operator_access_required", traceId }, 403);
    }

    const library = input.library;
    const manifest = input.manifest;
    const libraryPath = sanitizePath(input.libraryPath);
    if (!library || !manifest || !libraryPath) return json({ error: "missing_publish_payload", traceId }, 400);

    const manifestPath = "libraries/manifest.json";
    const libraryResult = await putFile(env.GITHUB_TOKEN, libraryPath, library, `Publish ${libraryPath}`, traceId);
    const manifestResult = await putFile(env.GITHUB_TOKEN, manifestPath, manifest, "Update library manifest", traceId);

    return json({ library: libraryResult, manifest: manifestResult, operatorEmail, traceId });
  } catch (error) {
    return json({ error: "publish_unhandled_error", traceId, message: sanitizeText(error?.message || String(error), 180) }, 500);
  }
}

async function getOperatorEmail(context) {
  const accessIdentity = await context.access?.getIdentity?.();
  const accessEmail = sanitizeEmail(accessIdentity?.email);
  if (accessEmail) return accessEmail;
  return sanitizeEmail(context.request.headers.get("cf-access-authenticated-user-email"));
}

function isAllowedOperator(email, allowlist) {
  if (!email) return false;
  const allowed = String(allowlist || "")
    .split(",")
    .map((item) => sanitizeEmail(item))
    .filter(Boolean);
  return allowed.includes(email);
}

async function putFile(token, path, data, message, traceId) {
  const existing = await getExistingFile(token, path);
  const body = {
    message,
    branch: BRANCH,
    content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2) + "\n"))),
  };
  if (existing?.sha) body.sha = existing.sha;

  const response = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "content-type": "application/json",
      "user-agent": "soundpad-library-builder",
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(`${path}: ${result.message || "github_put_failed"} (${traceId})`);
  }
  return { path, url: result.content?.html_url };
}

async function getExistingFile(token, path) {
  const response = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "user-agent": "soundpad-library-builder",
    },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${path}: github_get_failed`);
  return response.json();
}

function sanitizePath(path) {
  const value = String(path || "").trim();
  if (!/^libraries\/operator\/chunk-library-[0-9]{8}\.clib\.json$/.test(value)) return "";
  return value;
}

function sanitizeText(value, limit) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, limit);
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
