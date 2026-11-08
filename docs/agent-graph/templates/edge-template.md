# Edge: <source> -> <target>

## Metadata

- id:
- source:
- target:
- relation: assigned | implemented | reviewed | revised | blocked-by | depends-on | supersedes | before-fix | after-fix | improves
- actor: May | Performer | Readability | Fixer
- created:

## Action

Describe the concrete action taken between the source and target nodes.

## Evidence

- Files changed or inspected:
- Commands run:
- Test results:

## Risk

State what could go wrong because of this action.

## Improvement Evidence

Use this section for `before-fix`, `after-fix`, or `improves` edges.

- evidence-type: user-report | command-output | screenshot | telemetry | review
- paired-edge:
- same-evidence-type-check: yes | no | not-applicable
- role-workflow: operator | request-enabled-user | approved-user | unapproved-user | public
- route-or-screen:
- viewport-or-device:
- cache-state:
- observed-ui-result:
- before-state:
- after-state:
- delta:
- confidence: low | medium | high

For `after-fix` edges, compare against the paired `before-fix` edge with the same evidence type and the same role workflow. Server evidence may support the result, but it cannot replace user-visible workflow evidence for UI defects.

## Next Node

Name the node that should receive the next update, review, or fix.
