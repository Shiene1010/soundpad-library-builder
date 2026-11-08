# Implementation Sprints

## Sprint 1: Security Posture Patch

- Owner: May + Fixer
- Goal: Make the current demo safer before adding new features.
- Scope:
  - Default user is pending and request-disabled. Done.
  - Demo approval is explicit through a local demo flag. Done via `?demo=approved`.
  - Feedback API ignores browser-supplied email. Done.
  - GitHub Discussion body records anonymous metadata only. Done.
  - Manifest fetch failure is visible to the user. Done.
- Verification:
  - `node --check app.js`
  - `node --check functions/api/feedback.js`
  - secret/privacy string scan

## Sprint 2: Readable Demo Surface

- Owner: Readability
- Goal: Separate user-facing and operator-facing language.
- Scope:
  - Update confusing `Operator Console` label.
  - Add `docs/demo-script.md`.
  - Add README note for demo approval mode.
- Verification:
  - Manual UI copy review.
  - README consistency check.

## Sprint 3: Local Request Queue

- Owner: Performer
- Goal: Let expression requests persist locally for operator review.
- Scope:
  - Save requests to localStorage.
  - Add request list.
  - Add status values: new, reviewing, approved, rejected.
- Verification:
  - Submit request, reload page, confirm persistence.
  - Validate disabled request path.

## Sprint 4: Operator Review and Library Draft

- Owner: Performer + Fixer
- Goal: Convert approved requests into draft library entries.
- Scope:
  - Add operator review tab.
  - Add draft chunk/tone/ccq editor.
  - Add validation summary.
- Verification:
  - Missing field checks.
  - Duplicate ID checks.

## Sprint 5: Publishing and Telemetry

- Owner: May + Fixer
- Goal: Prepare real deployment and operations.
- Scope:
  - GitHub publishing design.
  - GA4 event wrapper.
  - Sentry error wrapper.
  - May OKR review loop.
- Verification:
  - No secrets in browser bundle.
  - Observability events match `docs/okr-observability.md`.
