# Node: Security Posture Patch

## Metadata

- id: 20261108-005-security-posture-patch
- type: task
- owner: May
- status: complete
- created: 2026-11-08
- updated: 2026-11-08

## Purpose

Harden the current demo before adding more features.

## Context

Fixer identified high-risk prototype defaults: the browser started as an approved request-enabled user, and feedback payloads could include browser-supplied email that became public GitHub Discussion text.

## Acceptance Criteria

- Default user is pending and request-disabled.
- Demo approval is explicit and local-only.
- Legacy approved demo state is normalized unless the demo flag is set.
- Browser feedback payload does not send raw email.
- Feedback API records anonymous metadata and a trace ID.
- Manifest fetch failures are visible in UI.
- README documents local demo approval.

## Current State

Implemented in `app.js`, `functions/api/feedback.js`, `README.md`, and `docs/implementation-sprints.md`.

## Open Questions

- Should Cloudflare Access identity be used to add verified pseudonymous feedback metadata later?
- Should the demo approval flag have a visible reset button?

## Backpropagation Notes

Future auth work must keep client state as display state only. Server-side identity must come from Cloudflare Access, Firebase token verification, or equivalent trusted auth.
