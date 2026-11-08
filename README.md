# Sound Chunk Library Builder

Mobile-first web service for managing Sound Chunk expression libraries. The service is designed for approved users, selected expression requesters, and operators who turn requested or curated expressions into downloadable `.clib.json` libraries.

## Current Status

This repository is an early static-first prototype. It currently demonstrates:

- library manifest loading from `libraries/manifest.json`
- update notification on/off settings
- expression request UI gated by a local demo approval flag
- feedback submission through a Cloudflare Pages Function
- GitHub Discussions fallback when automated feedback submission is not configured
- May-led agent workflow, OKR, and observability documentation

Production authentication, Gemini generation, GitHub library publishing, and persistent request storage are planned but not yet implemented.

Public demo:

```text
https://soundpad-library-builder.pages.dev/
https://shiene1010.github.io/soundpad-library-builder/
```

GitHub repository:

```text
https://github.com/Shiene1010/soundpad-library-builder
```

## Project Structure

```text
.
├── index.html                 # Mobile web shell
├── style.css                  # Mobile UI styles
├── app.js                     # Client-side demo behavior
├── functions/api/feedback.js  # Cloudflare Pages Function for GitHub Discussions
├── libraries/manifest.json    # Public library manifest sample
├── docs/
│   ├── deployment.md          # Cloudflare/GitHub deployment notes
│   ├── okr-observability.md   # May-owned OKR and telemetry plan
│   └── agent-graph/           # Markdown node/edge/review workflow
├── .env.example               # Required environment variable names
└── .gitignore                 # Secret/build/cache exclusions
```

## Local Development

Run a local static server from the repository root:

```sh
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/
```

For the local demo-only approved user state, open:

```text
http://127.0.0.1:4173/?demo=approved
```

Check JavaScript syntax:

```sh
node --check app.js
node --check functions/api/feedback.js
```

## Configuration

Copy `.env.example` to `.env` for local secrets. Never commit `.env`.

Important variables:

- `GITHUB_TOKEN`
- `GITHUB_REPOSITORY_ID`
- `GITHUB_DISCUSSION_CATEGORY_ID`
- `GEMINI_API_KEY`
- `GA_MEASUREMENT_ID`
- `SENTRY_DSN`

Production secrets should live in Cloudflare project settings or an equivalent secret store, not in browser code.

## Deployment

Current production deployment: Cloudflare Pages.

Static fallback deployment: GitHub Pages.

See [docs/deployment.md](docs/deployment.md) for setup steps. Prefer Git-connected Cloudflare Pages deployment over uploading the entire project root manually, because direct root uploads can accidentally include local files if not reviewed.

## Data and Privacy

Public files may include source code, docs, `.env.example`, and library artifacts under `libraries/`. Do not commit API keys, tokens, raw user emails, private expression request text, logs, local exports, or `.env` files.

Feedback is intended to flow through `functions/api/feedback.js` so GitHub tokens remain server-side. Current feedback identity handling is still prototype-level and must be hardened before public deployment.

## Agent Workflow

May coordinates the project through Markdown graph records:

- nodes: tasks, decisions, requirements, and artifacts
- edges: actions connecting nodes
- reviews: evaluation and backpropagation

Start with [docs/agent-graph/README.md](docs/agent-graph/README.md), then review [docs/okr-observability.md](docs/okr-observability.md) for the team objective and data-centered improvement loop.

## Next Priorities

1. Add README-linked setup screenshots or demo script.
2. Separate user-facing and operator-facing demo flows.
3. Add local expression request queue.
4. Add Gemini-assisted library draft generation behind operator review.
5. Add GitHub `libraries/` publishing workflow.
