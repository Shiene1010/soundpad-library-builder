const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export async function onRequestPost(context) {
  try {
    const env = context.env;
    const input = await context.request.json();
    const title = sanitizeText(input.title, 120);
    const body = sanitizeText(input.body, 4000);
    const traceId = crypto.randomUUID();

    if (!title || !body) return json({ error: "missing_feedback_fields" }, 400);
    if (!env.GITHUB_TOKEN || !env.GITHUB_REPOSITORY_ID || !env.GITHUB_DISCUSSION_CATEGORY_ID) {
      return json({ error: "feedback_not_configured" }, 503);
    }

    const discussionBody = [
      body,
      "",
      "---",
      "submittedBy: anonymous",
      `submittedAt: ${new Date().toISOString()}`,
      `traceId: ${traceId}`,
    ].join("\n");

    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "content-type": "application/json",
        "user-agent": "soundpad-library-builder",
      },
      body: JSON.stringify({
        query: `
          mutation CreateDiscussion($input: CreateDiscussionInput!) {
            createDiscussion(input: $input) {
              discussion { id url }
            }
          }
        `,
        variables: {
          input: {
            repositoryId: env.GITHUB_REPOSITORY_ID,
            categoryId: env.GITHUB_DISCUSSION_CATEGORY_ID,
            title,
            body: discussionBody,
          },
        },
      }),
    });

    const result = await response.json();
    if (!response.ok || result.errors) return json({ error: "github_discussion_failed", traceId }, 502);
    return json({ url: result.data.createDiscussion.discussion.url, traceId });
  } catch {
    return json({ error: "feedback_unhandled_error" }, 500);
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
