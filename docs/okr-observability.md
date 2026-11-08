# OKR and Observability Plan

## Purpose

May owns data-centered improvement for this project. The team uses Google-style OKRs, Google Analytics product events, and Sentry-style operational telemetry to improve the product and the agent organization.

## Team Objective

Master the Sound Chunk Library Builder project by shipping safe, understandable, data-informed improvements.

## Key Results

1. Three consecutive graph-managed slices meet acceptance criteria.
2. Security and readability review scores stay at 4/5 or higher.
3. At least 80% of approved users see the latest library update banner.
4. At least 50% of users who see a new library choose download or dismiss intentionally.
5. Expression request submissions produce zero personal-data leaks.
6. Feedback submissions either create GitHub Discussions or show a clear fallback.
7. Production errors are triaged by release and environment before the next slice.

## Google Analytics Event Matrix

Use GA4 for product behavior. Do not send raw email, API keys, expression text, or private feedback body.

| Event | Trigger | Parameters |
|---|---|---|
| `library_manifest_checked` | Manifest fetch attempted | `result`, `latest_version` |
| `library_update_seen` | Update banner shown | `latest_version`, `user_role` |
| `library_download_clicked` | User chooses download | `library_id`, `version` |
| `notification_enabled` | User turns alerts on | `user_role` |
| `notification_disabled` | User turns alerts off | `user_role` |
| `expression_request_started` | Request form opened | `can_request_expression` |
| `expression_request_submitted` | Request submitted | `request_source`, `validation_result` |
| `feedback_started` | Feedback form opened | `user_role` |
| `feedback_submitted` | Feedback API accepted | `result` |
| `operator_library_published` | Operator publishes manifest | `version`, `count` |

## Sentry Event Matrix

Use Sentry or an equivalent error service for operational health. Redact user text and secrets before capture.

| Event/Error | Severity | Required Context |
|---|---|---|
| `manifest_fetch_failed` | warning | `release`, `environment`, `status` |
| `feedback_api_failed` | error | `trace_id`, `github_status`, `environment` |
| `github_discussion_failed` | error | `trace_id`, `category_configured` |
| `auth_state_invalid` | error | `provider`, `environment` |
| `library_validation_failed` | warning | `rule_id`, `library_version` |
| `gemini_generation_failed` | warning | `trace_id`, `operator_mode` |

## Weekly May Review

May creates one review node per cycle:

1. Read GA4 product events.
2. Read Sentry errors by release and environment.
3. Compare data against OKR key results.
4. Identify the weakest project or team behavior.
5. Backpropagate one improvement into a node, template, or rule.
6. Assign the next smallest slice.

## Privacy Rules

- Never collect raw email in public analytics.
- Never collect Gemini keys, GitHub tokens, Google OAuth secrets, or Cloudflare secrets.
- Hash or omit user identifiers unless a signed-in backend has a clear need.
- Store production secrets only in Cloudflare settings or equivalent secret storage.
- Treat expression requests as potentially personal data.
