# Edge: Project Documentation -> README and AGENTS

## Metadata

- id: 20261108-004-documentation__updates__readme-agents
- source: nodes/20261108-004-project-documentation.md
- target: ../../README.md and ../../AGENTS.md
- relation: implemented
- actor: May
- created: 2026-11-08

## Action

May added root project documentation and corrected contributor guidance to match the current prototype.

## Evidence

- Files changed or inspected:
  - `README.md`
  - `AGENTS.md`
  - `app.js`
  - `functions/api/feedback.js`
  - `docs/deployment.md`
  - `docs/okr-observability.md`
  - `.env.example`
  - `libraries/manifest.json`
- Commands run:
  - `find . -maxdepth 3 -type f -print | sort`
  - `sed -n` inspections of project docs and source files
- Test results:
  - Documentation-only change. Runtime checks follow in the review.

## Risk

The README may drift if the next security posture patch changes user defaults, feedback identity handling, or deployment process.

## Next Node

Run documentation review and then start the security posture patch.
