# Agent Graph Protocol

May coordinates agents through Markdown graph records. Every meaningful task, artifact, decision, action, and review is represented as a Markdown node or edge so the team can evaluate work repeatedly and improve its own process.

## Graph Objects

- **Node Markdown**: a stateful object such as a task, requirement, artifact, decision, agent brief, or review result.
- **Edge Markdown**: a directed action linking one node to another, such as `assigned`, `implemented`, `reviewed`, `blocked-by`, `revised-by`, or `supersedes`.
- **Review Markdown**: an evaluation record that scores a result and feeds lessons backward into earlier nodes.

## Directory Layout

```text
docs/agent-graph/
  nodes/       task, artifact, decision, and agent nodes
  edges/       action records connecting nodes
  reviews/     evaluation and backpropagation records
  templates/   reusable Markdown templates
```

## May Workflow

1. May creates or selects a source node.
2. May assigns work by creating an edge from the source node to an agent/task node.
3. The responsible agent records actions as edge Markdown files.
4. Results become new node Markdown files.
5. Readability and Fixer review result nodes.
6. May writes or approves a review Markdown file.
7. Review lessons are backpropagated into source nodes, templates, and future directives.

## Naming

Use timestamped, readable IDs:

```text
nodes/20261108-001-kickoff-demo.md
edges/20261108-001-kickoff-demo__implemented-by__performer.md
reviews/20261108-001-kickoff-demo-review.md
```

## Backpropagation Rule

Every review must answer:

- What changed?
- What worked?
- What failed or confused users?
- Which upstream node needs revision?
- Which template or rule should change before the next task?

May does not treat reviews as summaries only. Reviews must update the working memory of the organization by changing a node, edge, template, or directive.

## Issue Improvement Graph

When an issue appears, May must create a self-improvement graph cycle before treating the work as complete:

```text
issue node -> before edge -> solution node -> after edge -> review -> backpropagation
```

- **Issue node**: records the symptom, user impact, reproduction path, expected behavior, and suspected ownership.
- **Before edge**: records the failing behavior, evidence, missed signal, and which team rule failed.
- **Solution node**: records the implemented fix, acceptance criteria, tests, and rollout notes.
- **After edge**: compares post-fix behavior against the before edge using the same evidence type, role, screen, and visible outcome.
- **Review**: scores the fix and updates upstream templates, agent briefs, or operating rules.

May owns the issue node and review. Performer owns implementation evidence. Readability owns user-facing clarity. Fixer owns regression, security, and resilience checks.

No issue is considered mastered until the after edge proves improvement over the before edge and the review backpropagates at least one concrete lesson into a node, edge, template, or rule. For UI defects, command output supports the review but cannot replace role-specific visible evidence.

## Master Team Training

May trains the organization through repeated graph cycles:

```text
brief node -> action edge -> result node -> review -> backpropagation -> next node
```

The team reaches master operating level after three consecutive slices where acceptance criteria are met, security and readability each score at least 4/5, every action has an edge file, every review backpropagates a concrete lesson, and no secret or personal data is exposed.

For issue-driven work, the master standard additionally requires three consecutive issue cycles with complete issue nodes, before edges, solution nodes, after edges, and reviews where the same issue class does not recur.

The current training standard lives in `nodes/20261108-002-master-team-training.md`.
