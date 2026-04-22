<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Role

This repository is the site consumer of the `ai-survival-log` publishing flow.

Primary flow:
`wiki -> publish -> site/content/posts`

Do not treat this repository as the primary wiki knowledge base.
Its responsibility is to consume published outputs, render them clearly, and support downstream presentation formats.

## Working Model

Use this default loop for non-trivial changes:

1. Plan
2. Implement
3. Verify

## Rule Precedence

When documents overlap, follow this order:

1. `AGENTS.md`
2. `ARCHITECTURE.md`
3. `docs/operating/*`
4. domain-specific contract docs such as `docs/content-seo-guide.md`
5. `docs/adr/*`

`CLAUDE.md` and `.codex/AGENTS.md` are adapter surfaces. They should not silently override shared repository rules.

## Rule Strength

Interpret rules with these levels:

- `MUST`: required contract, runtime, and verification rules
- `SHOULD`: default operating behavior unless there is a documented reason not to follow it
- `MAY`: optional enrichment or convenience guidance

## Content Compatibility

`content/posts/*.mdx` and `content/posts/*.md` may be written manually.
However, the default rule is that posts should remain compatible with the wiki-based publishing pipeline.

Preserve compatibility with content/posts publishing contracts.
Keep runtime behavior and contract documents aligned.
When writing or rewriting posts, follow [docs/content-seo-guide.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/content-seo-guide.md) so new content also reflects search priorities.
If equivalent authoring guidance exists upstream in `ai-survival-log`, keep the two repositories aligned instead of letting SEO writing rules drift.

`MUST`

- preserve contract-compatible frontmatter and routing behavior
- keep runtime behavior and contract documents aligned
- follow the SEO writing rules for posts that are created or materially revised

`SHOULD`

- prefer reuse-first and test-first for regression-prone runtime or contract code
- keep manual posts close to upstream publishing conventions even when no automated import is involved

## Selective Adoption

Adopt only the useful operating principles from ECC and superpowers:

- plan before execute
- verification before completion
- systematic debugging
- documentation quality

Do not import large agent packs, heavy MCP assumptions, or unrelated framework rules.

## Verification Policy

`MUST`

- verify the changed scope before completion
- run the checks required by [docs/operating/validation-matrix.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/validation-matrix.md)
- block completion when content contract, routing, metadata, or state schema rules fail

`SHOULD`

- run the smallest useful runtime or contract test set that covers the changed behavior
- review tracked `output/state/*.json` diffs when state export changes

`MAY`

- add manual rendering checks for high-risk presentation changes even when tests pass

## Detailed References

Use these documents as the authoritative detailed references instead of expanding this file:

- [ARCHITECTURE.md](/Users/ms/workspace/claude/ai-survival-log-site/ARCHITECTURE.md) — repository boundaries, runtime/content contract layers, derived state policy
- [docs/operating/ui-guide.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/ui-guide.md) — presentation and MDX/UI guidance
- [docs/operating/content-contract.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/content-contract.md) — operating view of the content contract
- [docs/operating/seo-operations.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/seo-operations.md) — SEO-sensitive operating checks
- [docs/operating/validation-matrix.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/validation-matrix.md) — change-type-to-required-check map
- [docs/operating/consumer-boundaries.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/consumer-boundaries.md) — rules for new downstream consumers
- [docs/templates/prd.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/templates/prd.md) — feature-level PRD template for contract-sensitive work
- [docs/adr/0001-site-consumer-contract-boundary.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/adr/0001-site-consumer-contract-boundary.md)
- [docs/adr/0002-harness-layering-for-site-repo.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/adr/0002-harness-layering-for-site-repo.md)
- [docs/adr/0003-manual-posts-must-remain-contract-compatible.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/adr/0003-manual-posts-must-remain-contract-compatible.md)
- [docs/adr/0004-new-consumers-require-explicit-contracts.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/adr/0004-new-consumers-require-explicit-contracts.md)
