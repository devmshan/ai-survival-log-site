# ADR 0002: Harness Layering for the Site Repo

## Status

Accepted

## Context

The site repository needs top-level guidance for Claude and Codex while keeping detailed rules maintainable and aligned.

## Decision

Adopt a layered harness model.

Top-level documents:

- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `ARCHITECTURE.md`

Detailed documents:

- `docs/operating/ui-guide.md`
- `docs/operating/content-contract.md`
- `docs/operating/seo-operations.md`
- `docs/adr/*.md`

Agent surface policy:

- `AGENTS.md` contains shared top-level operating rules
- `CLAUDE.md` inherits `AGENTS.md` and adds Claude-specific notes
- `.codex/AGENTS.md` stays compact and points to shared detailed docs

## Consequences

Positive:

- shared rules stay aligned between Claude and Codex
- top-level guides remain compact

Negative:

- links and document ownership must be maintained carefully

## Rejected Alternatives

- keep all operating rules inside `AGENTS.md`
- maintain separate full rulebooks for Claude and Codex
- document UI, SEO, and contract rules only in code comments or runtime behavior

These were rejected because they create drift, overload top-level surfaces, or hide rules from operators.

## Rollback / Exit Criteria

Revisit this decision only if the layered model stops improving clarity.

Rollback signals include:

- conflicting rules across top-level and detailed docs
- operators cannot tell which document owns UI, SEO, or contract policy
- agent surfaces start diverging from shared rules

## Revisit Trigger

Re-review this ADR when:

- a new top-level agent surface is added
- docs ownership becomes ambiguous
- layered documents stop matching actual runtime behavior

## Edge Cases / Non-Goals

This ADR does not require every detail to live in `AGENTS.md`.
It also does not justify duplicating full operating rules into every agent-specific surface.
