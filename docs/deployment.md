# Deployment Guide

## Recommended Service

Use Cloudflare Pages for this mobile web service. It fits the current static-first app, supports Pages Functions for `/api/feedback`, and can deploy with `npx wrangler pages deploy . --project-name soundpad-library-builder`.

## GitHub Discussions Feedback

Feedback submission uses `functions/api/feedback.js`, which calls the GitHub GraphQL API from the server side. Do not expose `GITHUB_TOKEN` in browser code.

Required Cloudflare environment variables:

- `GITHUB_TOKEN`
- `GITHUB_REPOSITORY_ID`
- `GITHUB_DISCUSSION_CATEGORY_ID`
- `GEMINI_API_KEY`
- `OPERATOR_EMAILS`
- `APPROVED_USER_EMAILS`
- `REQUEST_ENABLED_EMAILS`

The token should be fine-grained where possible and limited to the target repository. Enable GitHub Discussions on the repository before deployment.

## Cloudflare Access Operator Gate

Protect the Pages project with Cloudflare Access and Google login before enabling operator publishing. The publish Function reads the authenticated Access identity through `ctx.access.getIdentity()` when available and falls back to the `Cf-Access-Authenticated-User-Email` header. Only emails listed in comma-separated `OPERATOR_EMAILS` may call `/api/publish-library`.

User approval lists are also environment-driven for the current slice:

- `APPROVED_USER_EMAILS`: approved users who can use the service.
- `REQUEST_ENABLED_EMAILS`: users allowed to submit expression requests.
- `OPERATOR_EMAILS`: operators who can publish libraries.

## Deploy Steps

1. Create a GitHub repository named `soundpad-library-builder`.
2. Enable Discussions and create a feedback category.
3. Add Cloudflare Pages project from the GitHub repository.
4. Set build command to blank and output directory to `/`.
5. Add the required environment variables in Cloudflare.
6. Deploy.

Direct upload alternative:

```sh
npx wrangler pages deploy . --project-name soundpad-library-builder
```

## Privacy Rules

Do not commit `.env`, API keys, GitHub tokens, Google OAuth secrets, Sentry DSNs for private projects, or raw user emails in analytics events. Store production secrets only in Cloudflare project settings.
