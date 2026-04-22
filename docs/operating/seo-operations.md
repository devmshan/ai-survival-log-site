# SEO Operations Guide

## Purpose

This document defines the operating view of SEO-related rules for `ai-survival-log-site`.

Use this document for:

- SEO-sensitive post changes
- metadata verification
- canonical URL and sitemap consistency
- structured data and presentation alignment

## SEO Operating Rules

- when writing or revising posts, follow `docs/content-seo-guide.md`
- keep runtime metadata generation aligned with content contract rules
- preserve canonical URL expectations and sitemap consistency
- do not let SEO copy drift from upstream authoring guidance without deliberate review
- treat tone-first titles as incomplete when they hide the searchable concept and no `seoTitle` or equivalent clarification is provided
- treat vague summaries as incomplete when `description` or `seoDescription` does not explain the practical subject

## Verification

For SEO-sensitive changes, check:

- page metadata output
- canonical URL behavior
- sitemap coverage
- structured data where applicable
- consistency between docs and runtime behavior
- use [validation-matrix.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/validation-matrix.md) to decide the minimum required checks for the changed scope

## Failure Policy

### `warn`

- title, intro, or summary could be more search-aligned but still communicates the subject
- related-link coverage is thin
- thumbnail is missing but the page still renders correctly

### `block`

- canonical URL is wrong
- sitemap coverage is missing for a publishable page
- internal post links use the wrong route format
- metadata output contradicts the content contract
- a required manual `## 함께 읽으면 좋은 글` section is missing from a published post

### `escalate`

- intentional divergence from upstream SEO writing rules
- changing canonical URL or metadata field conventions
- changing the meaning of `seoTitle` or `seoDescription`

## Related Docs

- [ARCHITECTURE.md](/Users/ms/workspace/claude/ai-survival-log-site/ARCHITECTURE.md)
- [docs/content-seo-guide.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/content-seo-guide.md)
- [docs/operating/content-contract.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/content-contract.md)
- [docs/operating/validation-matrix.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/validation-matrix.md)
