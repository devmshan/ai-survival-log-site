# Content Contract Guide

## Purpose

This document is the operating view of the content contract for `ai-survival-log-site`.

Use this document for:

- frontmatter requirements
- series metadata rules
- runtime compatibility expectations
- manual post authoring boundaries
- deciding whether a new reader-facing workflow can still use the existing post contract

## Post Compatibility

Posts in `content/posts/*.mdx` and `content/posts/*.md` may be written manually, but must remain compatible with the upstream publishing model.

Preserve:

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

## Series Rules

- `seriesSlug` is the runtime-facing series identifier
- if `series` exists, `seriesSlug` is required
- posts without `seriesOrder` are excluded from public series navigation
- draft posts are excluded from public listings and public series navigation
- duplicate `seriesOrder` values may warn and then fall back to date as a secondary sort key

## Runtime Alignment

Content contract rules must stay aligned with:

- post loading behavior
- metadata rendering
- series navigation behavior
- sitemap and SEO-facing output

If a new downstream workflow cannot reuse these assumptions safely, treat it as a new consumer boundary question rather than forcing it into the post contract.

## Verification

When content contract rules change:

- run the content contract verification script
- refresh derived state with `npm run state`
- review affected tests
- check whether runtime code and docs still describe the same behavior
- use [validation-matrix.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/validation-matrix.md) to decide the minimum required checks for each change type

## Failure Policy

Classify verification outcomes as `warn`, `block`, or `escalate`.

### `warn`

Use `warn` when content remains valid but quality or consistency has drifted.

Examples:

- duplicate `seriesOrder` values with deterministic fallback still working
- missing optional thumbnail
- manual post wording drifting from upstream tone guidance without breaking metadata

### `block`

Use `block` when routing, metadata, or rendering contracts are broken.

Examples:

- malformed frontmatter
- missing required `title`, `date`, `tags`, `description`, or `draft`
- `series` present without `seriesSlug`
- broken date-prefixed internal post links
- content contract summary reporting invalid posts

Blocked work should not be treated as complete until fixed.

### `escalate`

Use `escalate` when the change intentionally alters the contract itself.

Examples:

- changing required frontmatter fields
- changing public route format
- allowing a new image path convention
- changing runtime behavior in a way that no longer matches upstream publish assumptions

Escalated changes should update the relevant ADR or contract documents in the same change set.

## Common Error Cases

Treat these as first-class operating cases:

- malformed frontmatter
- date/slug mismatch in post routes
- duplicate slugs across published content
- `series` with missing `seriesSlug`
- missing thumbnail where social-preview quality matters
- broken image paths
- manual post and generated post contract drift
- partial state generation failure

## Related Docs

- [ARCHITECTURE.md](/Users/ms/workspace/claude/ai-survival-log-site/ARCHITECTURE.md)
- [docs/content-contract.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/content-contract.md)
- [docs/operating/seo-operations.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/seo-operations.md)
- [docs/operating/validation-matrix.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/validation-matrix.md)
- [docs/operating/consumer-boundaries.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/consumer-boundaries.md)
