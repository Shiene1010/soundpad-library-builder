# Repository Guidelines

## Project Structure & Module Organization

This repository is a static-first mobile web prototype for `soundpad-library-builder`. Keep top-level folders predictable:

- `index.html`, `style.css`, and `app.js` contain the current mobile web prototype.
- `functions/api/feedback.js` contains the Cloudflare Pages Function for GitHub Discussions feedback.
- `libraries/manifest.json` is the public sample library manifest.
- `docs/` contains deployment, OKR, May kickoff, and agent-graph documentation.
- `docs/agent-graph/` stores May's Markdown node/edge/review workflow.

Keep generated files, caches, build products, and downloaded dependencies out of version control.

## Build, Test, and Development Commands

No build step is required yet. Use simple static hosting and syntax checks:

- `python3 -m http.server 4173` - serve the mobile web prototype locally.
- `node --check app.js` - validate client JavaScript syntax.
- `node --check functions/api/feedback.js` - validate the Cloudflare Pages Function syntax.

Prefer commands that can run from the repository root without hidden local setup.

## Coding Style & Naming Conventions

Use small, typed modules with explicit ownership boundaries. Prefer immutable bindings (`let` in Swift, `const` in JavaScript/TypeScript) unless mutation is required. Use enums or typed constants instead of loose strings for modes, states, and file categories.

Name Swift types in `PascalCase`, functions and properties in `camelCase`, Python modules in `snake_case`, and test files with the feature under test, such as `AudioLibraryTests.swift` or `test_audio_library.py`.

## Testing Guidelines

Add tests with every behavior change once a test runner is introduced. Until then, run JavaScript syntax checks and manually verify the local mobile web flow. Include edge cases for missing manifests, empty libraries, invalid metadata, duplicate expression requests, failed feedback submission, and disabled permissions.

Prefer null-safe behavior: early guards, optional handling, and empty collections instead of `null`/`nil` results where practical.

## Commit & Pull Request Guidelines

This directory has no Git history yet, so use concise imperative commit messages, for example `Add audio import manifest validation`. Keep each commit focused.

Pull requests should include a short summary, test evidence, linked issue or task when available, and screenshots or sample output for user-visible changes. Call out new dependencies, generated assets, and configuration changes.

## Agent-Specific Instructions

Before changing code, define the time limit and scope. Keep changes small and reviewable. For resilient integrations, use named error types, traceable error messages, exponential backoff with jitter, idempotency keys for repeatable operations, and explicit resource cleanup with `defer`, `finally`, or context managers.

May coordinates multi-agent work through Markdown graph records in `docs/agent-graph/`. Use node files for tasks, artifacts, decisions, and requirements. Use edge files for actions that connect nodes. Use review files to evaluate results and backpropagate lessons into upstream nodes, templates, or rules.

May also owns OKR and observability review. Use `docs/okr-observability.md` to connect Google Analytics product events and Sentry-style operational data to team goals, review findings, and next-slice priorities.

## Security & Configuration

Commit source files, docs, sample data, `.env.example`, and public library artifacts under `libraries/`. Do not commit `.env`, API keys, Google OAuth secrets, Gemini keys, GitHub tokens, local exports, logs, caches, or dependency folders.

Use `.env.example` to document required variables. Developers should copy it to `.env` locally and fill in private values on their machine only.

For user feedback, route submissions through a server-side function before creating GitHub Discussions. Never call GitHub write APIs from browser code with a token.
