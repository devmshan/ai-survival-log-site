# UI Guide

## Purpose

This document defines presentation-facing rules for `ai-survival-log-site`.

Use this document for:

- page layout and visual consistency
- component presentation rules
- MDX content rendering expectations
- image and series presentation conventions

## Design Direction

- prioritize clear reading flow over decorative complexity
- preserve distinction between article content, study series, and supporting UI chrome
- keep visual decisions compatible with the site’s content-first role

## Typography and Content Presentation

- body copy should optimize for long-form technical reading
- headings must preserve hierarchy clearly
- metadata should support scanning without overpowering article content
- code blocks, callouts, and lists should remain visually stable across posts

## Component Guidance

- shared UI components should prefer predictable behavior over novelty
- reusable components must stay aligned with MDX and content contract expectations
- series and related-post components should expose structure clearly, not hide contract assumptions

## Fallback Behavior

UI fallbacks are part of the contract, not cosmetic afterthoughts.

### Long Titles and Metadata

- long titles must wrap without clipping or horizontal scroll
- long tags and series names must wrap or truncate safely without hiding the page title
- metadata rows must not collapse into unreadable overlap on mobile

### Missing or Broken Images

- missing `thumbnail` should fall back to a stable default presentation
- broken inline images must fail visibly but not break article reading flow
- image containers should preserve layout stability even when the asset fails to load

### Series and Related Navigation

- empty related-post results must collapse cleanly without leaving broken headings or gaps
- series navigation with missing previous or next items must still render a coherent partial navigation state
- mobile series or TOC panels must not overflow off-screen without a usable scroll path

### MDX and Rich Content

- unsupported or broken MDX components must degrade to a readable failure state rather than blank content
- code blocks must remain horizontally scrollable without overlapping surrounding content
- mermaid or other enhanced blocks must fail without making the surrounding article unreadable

### No-JS and Hydration

- the main article body must remain readable when client enhancements fail
- hydration mismatch should not remove access to title, metadata, body, or primary navigation
- JS-dependent enhancements should be additive rather than required for basic reading

## Image Rules

- preserve publish-facing image paths like `/images/{slug-or-series}/{file}.png`
- keep image presentation consistent with upstream asset expectations
- do not introduce one-off image path conventions that bypass the contract

## Edge Cases

Review these explicitly when changing UI or rendering:

- long Korean or mixed-language titles
- very dense tags or series metadata
- no thumbnail present
- image 404 or broken remote reference
- malformed MDX block or unsupported component
- mobile viewport overflow in TOC, series panels, or code blocks
- partial hydration or client-only enhancement failure

## UI Change Review

Before completing presentation changes, review:

- layout regressions
- mobile readability
- series navigation behavior
- MDX rendering stability
- consistency with content contract and SEO expectations
- fallback behavior for missing images, empty related sections, and broken rich content

## Related Docs

- [ARCHITECTURE.md](/Users/ms/workspace/claude/ai-survival-log-site/ARCHITECTURE.md)
- [docs/operating/content-contract.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/content-contract.md)
- [docs/operating/seo-operations.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/seo-operations.md)
