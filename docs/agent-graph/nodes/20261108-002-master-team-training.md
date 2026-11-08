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
- no secret or personal data is exposed.

## Current State

The team has the graph protocol and kickoff directives. The next training slice should be the security posture patch.

## Open Questions

- Should security-critical changes require Fixer review before any demo?
- Should May require a review file even for documentation-only changes?

## Backpropagation Notes

Training rule: if a review finds a repeated mistake, May must update a template so the same mistake is harder to repeat.
