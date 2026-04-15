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
