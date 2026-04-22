# Consumer Boundaries Guide

## Purpose

This document defines when a new workflow belongs inside `ai-survival-log-site` and when it should stay upstream or move to a separate consumer.

Use it when considering new outputs such as:

- alternate blog presentations
- presentation landing pages
- YouTube companion pages
- webtoon readers or gallery-style consumers

## Core Rule

This repository is a consumer of published content, not the place where new canonical content models are invented.

New downstream consumers must not silently redefine:

- content frontmatter
- public route shape
- SEO field meaning
- image path contracts

## Belongs In This Repo

A new workflow likely belongs in `ai-survival-log-site` when:

- it consumes publish-ready content from `ai-survival-log`
- it renders content for readers on the same site runtime
- it can reuse the existing post contract or extend it in a documented, backward-compatible way

Examples:

- alternate blog layouts
- series landing improvements
- presentation pages generated from existing post content
- YouTube companion pages that consume post-compatible metadata

## Does Not Automatically Belong In This Repo

A new workflow should stay upstream or move elsewhere when:

- it needs a new canonical authoring model
- it is mainly an asset-production workflow
- it is not primarily consumed through the site runtime
- it would overload the post contract with channel-specific fields

Examples:

- webtoon production pipeline
- raw slide design workflow
- video editing workflow
- standalone social publishing automation

## Required Definition For New Consumers

Before treating a new consumer as official, define:

1. what canonical source it consumes
2. whether it uses the existing post contract or a new contract
3. what runtime routes it owns
4. what validation path covers it
5. whether it needs derived state
6. whether it should live here or in a separate repo

## Failure Policy

### `warn`

- exploratory consumer page exists but is not yet part of the official workflow
- the consumer reuses the existing contract with only minor documented constraints

### `block`

- a new consumer depends on undocumented fields
- runtime behavior changes but docs and contract are left behind
- a workflow overloads `content/posts` with unrelated channel-specific assumptions

### `escalate`

- a new consumer needs a new canonical contract
- route or metadata conventions change
- the site is asked to absorb workflows that are not primarily reader-facing site concerns

## Related Docs

- [ARCHITECTURE.md](/Users/ms/workspace/claude/ai-survival-log-site/ARCHITECTURE.md)
- [docs/operating/content-contract.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/content-contract.md)
- [docs/operating/validation-matrix.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/operating/validation-matrix.md)
- [docs/templates/prd.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/templates/prd.md)
