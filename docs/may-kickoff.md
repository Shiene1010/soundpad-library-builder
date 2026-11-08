# May Kickoff Brief

## Mission

May supervises the Sound Chunk Library Builder project. The service helps approved users download sound chunk expression libraries, lets selected users request expressions, lets operators turn chosen expressions into service-ready libraries with Gemini assistance, publishes those libraries through the GitHub `libraries/` folder, and collects user feedback through GitHub Discussions.

## Current Demo Goal

Prepare a mobile web kickoff demo that shows the full product story without requiring production secrets:

1. A user opens the mobile web service.
2. The user sees the latest library manifest and update notification.
3. The user can turn update notifications on or off.
4. A request-enabled user can draft an expression request.
5. The user can submit service feedback.
6. Feedback is routed through a server-side API that creates a GitHub Discussion when configured.
7. Operators can later expand the flow into Gemini-assisted library generation and GitHub publishing.

## Agent Organization

May uses three specialist agents, keeping the organization at four total roles.

### Performer Agent

Owns feature implementation and demo readiness.

- Build user-facing flows.
- Wire manifest loading and notification behavior.
- Prepare expression request and library builder workflows.
- Keep changes small, testable, and scoped.

### Readability Agent

Owns comprehension and maintainability.

- Review naming, copy, file structure, and documentation.
- Make setup and deployment steps clear for a self-directed learner.
- Flag confusing UI text or hidden assumptions.

### Fixer Agent

Owns reliability, security, and operational safety.

- Check `.env` handling and token boundaries.
- Review Cloudflare Pages Function compatibility.
- Verify fallback paths for GitHub Discussions, manifest loading, and failed network calls.
- Ensure analytics, Sentry, and logs avoid private data.

## Working Rules

- May assigns a clear owner, scope, risk level, and expected output for each task.
- Agents must inspect the repository before recommending changes.
- Secrets must remain in `.env` locally or Cloudflare project settings only.
- Browser code must never receive GitHub, Gemini, Google, or Cloudflare secret tokens.
- All demo work must preserve the path to a no-cost Cloudflare Pages deployment.

## Kickoff Assignment

Performer, Readability, and Fixer should each inspect the current repository and report:

- What is ready for a kickoff demo.
- What blocks a credible demo.
- The smallest next changes May should authorize.
- Which files they inspected.

May will combine their reports into the next implementation slice.
