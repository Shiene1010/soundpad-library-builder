# Project Fields

Use these fields for every May-managed project node, sprint, and review.

## Identity

- `id`: Stable timestamped identifier.
- `title`: Human-readable task name.
- `owner`: May, Performer, Readability, or Fixer.
- `role`: product, implementation, readability, security, operations, or data.
- `status`: proposed, active, blocked, review, complete, superseded.

## Scope

- `problem`: User or operator problem being solved.
- `user`: approved user, request-enabled user, operator, or May team.
- `in_scope`: Work included in the slice.
- `out_of_scope`: Work intentionally deferred.
- `acceptance_criteria`: Observable completion checks.

## Risk

- `security_risk`: low, medium, high.
- `privacy_risk`: low, medium, high.
- `deployment_risk`: low, medium, high.
- `rollback`: How to return to the previous state.

## Evidence

- `files_changed`: Files edited.
- `commands_run`: Verification commands.
- `manual_checks`: Browser or workflow checks.
- `data_signal`: GA4/Sentry/OKR evidence when available.

## Commit Metadata

- `commit_type`: docs, feat, fix, chore, refactor, test.
- `commit_subject`: Imperative one-line summary.
- `commit_body`: Why the change exists and how it was verified.
