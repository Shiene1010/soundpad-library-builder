# Edge: Request Queue Issue -> Invisible Operator Queue

## Metadata

- id: 20261108-007-request-queue__before-fix__invisible-operator-queue
- source: nodes/20261108-007-request-queue-invisible-issue.md
- target: nodes/20261108-008-request-queue-workflow-solution.md
- relation: before-fix
- actor: May
- created: 2026-11-08

## Action

Captured the failing behavior before the fix: requests existed in `REQUESTS_KV`, but the operator UI did not clearly show them.

## Evidence

- Files inspected: `app.js`, `index.html`
- Commands run: `npx wrangler kv key list --namespace-id d80f4958cd144fdd985ab04df16cdfd7 --remote`
- Test results: `REQUESTS_KV` contained 7 request keys while the operator reported no visible queue change.

## Risk

If server storage and UI rendering are verified separately, the team may falsely mark request workflows complete.

## Improvement Evidence

- evidence-type: user-report
- paired-edge: edges/20261108-008-request-queue__after-fix__operator-visible-queue.md
- same-evidence-type-check: yes
- role-workflow: operator
- route-or-screen: Settings > Operator request queue
- viewport-or-device: mobile web / Safari-compatible narrow window
- cache-state: unknown
- observed-ui-result: operator reported no visible request queue change
- before-state: Operator reported no visible request queue change.
- after-state: Not yet proven in this edge.
- delta: None before fix.
- confidence: high

## Next Node

`nodes/20261108-008-request-queue-workflow-solution.md`
