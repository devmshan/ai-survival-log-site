# ADR 0004: New Consumers Require Explicit Contracts

## Status

Accepted

## Context

`ai-survival-log-site` may grow beyond standard post rendering into additional reader-facing consumers such as presentation pages or channel companion views.

Without an explicit rule, the site can become a catch-all runtime for unrelated production workflows and silently overload the post contract.

## Decision

Any new official consumer in this repository must declare its contract explicitly before adoption.

Specifically:

- identify the canonical source it consumes
- declare whether it reuses the post contract or needs a new one
- document its runtime boundary
- document its validation path

If a workflow is primarily production-oriented rather than reader-facing, it should stay upstream or move to a separate consumer.

## Consequences

Positive:

- protects the site contract from silent scope creep
- makes new consumer adoption reviewable
- keeps reader-facing runtime concerns separate from production tooling

Negative:

- new consumers require more upfront definition
- some experiments may need to stay unofficial longer

## Rejected Alternatives

- treat every new lane as a site concern by default
- overload `content/posts` with channel-specific fields
- rely on runtime code alone to define consumer boundaries

These were rejected because they create contract drift and make the site harder to reason about.

## Rollback / Exit Criteria

Revisit this decision only if the site intentionally becomes a multi-consumer platform with multiple first-class contracts.

Any rollback requires:

- explicit contract registry
- runtime ownership model for each consumer
- migration guidance for existing content assumptions

## Revisit Trigger

Re-review this ADR when:

- a new consumer cannot fit the existing post contract safely
- route or metadata ownership becomes ambiguous
- multiple reader-facing consumers start sharing only a small subset of assumptions

## Edge Cases / Non-Goals

This ADR does not ban experimentation.
It does require official consumers to document their boundaries before they become part of the maintained harness.
