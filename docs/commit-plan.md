# Commit Plan

Use small imperative commits. Keep each commit aligned to one sprint or review result.

## Planned Commits

1. `docs: add project planning and sprint roadmap`
   - Adds project fields, implementation plan, sprint plan, and commit plan.

2. `fix: harden demo user and feedback privacy`
   - Changes default user to pending/request-disabled.
   - Removes browser-supplied email from feedback payload.
   - Records anonymous feedback metadata in GitHub Discussions.
   - Shows manifest fetch failure clearly.

3. `docs: record security posture patch in agent graph`
   - Adds node, edge, and review files for Sprint 1.

4. `docs: add kickoff demo script`
   - Adds a guided script for showing the current prototype.

5. `feat: add local expression request queue`
   - Persists request drafts locally and prepares operator review.

## Commit Message Template

```text
<type>: <imperative summary>

Why:
- <reason>

What changed:
- <change>

Verification:
- <command or manual check>
```
