# AI Survival Log Site Architecture

## Role

`ai-survival-log-site` is the downstream presentation and publishing-consumer layer for content originating from `ai-survival-log`.

Primary flow:
`wiki -> publish -> site/content/posts`

This repository is not the primary wiki authoring source of truth. Its responsibility is to consume published outputs, render them clearly, and maintain runtime compatibility with the upstream publishing contract.

## Document Precedence

When repository documents overlap, follow this order:

1. `AGENTS.md`
2. `ARCHITECTURE.md`
3. `docs/operating/*`
4. domain-specific contract docs such as `docs/content-seo-guide.md`
5. `docs/adr/*`

`CLAUDE.md` and `.codex/AGENTS.md` adapt these rules for their execution surfaces. They must stay aligned with shared repository rules.

## Core Boundaries

### Upstream vs Downstream

- upstream authoring and canonical publishing inputs live in `ai-survival-log`
- this repository consumes publish-ready content
- manual content edits are allowed here, but they must remain contract-compatible

### Canonical vs Derived

- `content/posts/` is the runtime-facing content layer for the site
- docs explain rules and contracts, but do not replace runtime behavior
- `output/state/` is reserved for derived machine-readable state, not source-of-truth content

## Layer Model

### 1. Upstream Publish Input

- published wiki pages and upstream publish artifacts originate in `ai-survival-log`
- stable `slug`, `description`, and series metadata must survive the handoff

### 2. Site Content Layer

- `content/posts/*.mdx` and `content/posts/*.md`
- posts are consumed by the runtime and can be written manually when needed
- manual content must still respect the content contract

### 3. Runtime Layer

- Next.js runtime, routing, metadata, sitemap, and rendering logic
- series navigation, related content, and page presentation live here

### 4. Derived State Layer

- `output/state/` contains machine-readable summaries such as content inventories and contract summaries
- derived state must be reproducible from runtime-facing content and contract rules

## Consumer Expansion Boundary

When new downstream consumers are considered, preserve the same boundary model:

- canonical authoring still originates upstream unless a separate contract is approved
- site consumers must declare whether they reuse the post contract or require a new one
- reader-facing runtime additions belong here only when they fit the site's consumer role

Do not let the site become a catch-all production workflow for channels that are not primarily reader-facing runtime concerns.

## Contract Boundaries

Preserve:

- frontmatter conventions for posts
- stable slugs and dates
- series metadata rules
- agreement between runtime behavior and contract docs

When images are involved:

- preserve downstream-served image paths like `/images/{slug-or-series}/{file}.png`
- keep presentation-facing paths compatible with upstream expectations

## Agent Surface Model

Top-level operating surfaces:

- `README.md` explains repo role and contract boundary
- `AGENTS.md` defines cross-agent top-level rules
- `CLAUDE.md` inherits `AGENTS.md` and adds Claude-specific behavior
- `.codex/AGENTS.md` provides a compact Codex-safe operating view

Detailed rules should live outside those top-level files:

- architecture and contract boundaries in `ARCHITECTURE.md`
- UI and content operations in `docs/operating/*`
- long-lived design decisions in `docs/adr/`

## Contract Severity

Use these policy levels when evaluating changes:

- `warn`: quality drift that does not break content or runtime contracts yet
- `block`: routing, metadata, content contract, or state-schema violations
- `escalate`: intentional contract change, schema break, or cross-repo rule divergence

## State Policy

JSON is allowed only as derived state in `output/state/`.

Examples:

- `content-contract-summary.json`
- `series-manifest.json`
- `content-inventory.json`

Tracked state files in this repo:

- `output/state/content-contract-summary.json`
- `output/state/series-manifest.json`
- `output/state/content-inventory.json`

Rules:

- generate by script
- never hand-edit
- never store secrets, tokens, env values, personal data, or absolute local paths
- if JSON conflicts with runtime content or docs, contract/rule sources win
- keep tracked JSON stable, reviewable, and deterministic
- preserve field naming and ordering unless a deliberate schema change is approved
- require a documented review for breaking schema changes that affect automation or docs

Official command:

```bash
npm run state
```

## Design Constraints

- keep content compatible with the upstream publishing model
- keep runtime behavior and contract docs aligned
- do not let derived state become a hidden canonical source
- preserve room for intentional manual writing without breaking the contract

## Related Docs

- [AGENTS.md](/Users/ms/workspace/claude/ai-survival-log-site/AGENTS.md)
- [CLAUDE.md](/Users/ms/workspace/claude/ai-survival-log-site/CLAUDE.md)
- [docs/operating/ui-guide.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/ui-guide.md)
- [docs/operating/content-contract.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/content-contract.md)
- [docs/operating/seo-operations.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/seo-operations.md)
- [docs/operating/consumer-boundaries.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/consumer-boundaries.md)
