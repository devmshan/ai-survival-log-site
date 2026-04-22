# ADR 0003: Manual Posts Must Remain Contract Compatible

## Status

Accepted

## Context

The site repo allows manual posts and local refinements, but runtime behavior and upstream publishing compatibility must remain stable.

## Decision

Allow manual post writing and editing only when content remains contract-compatible.

This includes:

- required frontmatter fields
- stable slug/date expectations
- series metadata rules
- compatibility with runtime loading and presentation behavior

## Consequences

Positive:

- preserves flexibility for presentation-layer authoring
- prevents silent drift from the upstream publishing model

Negative:

- local content edits still require contract-aware review

## Rejected Alternatives

- allow manual posts to invent separate frontmatter conventions
- allow route or metadata behavior to differ for manual posts
- disallow manual posts entirely

These were rejected because they either create reader-facing inconsistency or remove useful site-level flexibility.

## Rollback / Exit Criteria

Revisit this decision only if manual authoring becomes a fully separate product lane with its own documented contract.

Any rollback would require:

- a separate contract definition
- runtime branching for multiple content models
- explicit migration guidance

## Revisit Trigger

Re-review this ADR when:

- manual posts need fields that upstream-generated posts can never provide
- runtime loaders start treating manual and generated posts differently
- content contract summaries reveal recurring drift from the upstream model

## Edge Cases / Non-Goals

This ADR does not mean every manual post must originate upstream first.
It does mean manual posts cannot quietly break route, metadata, or series assumptions.
