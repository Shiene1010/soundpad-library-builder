# May Demo Directive

## May Summary

The kickoff demo should present a credible mobile web service without pretending that production authentication is already complete. The current app can show library updates, notification settings, expression requests, and GitHub Discussions feedback. Before the demo is expanded, May must correct the security posture and clarify whether a screen is for users or operators.

## Demo Narrative

1. Approved users open the mobile web service.
2. They see available expression libraries from `libraries/manifest.json`.
3. They can turn library update notifications on or off.
4. Only users with `canRequestExpression` enabled can request expressions.
5. Users can submit feedback from settings.
6. Feedback is sent through `/api/feedback` and becomes a GitHub Discussion when the Cloudflare environment is configured.
7. Operators later review requested expressions, use Gemini to draft service-ready chunk data, validate it, and publish `.clib.json` updates to GitHub.

## Agent Orders

### Performer Agent

Prepare the next demo implementation slice.

- Add a clear user/operator mode boundary.
- Add a local demo request queue.
- Add an operator-facing request review area.
- Keep write scope limited to UI and local demo state.

### Readability Agent

Make the project understandable before the next demo.

- Add or improve `README.md`.
- Update `AGENTS.md` so it no longer describes the repository as empty.
- Clarify local run, Cloudflare deploy, and GitHub Discussions setup.
- Make UI copy consistent: user screens should not be labeled as operator screens.

### Fixer Agent

Harden the demo before any public deployment.

- Change default user state to pending and request-disabled.
- Remove raw email submission from browser-controlled feedback payloads.
- Avoid publishing raw emails to public GitHub Discussions.
- Add clearer manifest load failure handling.
- Add idempotency/rate-limit design notes for `/api/feedback`.
- Prefer Git-connected Cloudflare Pages deployment over uploading the whole root folder.

## May's Next Authorized Slice

May authorizes the next local development slice in this order:

1. Security posture patch.
2. Readability patch.
3. Operator demo patch.
4. Verification with `node --check`, local HTTP load, and secret scan.

No production deployment should happen until GitHub repository setup, Cloudflare Pages settings, and secret variables are confirmed.
