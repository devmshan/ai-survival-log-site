# Failure Report

## Summary

- repository: ai-survival-log-site
- surface: derived state
- failed command: `npm run state`
- status: failed
- category: contract-mismatch
- severity: high

## First Failing Signal

- first error line or safe summary: content contract summary changed unexpectedly
- exit code: 1
- failing test or check: state export
- observed at: mock fixture

## Suspected Scope

- suspected files: `output/state/content-contract-summary.json`, `content/posts/*.mdx`
- suspected contract: derived state must match runtime-facing content metadata
- generated artifact impact: tracked `output/state/*.json` diffs require review
- downstream impact: content inventory, series manifest, or contract summary consumers may be affected

## Reproduction

```bash
npm run state
```

## Likely Next Action

- immediate check: Compare generated state diff against content metadata changes.
- owner decision needed: yes, if state schema or content contract semantics changed
- safe fix candidate: regenerate state after confirming content metadata is valid
- out of scope: auto-fix branch, GitHub comment, Slack alert, raw log archive

## Unsafe Data Check

- raw log retained: no
- redaction needed: no
- secret/customer/company signal: none
- stop condition triggered: no

## Notes

- secondary categories: none
- flaky or deterministic: deterministic mock fixture
- related PRD, issue, or execution record: site failure report mock application

