# Implementation Plan

## Product Goal

Build a mobile web service where approved users download Sound Chunk expression libraries, selected users request expressions, operators convert expressions into service-ready libraries with Gemini assistance, and updates are published through the repository `libraries/` folder.

## Architecture

- Static mobile web app: `index.html`, `style.css`, `app.js`
- Feedback API: `functions/api/feedback.js`
- Public library manifest: `libraries/manifest.json`
- Deployment: Cloudflare Pages with Pages Functions
- Feedback storage: GitHub Discussions
- Future data storage: Cloudflare KV/D1 or GitHub-backed JSON
- Future auth: Google login through Cloudflare Access or Firebase Auth

## Implementation Phases

### Phase 1: Safe Demo Foundation

- Harden default user state.
- Prevent raw email exposure in public feedback.
- Keep GitHub tokens server-side.
- Document local run and deployment.
- Verify with syntax checks and local HTTP load.

### Phase 2: Operator Demo Flow

- Add user/operator mode boundary.
- Add local expression request queue.
- Add operator request review view.
- Add library draft validation view.

### Phase 3: Library Builder

- Add editable chunk/tone/ccq fields.
- Add `.clib.json` preview and export.
- Add manifest update preview.
- Add validation rules for missing chunks, duplicate IDs, and empty tone/ccq data.

### Phase 4: Gemini Assistance

- Add operator-owned Gemini key handling.
- Generate draft chunk/tone/ccq JSON.
- Require operator review before library inclusion.
- Redact expression text from logs and telemetry.

### Phase 5: GitHub Publishing and Observability

- Publish library artifacts to `libraries/`.
- Update `manifest.json`.
- Add GA4 event wrapper.
- Add Sentry-style error wrapper.
- Review OKR data in May graph reviews.

## Non-Negotiables

- No `.env` or token commits.
- No GitHub write token in browser code.
- No raw user email in public Discussions.
- No production deployment without Fixer review.
- Every meaningful task needs a node, edge, and review.
