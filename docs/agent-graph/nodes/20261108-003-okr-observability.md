# Node: OKR Observability System

## Metadata

- id: 20261108-003-okr-observability
- type: requirement
- owner: May
- status: active
- created: 2026-11-08
- updated: 2026-11-08

## Purpose

Make May responsible for Google-style OKRs and data-centered improvement. Product usage data and operational telemetry should guide team goals, reviews, and flexible team-building.

## Context

The project needs to measure whether users discover library updates, control notifications, submit expression requests safely, and provide feedback. The team also needs to learn from runtime errors and release-specific failures.

Google re:Work describes OKRs as a way to set and communicate goals. GA4 uses events for user interactions, and Sentry-style tooling can organize operational issues by release and environment.

## Acceptance Criteria

- OKR objective and key results are documented.
- GA4 product events are listed with privacy-safe parameters.
- Sentry operational events are listed with severity and context.
- May has a weekly review loop that feeds results back into graph nodes.
- Team-building changes come from data, not vibes alone.

## Current State

`docs/okr-observability.md` defines the first OKR and observability matrix.

## Open Questions

- Which GA4 events should become conversions?
- Should Sentry be connected before or after Cloudflare production deployment?
- Should team effectiveness metrics include cycle time and review rework count?

## Backpropagation Notes

Future reviews should include a "Data Signal" section summarizing GA4/Sentry evidence used in the decision.
