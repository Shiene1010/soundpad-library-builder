# Node: Request Queue Invisible Issue

## Metadata

- id: 20261108-007-request-queue-invisible-issue
- type: issue
- owner: May
- status: complete
- created: 2026-11-08
- updated: 2026-11-08

## Purpose

Record the issue where user expression requests were saved but did not visibly appear in the operator mobile request queue.

## Context

Relevant files:

- `app.js`
- `functions/api/requests.js`
- `index.html`

The product uses Cloudflare Access for identity and `REQUESTS_KV` for server-side expression requests.

## Acceptance Criteria

- Operator can see request queue count.
- Operator can refresh request queue.
- Operator-only queue does not leak to general users.
- Existing server requests render as cards.

## Current State

Resolved by `fix: scope operator request queue` and `fix: harden request queue workflow`.

## Issue Fields

- symptom: Operator request queue appeared unchanged even though user requests had been submitted.
- user-impact: Operator could not confidently review or process submitted expressions.
- reproduction: Submit expression as approved request-enabled user, then inspect operator settings request queue.
- expected-behavior: Operator sees queued requests and count.
- actual-behavior: Operator saw no visible change.
- suspected-owner: Performer
- severity: high

## Open Questions

- Should the operator queue move to its own tab after MVP validation?

## Backpropagation Notes

Future request queue work must verify both storage and operator rendering. A passing server KV check alone is not enough.
