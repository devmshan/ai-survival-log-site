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

## Content Compatibility

`content/posts/*.mdx` and `content/posts/*.md` may be written manually.
However, the default rule is that posts should remain compatible with the wiki-based publishing pipeline.

Preserve compatibility with content/posts publishing contracts.
Keep runtime behavior and contract documents aligned.
When writing or rewriting posts, follow [docs/content-seo-guide.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/content-seo-guide.md) so new content also reflects search priorities.
If equivalent authoring guidance exists upstream in `ai-survival-log`, keep the two repositories aligned instead of letting SEO writing rules drift.

## Selective Adoption

Adopt only the useful operating principles from ECC and superpowers:

- plan before execute
- verification before completion
- systematic debugging
- documentation quality

Do not import large agent packs, heavy MCP assumptions, or unrelated framework rules.
