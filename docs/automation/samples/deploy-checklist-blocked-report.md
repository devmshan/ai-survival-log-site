# Deploy Checklist Report

## Summary

- repository: ai-survival-log-site
- target environment: production
- branch or commit: `main at mock short SHA 0000000`
- status: blocked before deploy
- category: contract-mismatch
- severity: high
- deploy write status: none

## Checks Run

| Check | Command or evidence | Result |
| --- | --- | --- |
| lint | `npm run lint` | pass |
| tests | `npm test` | pass |
| build | `npm run build` | pass |
| derived state | `npm run state plus diff review` | blocked |
| content contract | `published post metadata review` | review required |

## Checks Skipped

| Check | Reason |
| --- | --- |
| environment readiness | runtime secret values are not inspected in docs or mock reports |
| deploy command dry-run | not part of this local checklist mock |
| rollback execution | no deploy occurred |

## First Blocking Check

- first blocking signal: generated state diff has not been reviewed for the release candidate
- failing or blocked check: derived state review
- observed at: sanitized mock fixture

## Suspected Scope

- suspected files: `content/posts/*.mdx`, `output/state/*.json`
- suspected contract: published content metadata and generated state must agree before deploy
- generated artifact impact: tracked state output may need regeneration or review
- downstream impact: sitemap, series pages, tag pages, and post routes may be affected

## Reproduction

```bash
npm run lint
npm test
npm run build
npm run state
```

## Owner Decision

- owner decision needed: yes
- decision question: Is the generated state diff expected for this release?
- safe next action: review state diff and content metadata before any deploy command is allowed
- rollback readiness: manual rollback note required before deployment
- out of scope: deploy command, GitHub comment, Slack alert, auto-fix branch, release commit, production log archive

## Unsafe Data Check

- raw log retained: no
- redaction needed: no
- secret/customer/company signal: none
- environment values included: no
- production logs included: no
- stop condition triggered: yes, generated state review is incomplete

## Notes

- secondary categories: release-gate-review
- flaky or deterministic: deterministic mock fixture
- related execution record: deploy checklist local dry-run
- generator version: deploy-checklist-report-local-v1
