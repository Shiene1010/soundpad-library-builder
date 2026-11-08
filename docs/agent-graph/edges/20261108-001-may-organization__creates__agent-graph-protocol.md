# Edge: May Organization -> Agent Graph Protocol

## Metadata

- id: 20261108-001-may-organization__creates__agent-graph-protocol
- source: nodes/20261108-001-may-organization.md
- target: README.md
- relation: implemented
- actor: May
- created: 2026-11-08

## Action

May created a Markdown graph protocol so agents communicate through node, edge, and review files rather than untracked chat-only messages.

## Evidence

- Files changed or inspected:
  - `docs/agent-graph/README.md`
  - `docs/agent-graph/templates/node-template.md`
  - `docs/agent-graph/templates/edge-template.md`
  - `docs/agent-graph/templates/review-template.md`
  - `docs/agent-graph/nodes/20261108-001-may-organization.md`
- Commands run:
  - `mkdir -p docs/agent-graph/nodes docs/agent-graph/edges docs/agent-graph/reviews docs/agent-graph/templates`
- Test results:
  - Documentation-only change. No runtime test required.

## Risk

The graph can become busywork if May creates records without using review findings to change future behavior.

## Next Node

Create a demo security patch node before modifying application code.
