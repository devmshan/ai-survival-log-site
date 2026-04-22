# ai-survival-log-site

`ai-survival-log-site` is the presentation and downstream publishing-consumer layer for content originating from the `ai-survival-log` workflow.

Core flow:
`wiki -> publish -> site/content/posts`

## Role

This repository focuses on:

- rendering published posts
- supporting blog posts, study-series posts, and downstream Instagram expansion
- keeping `content/posts` compatible with the upstream publishing model
- hosting new reader-facing consumers only when they have an explicit contract boundary

This repository is not the primary wiki authoring source of truth.

## Relationship To ai-survival-log

- `ai-survival-log` remains the upstream wiki and authoring system
- this repository consumes publish-ready outputs
- manual writing is allowed here, but content should stay compatible with the publishing contract

## Content Contract

Posts live in `content/posts/*.mdx` and `content/posts/*.md`.

Minimum frontmatter:

- `title`
- `date`
- `tags`
- `description`
- `draft`

Optional fields:

- `thumbnail`
- `series`
- `seriesSlug`
- `seriesOrder`

See [docs/content-contract.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/content-contract.md) for the full contract.
See [docs/operating/consumer-boundaries.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/consumer-boundaries.md) for rules on adding new downstream consumers.
See [docs/2026-04-15-final-consistency-review.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/2026-04-15-final-consistency-review.md) for the final cross-repository consistency review.

## Series Rules

- `seriesSlug` is the series identifier used by the runtime
- if `series` exists, `seriesSlug` is required
- posts without `seriesOrder` are excluded from public series navigation
- draft posts are excluded from public post listings and public series navigation
- duplicate `seriesOrder` values may warn and then fall back to date as a secondary sort key

## Working Principles

- plan before structural changes
- implement the minimum necessary change
- verify before completion
- selectively adopt ECC and superpowers principles only
- keep documents and runtime contracts aligned

## Local Surfaces

- `.claude/`: Claude local surface and lightweight hooks
- `.codex/`: Codex local operating surface
- `AGENTS.md`: repository-wide operating guide
- `CLAUDE.md`: Claude-specific local notes
