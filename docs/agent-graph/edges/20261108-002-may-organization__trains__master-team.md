# Edge: May Organization -> Master Team Training

## Metadata

- id: 20261108-002-may-organization__trains__master-team
- source: nodes/20261108-001-may-organization.md
- target: nodes/20261108-002-master-team-training.md
- relation: revised
- actor: May
- created: 2026-11-08

## Action

May converted the user's request to harden the organization into a master team into a formal training node. The training node defines role drills, promotion criteria, and the repeated brief-perform-review-backpropagate loop.

## Evidence

- Files changed or inspected:
  - `docs/agent-graph/nodes/20261108-002-master-team-training.md`
  - `docs/agent-graph/nodes/20261108-001-may-organization.md`
  - `docs/agent-graph/README.md`
- Commands run:
  - `find docs/agent-graph -type f -print | sort`
  - `sed -n '1,220p' docs/agent-graph/README.md`
- Test results:
  - Documentation-only change. No runtime test required.

## Risk

The training loop can become ceremonial unless May enforces promotion criteria and blocks work that lacks node, edge, or review records.

## Next Node

Create a security posture patch node and use it as the first master-team training repetition.
