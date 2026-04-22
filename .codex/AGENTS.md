# Codex Local Operating Guide

## Project Role

This repository is the site consumer of the `ai-survival-log` publishing flow.

Primary flow:
`wiki -> publish -> site/content/posts`

Do not treat this repository as the primary wiki knowledge base.

## Working Loop

Use this default loop for non-trivial changes:

1. Plan
2. Implement
3. Verify

## Engineering Guardrails

- Check existing code, docs, and reusable libraries before introducing net-new implementation.
- After changing code, review the changed scope for bugs, regressions, security issues, and contract drift before completion.
- Use tests for code changes that can regress behavior. Prefer test-first for runtime logic, API routes, shared content-contract code, and reusable UI behavior.
- Do not force TDD for post copy edits, SEO wording changes, or metadata-only content updates, but still run the relevant verification for the changed scope.
- Preserve security basics: no hardcoded secrets, validate external input, and avoid error messages that leak sensitive data.
- In TypeScript/JavaScript, keep exported or shared APIs typed, avoid `any` when possible, and do not leave `console.log` in production paths.

## Content Compatibility

`content/posts/*.mdx` and `content/posts/*.md` may be edited directly, but changes should preserve compatibility with the upstream publishing contract.

Preserve:

- frontmatter conventions
- stable slugs and dates
- series metadata rules
- agreement between docs and runtime behavior

## Selective Adoption

Adopt only the useful parts of ECC and superpowers:

- writing plans
- verification before completion
- systematic debugging
- documentation quality

Do not introduce large agent catalogs, heavy MCP assumptions, or unnecessary multi-agent workflows.

## Detailed References

Use these shared documents for detailed rules instead of expanding this file:

- [ARCHITECTURE.md](/Users/ms/workspace/claude/ai-survival-log-site/ARCHITECTURE.md) — repository boundaries, content/runtime layers, derived state policy
- [docs/operating/ui-guide.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/ui-guide.md) — presentation and UI guidance
- [docs/operating/content-contract.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/content-contract.md) — content contract operating rules
- [docs/operating/seo-operations.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/seo-operations.md) — SEO-sensitive checks
- [docs/operating/consumer-boundaries.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/consumer-boundaries.md) — new consumer boundary rules
- [docs/adr/0001-site-consumer-contract-boundary.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/adr/0001-site-consumer-contract-boundary.md)
- [docs/adr/0002-harness-layering-for-site-repo.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/adr/0002-harness-layering-for-site-repo.md)
- [docs/adr/0003-manual-posts-must-remain-contract-compatible.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/adr/0003-manual-posts-must-remain-contract-compatible.md)
- [docs/adr/0004-new-consumers-require-explicit-contracts.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/adr/0004-new-consumers-require-explicit-contracts.md)
