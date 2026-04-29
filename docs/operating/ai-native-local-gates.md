# AI-Native Local Gates

## Purpose

This document applies the shared AI-Native Change Management standard from `shared-agent-harness` to `ai-survival-log-site`.

The shared standard defines the common shape.
This file defines the local gate for the downstream runtime and content-consumer repository.

## PR Boundary

Use this repository for:

- rendering published posts
- runtime routing and metadata
- site-facing content contract enforcement
- site-side content compatibility fixes
- derived site state exports
- reader-facing consumer surfaces with explicit contracts

Do not use this repository for:

- upstream source intake
- wiki knowledge graph authoring
- company operational records
- source code or SQL bodies from company systems
- external action approval or audit records

## Required PR Fields

Every non-trivial PR should state:

- goal
- changed runtime or content-contract scope
- source-of-truth boundary
- validation commands
- generated state diff assessment
- warnings, blockers, or escalations
- upstream or downstream handoff when relevant

## Generated Diff Gate

State export must be deterministic in CI.
Use a fixed generated timestamp for validation:

```bash
STATE_GENERATED_AT=1970-01-01T00:00:00.000Z npm run state
git diff --exit-code
```

Local development may run `npm run state` without `STATE_GENERATED_AT`, but tracked state diffs should be reviewed before commit.

## Minimum CI Gate

The minimum CI gate should run on pull requests and pushes to the default branch:

- install dependencies with `npm ci`
- run `npm run lint`
- run `npm test`
- run deterministic state export with `STATE_GENERATED_AT`
- run `npm run build`
- run a tracked diff check

## Local Deny List

Block PRs that introduce:

- credentials, tokens, env dumps, or local secret paths
- company operational records or raw external-system payloads
- ERP source traces, source code, MyBatis XML, Oracle SQL, procedure/function bodies, or DB dumps
- upstream wiki summaries as site-only canonical content
- hand-edited `output/state/*.json` without running the state exporter
- new consumers without an explicit contract boundary

## PR-3 Director Record: 2026-04-29

Status: local gate PR draft started in `ai-survival-log-site` on branch `ai-native-site-gates`.

Specialist findings:

- Exploration reviewer: the repo already separates upstream authoring, site content, runtime, and derived state.
- Harness expert: PR-3 adopts the shared standard locally and keeps the site as a consumer, not the shared rule source.
- Implementation reviewer: the change should be limited to local context, gate docs, CI, and deterministic state export support.
- CI/CD reviewer: `STATE_GENERATED_AT` is required so `npm run state` can participate in a generated diff gate.
- Domain reviewer: company-domain operational material remains out of scope for the site repository.
- Security/boundary reviewer: deny-list items block credentials, raw payloads, source code copies, DB dumps, and unbounded consumer expansion.

Director decision:

- PR-3 can proceed after lint, tests, deterministic state export, build, and generated diff verification.
- The next repository-specific PR should target `company-wiki` and focus on company-common boundary guards, registry checks, and operational status labels.
