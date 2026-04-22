# Validation Matrix

## Purpose

This document defines the minimum required verification for common change types in `ai-survival-log-site`.

Use it to turn "verify the changed scope" into explicit operating checks.

## Severity Rules

- `warn`: the change can proceed, but follow-up quality work is still needed
- `block`: do not complete the change until the issue is fixed
- `escalate`: update contract docs or ADRs in the same change set

## Change Types

### Post Content Edit

Examples:

- manual MDX rewrite
- downstream cleanup of a published post
- title, intro, or related-link edits

Required checks:

- review against `docs/content-seo-guide.md`
- verify full date-prefixed internal post links
- run `npm run state`

Typical severity:

- weak SEO polish: `warn`
- missing required summary or broken internal links: `block`

### Content Contract Change

Examples:

- frontmatter requirements
- series metadata behavior
- route assumptions

Required checks:

- relevant contract or runtime tests
- `npm run state`
- review `output/state/content-contract-summary.json`
- confirm docs and runtime still describe the same behavior

Typical severity:

- accidental contract drift: `block`
- deliberate contract break: `escalate`

### State Export Change

Examples:

- `scripts/state` logic changes
- `output/state/*.json` schema changes

Required checks:

- `npx vitest run scripts/state.test.mjs`
- `npm run state`
- review tracked `output/state/*.json` diffs
- update architecture or ADR docs if schema changes

Typical severity:

- non-deterministic tracked output: `block`
- backward-compatible field addition: `warn` unless a consumer depends on strict schema
- field removal, rename, or semantic change: `escalate`

### SEO-Sensitive Runtime Change

Examples:

- metadata generation
- canonical URL handling
- sitemap behavior
- structured data

Required checks:

- relevant tests for the changed code
- `npm run state`
- review metadata, canonical URL, and sitemap behavior
- check consistency with `docs/content-seo-guide.md` and `docs/operating/seo-operations.md`

Typical severity:

- copy quality drift with correct metadata shape: `warn`
- broken canonical URL, sitemap omission, or metadata mismatch: `block`
- intentional metadata convention change: `escalate`

### UI or Rendering Change

Examples:

- component changes
- MDX rendering changes
- series navigation changes

Required checks:

- relevant tests for the changed code
- manual mobile/readability review for affected pages
- confirm no contract drift with `docs/operating/content-contract.md`

Typical severity:

- visual polish gap with intact reading flow: `warn`
- broken rendering, unreadable layout, or hidden navigation: `block`
- intentional fallback or presentation contract change: `escalate`

### Agent Surface Change

Examples:

- `AGENTS.md`
- `CLAUDE.md`
- `.codex/AGENTS.md`
- operating document references

Required checks:

- confirm consistency with `ARCHITECTURE.md`
- `npm run state`
- review `output/state/content-contract-summary.json` if content-facing rules changed

Typical severity:

- wording improvement with no rule drift: `warn`
- contradictory cross-surface rules: `block`
- intentional divergence between Claude and Codex guidance: `escalate`

### New Consumer Or Presentation Workflow

Examples:

- presentation landing pages
- YouTube companion pages
- alternate reader-facing content views

Required checks:

- define the consumer in `docs/operating/consumer-boundaries.md` or an equivalent PRD
- confirm whether the existing post contract still applies
- define route, metadata, and validation ownership
- update architecture docs if repository boundaries change

Typical severity:

- exploratory prototype with no official contract status: `warn`
- official consumer with undocumented route or metadata behavior: `block`
- consumer that needs a new contract or new canonical source: `escalate`

## Notes

- If a change spans multiple categories, run the union of required checks.
- When in doubt, choose the stricter validation path.
