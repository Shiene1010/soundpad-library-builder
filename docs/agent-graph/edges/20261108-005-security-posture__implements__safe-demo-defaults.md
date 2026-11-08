# Edge: Security Posture Patch -> Safe Demo Defaults

## Metadata

- id: 20261108-005-security-posture__implements__safe-demo-defaults
- source: nodes/20261108-005-security-posture-patch.md
- target: ../../app.js and ../../functions/api/feedback.js
- relation: implemented
- actor: May
- created: 2026-11-08

## Action

May implemented the first security posture patch by changing default user state, adding explicit local demo approval, removing browser-supplied email from feedback, anonymizing GitHub Discussion metadata, and surfacing manifest fetch failure.

## Evidence

- Files changed or inspected:
  - `app.js`
  - `functions/api/feedback.js`
  - `README.md`
  - `docs/implementation-sprints.md`
- Commands run:
  - `node --check app.js`
  - `node --check functions/api/feedback.js`
  - `rg -n "pending@example.com|userEmail|submittedBy: \\$|GITHUB_TOKEN|GEMINI_API_KEY|SENTRY_DSN|GA_MEASUREMENT_ID|approved" app.js functions README.md docs .env.example`
  - `curl -I http://127.0.0.1:4173/`
  - `curl -s http://127.0.0.1:4173/libraries/manifest.json`
- Test results:
  - JavaScript syntax checks passed.
  - No raw token values found; token strings appear only as environment variable names or server-side references.
  - Local HTTP root returned 200.
  - Manifest loaded over HTTP.

## Risk

The demo approval flag is intentionally local and not real authorization. Public deployment still requires Cloudflare Access or Firebase-backed identity enforcement.

## Next Node

Run verification and review before starting operator demo work.
