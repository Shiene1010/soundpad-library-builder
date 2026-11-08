# Node: May Agent Organization

## Metadata

- id: 20261108-001-may-organization
- type: decision
- owner: May
- status: active
- created: 2026-11-08
- updated: 2026-11-08

## Purpose

Define how May supervises the project through Markdown-based agent communication, action tracing, and review backpropagation.

## Context

The project needs a small agent organization with four roles or fewer:

- May: main supervising agent
- Performer: implementation agent
- Readability: comprehension and documentation agent
- Fixer: security, reliability, and bug-fix agent

All coordination should remain inspectable in Markdown files so a self-directed learner can follow the work.

## Acceptance Criteria

- Every important task has a node Markdown file.
- Every important action has an edge Markdown file.
- Every result is evaluated with a review Markdown file.
- Review findings update upstream nodes, templates, or rules.
- May keeps the organization to four roles or fewer.

## Current State

May has created the first protocol and templates under `docs/agent-graph/`.

## Open Questions

- Should review scores be weighted differently for security-critical tasks?
- Should demo work require both Readability and Fixer reviews before merge?

## Backpropagation Notes

Initial rule: no production deployment until a review node explicitly passes security and secret-handling criteria.
