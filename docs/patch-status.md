# Patch Status

## Summary

The site patch plan has been fully applied.

This repository is now documented and configured as the downstream site consumer of the `ai-survival-log` publishing flow:

`wiki -> publish -> site/content/posts`

The operating model, content contract, series rules, Claude surface, and Codex surface are now aligned.

## Patch Coverage

### 1. `README.md` replacement

Status: Applied

Implemented in:

- [README.md](/Users/ms/workspace/claude/ai-survival-log-site/README.md)

Included:

- repository role as downstream site consumer
- relationship to `ai-survival-log`
- blog / study-series / Instagram expansion framing
- content contract overview
- series rules overview
- verification principles
- `.claude` / `.codex` local surface summary

### 2. `AGENTS.md` expansion

Status: Applied

Implemented in:

- [AGENTS.md](/Users/ms/workspace/claude/ai-survival-log-site/AGENTS.md)

Included:

- existing Next.js warning block retained
- project role
- `plan -> implement -> verify`
- selective adoption guidance
- `content/posts` compatibility rule
- consumer-not-source-of-truth rule
- document/runtime contract alignment rule

### 3. `CLAUDE.md` operationalization

Status: Applied

Implemented in:

- [CLAUDE.md](/Users/ms/workspace/claude/ai-survival-log-site/CLAUDE.md)

Included:

- Claude local operating notes
- plan before structural or contract changes
- verify before completion
- cross-document consistency guidance
- review request guidance for contract and surface changes

### 4. `docs/content-contract.md` addition

Status: Applied

Implemented in:

- [docs/content-contract.md](/Users/ms/workspace/claude/ai-survival-log-site/docs/content-contract.md)

Contract documented to match runtime behavior in:

- [src/lib/posts.ts](/Users/ms/workspace/claude/ai-survival-log-site/src/lib/posts.ts)
- [src/lib/__tests__/posts.test.ts](/Users/ms/workspace/claude/ai-survival-log-site/src/lib/__tests__/posts.test.ts)

Documented rules include:

- minimum frontmatter
- optional fields
- `series` requires `seriesSlug`
- missing `seriesOrder` excludes a post from public series navigation and warns
- draft posts are excluded from public listings and public series navigation
- duplicate `seriesOrder` warns and falls back to date as a secondary sort key
- `seriesSlug` is the runtime identifier

### 5. `.codex/AGENTS.md` addition

Status: Applied

Implemented in:

- [.codex/AGENTS.md](/Users/ms/workspace/claude/ai-survival-log-site/.codex/AGENTS.md)

Included:

- project role
- working loop
- content compatibility guidance
- selective adoption guidance

### 6. `.codex/config.toml` addition

Status: Applied

Implemented in:

- [.codex/config.toml](/Users/ms/workspace/claude/ai-survival-log-site/.codex/config.toml)

Included:

- minimal Codex baseline
- project role hint
- plan before execute
- verify before completion
- selective adoption

### 7. `.claude/settings.json` reinforcement

Status: Applied

Implemented in:

- [.claude/settings.json](/Users/ms/workspace/claude/ai-survival-log-site/.claude/settings.json)
- [scripts/verify-content-contract.mjs](/Users/ms/workspace/claude/ai-survival-log-site/scripts/verify-content-contract.mjs)
- [scripts/generate-test-doc.sh](/Users/ms/workspace/claude/ai-survival-log-site/scripts/generate-test-doc.sh)

Retained:

- test-results generation hook

Added:

- lightweight content contract verification hook

Verification scope:

- required frontmatter fields
- `series` / `seriesSlug` dependency
- `seriesOrder` warning policy

### 8. `.claude/settings.local.json` cleanup

Status: Applied

Implemented in:

- [.claude/settings.local.json](/Users/ms/workspace/claude/ai-survival-log-site/.claude/settings.local.json)

Outcome:

- local convenience permissions remain possible
- official operating model no longer depends on this file
- contract verification command allowance added
- excessive surface assumptions reduced

## Additional Cleanup Completed

The patch work also resolved verification blockers discovered during execution.

Implemented in:

- [src/components/post/TableOfContents.tsx](/Users/ms/workspace/claude/ai-survival-log-site/src/components/post/TableOfContents.tsx)
- [src/components/search/SearchBar.tsx](/Users/ms/workspace/claude/ai-survival-log-site/src/components/search/SearchBar.tsx)
- [src/components/post/PostCard.tsx](/Users/ms/workspace/claude/ai-survival-log-site/src/components/post/PostCard.tsx)
- [src/components/post/TagFilter.tsx](/Users/ms/workspace/claude/ai-survival-log-site/src/components/post/TagFilter.tsx)
- [src/app/layout.tsx](/Users/ms/workspace/claude/ai-survival-log-site/src/app/layout.tsx)
- [src/app/globals.css](/Users/ms/workspace/claude/ai-survival-log-site/src/app/globals.css)
- [eslint.config.mjs](/Users/ms/workspace/claude/ai-survival-log-site/eslint.config.mjs)

Completed:

- removed lint errors caused by effect-driven state updates
- replaced raw post thumbnail image rendering with `next/image`
- removed unused imports
- excluded generated coverage artifacts from lint noise
- removed external Google font fetch dependency from build verification path

## Validation Result

Final validation completed successfully.

Passed:

- `node scripts/verify-content-contract.mjs --all`
- `npm run lint`
- `npm test`
- `npm run build`

Note:

- `npm run build` required running outside the sandbox because Turbopack/PostCSS processing hit sandbox port-binding limits during local verification.

## Explicitly Not Added

These remain out of scope, by design:

- large `.codex/agents/*` catalogs
- large `.codex/commands/*` surfaces
- ECC skill-pack replication
- full superpowers workflow import
- heavy MCP configuration
- default multi-agent assumptions
- broad git command surface expansion

## Completion Decision

The original patch plan can now be treated as fully applied.
