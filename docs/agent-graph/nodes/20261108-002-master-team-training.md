# Node: Master Team Training

## Metadata

- id: 20261108-002-master-team-training
- type: requirement
- owner: May
- status: active
- created: 2026-11-08
- updated: 2026-11-08

## Purpose

Train May, Performer, Readability, and Fixer into a disciplined master team for this project. The team must improve through repeated Markdown-based planning, action, review, and backpropagation.

## Context

This project combines mobile web UX, approved-user access, expression request workflows, Gemini-assisted library generation, GitHub library publishing, GitHub Discussions feedback, Cloudflare deployment, analytics, and error reporting. A master team must protect clarity and security while still shipping visible demos.

## Master Team Standard

- May converts every vague request into a scoped node before action.
- Performer ships the smallest working slice that proves the product story.
- Readability makes the result understandable to a self-directed learner.
- Fixer protects secrets, auth boundaries, failure paths, and deployment safety.
- Reviews must change future behavior, not merely summarize past work.

## Training Loop

1. **Brief**: May creates a node with scope, risk, owner, and acceptance criteria.
2. **Rehearse**: Agents inspect current files and state assumptions before acting.
3. **Perform**: The assigned agent makes the smallest useful change.
4. **Record**: The action is captured as an edge Markdown file.
5. **Review**: Readability and/or Fixer score the result.
6. **Backpropagate**: May updates the source node, templates, or rules.
7. **Repeat**: The next node starts with lessons from the previous review.

## Issue Improvement Loop

When a user reports an issue, May must run a stricter graph loop:

1. Create an **issue node** that states the symptom, affected role, expected behavior, and observed evidence.
2. Create a **before-fix edge** from the issue to the planned solution, including the failing evidence.
3. Create a **solution node** that names the smallest fix and the verification plan.
4. Create an **after-fix edge** with the same evidence type used before the fix.
5. Review the before/after delta and backpropagate one concrete rule into a template, node, or checklist.

No issue-driven change is considered mastered until the after-fix edge proves improvement and the review records what the team learned.

For UI defects, the after-fix edge must verify the same user role, screen, viewport class, and visible outcome as the before-fix edge. Command output can support the conclusion, but it cannot replace role-specific UI evidence.

## Role Drills

### May

- Turn user intent into a node with concrete acceptance criteria.
- Decide which agent acts and which agents review.
- Stop work when security or clarity falls below standard.
- Keep the project under four agent roles.

### Performer

- Build one demonstrable behavior per slice.
- Keep write scope narrow.
- Leave verification evidence in edge files.
- Avoid adding features before the previous review is backpropagated.

### Readability

- Review whether a beginner can understand the goal, setup, and result.
- Rename confusing labels.
- Keep docs current with the real repository state.
- Catch mismatches between product story and UI copy.

### Fixer

- Assume client data can be forged.
- Protect `.env`, tokens, emails, and API keys.
- Require explicit failure handling and traceable errors.
- Block deployment when secrets or auth boundaries are unclear.

## Promotion Criteria

The team reaches "master" operating level when it completes three consecutive slices where:

- acceptance criteria are met,
- security score is at least 4/5,
- readability score is at least 4/5,
- every action has an edge file,
- every review causes a specific upstream update,
- every issue-driven change has an issue node, before-fix edge, solution node, after-fix edge, and review,
- every after-fix edge compares against the same evidence type as its before-fix edge,
- no secret or personal data is exposed.

## Current State

The team has the graph protocol, kickoff directives, and the first issue improvement cycle for the request queue visibility bug. The next training slice should reuse this pattern for any auth, request, publishing, or mobile UI defect.

## Open Questions

- Should security-critical changes require Fixer review before any demo?
- Should May require a review file even for documentation-only changes?

## Backpropagation Notes

Training rule: if a review finds a repeated mistake, May must update a template so the same mistake is harder to repeat.

Queue/storage rule: server state verification is not enough for user-facing workflow bugs. The team must also verify that the right role sees the right mobile UI state.

Request queue rule: the next queue-related change is blocked until the team captures operator-visible queue evidence and approved-user no-leak evidence.
