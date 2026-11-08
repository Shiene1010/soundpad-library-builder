# Node: Project Documentation

## Metadata

- id: 20261108-004-project-documentation
- type: artifact
- owner: May
- status: complete
- created: 2026-11-08
- updated: 2026-11-08

## Purpose

Document the project so a new contributor can understand the product, current prototype, file structure, local run commands, deployment path, privacy rules, and May-led agent workflow.

## Context

The repository had strong supporting docs but no root `README.md`. `AGENTS.md` also still described the repository as an empty scaffold even though the prototype now includes a mobile web app, feedback function, manifest sample, deployment notes, OKR plan, and agent graph.

## Acceptance Criteria

- Root `README.md` exists.
- README explains purpose, status, structure, local development, configuration, deployment, privacy, agent workflow, and next priorities.
- `AGENTS.md` reflects the current repository structure.
- Documentation warns that feedback identity handling is still prototype-level.

## Current State

`README.md` has been added and `AGENTS.md` has been updated.

## Open Questions

- Should the README include screenshots after the next UI pass?
- Should a separate `docs/demo-script.md` guide kickoff demonstrations?

## Backpropagation Notes

Documentation should be updated whenever the app gains real authentication, persistent request storage, Gemini generation, or GitHub publishing.
