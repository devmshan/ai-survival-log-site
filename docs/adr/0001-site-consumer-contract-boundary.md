# ADR 0001: Site Consumer Contract Boundary

## Status

Accepted

## Context

`ai-survival-log-site` consumes content from `ai-survival-log` but also allows manual post authoring. The repository needs a clear boundary between upstream canonical authoring and downstream presentation/runtime responsibility.

## Decision

Treat this repository as a consumer of the upstream publishing flow.

Specifically:

- upstream remains the primary authoring source of truth
- this repository owns rendering, runtime behavior, and presentation compatibility
- manual posts are allowed only when they remain compatible with the publishing contract

## Consequences

Positive:

- keeps repository responsibility clear
- allows local presentation improvements without redefining upstream authoring

Negative:

- requires active contract alignment work
- manual edits must be reviewed for compatibility drift

## Rejected Alternatives

- treat the site as a fully independent authoring system
- allow runtime behavior to evolve without upstream contract review
- forbid all manual posts

These were rejected because they either create silent contract drift or remove practical flexibility the site still needs.

## Rollback / Exit Criteria

Revisit this decision only if:

- upstream publishing is no longer the dominant content source
- contract compatibility no longer matters for most content
- the site requires a fully separate content model

Any rollback would require a documented migration of route, metadata, and content assumptions.

## Revisit Trigger

Re-review this ADR when:

- manual posts begin to outnumber upstream-derived posts
- runtime metadata or routing diverges from upstream assumptions
- a new consumer model is proposed for the site

## Edge Cases / Non-Goals

This ADR does not prohibit manual editing.
It does prohibit manual editing that silently changes contract behavior without documentation.
