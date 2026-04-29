# AI-Ready Context Map

## Repository

- name: `ai-survival-log-site`
- role: downstream presentation and publishing-consumer layer
- operational status: runtime and content-contract consumer repository
- owning surface: Next.js runtime, `content/posts/`, site-facing image paths, derived site state

## Source-of-Truth Boundary

- upstream authoring source: `ai-survival-log/wiki/`
- site content layer: `content/posts/*.mdx` and `content/posts/*.md`
- downstream-served assets: `public/images/`
- generated state: `output/state/`
- runtime consumers: Next.js routes, metadata, sitemap, series navigation, related-post behavior

## Normal Modification Path

1. Confirm whether a content change originates upstream in `ai-survival-log` or is an intentional site-side edit.
2. Preserve frontmatter compatibility for `title`, `date`, `tags`, `description`, and `draft`.
3. Preserve `seriesSlug` and `seriesOrder` behavior when a post participates in a series.
4. Keep image paths site-facing, usually `/images/{slug-or-series}/{file}.png`.
5. Run lint, tests, state export, and build before merge.
6. Review tracked `output/state/*.json` diffs when content or contract behavior changes.

## Do Not Change or Copy

- Do not treat this repository as the upstream wiki knowledge base.
- Do not move source intake, source summaries, or planning history out of `ai-survival-log/wiki/`.
- Do not introduce company operational records, ERP traces, source code, SQL bodies, DB dumps, credentials, review evidence, or test evidence.
- Do not let `output/state/` become a hidden authoring source.
- Do not add a new reader-facing consumer without a contract boundary.

## Non-Obvious Patterns

| Pattern | Why it matters | Verification |
| --- | --- | --- |
| Site content consumes upstream publishing output | Manual edits are allowed but must stay contract-compatible | Run `npm run state` and review contract summary |
| State export must be deterministic in CI | `generatedAt` timestamps can otherwise create false diffs | Set `STATE_GENERATED_AT` in CI before `npm run state` |
| Series navigation requires `seriesSlug` | Missing series metadata breaks public navigation expectations | Run state tests and review `output/state/series-manifest.json` |
| Image paths are site-facing | Upstream wiki paths and runtime served paths must stay aligned | Run build and content contract checks |
| New consumers need explicit boundaries | The site must not become a generic production workflow repository | Review `docs/operating/consumer-boundaries.md` |

## Required Checks

- runtime or rendering changes: `npm run lint`, `npm test`, `npm run build`
- content or contract changes: `npm run state`, then review `output/state/*.json`
- CI generated diff gate: `STATE_GENERATED_AT=1970-01-01T00:00:00.000Z npm run state`, then `git diff --exit-code`
- new consumer changes: define route, metadata, validation owner, and contract boundary first

## Handoff

- upstream authoring repository: `ai-survival-log`
- shared standard owner: `shared-agent-harness`
- next operational surfaces: site deployment and downstream reader-facing workflows
- unresolved questions: none for local AI-ready context adoption
