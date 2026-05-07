# Failure Report

## Summary

- repository: ai-survival-log-site
- surface: unit and component tests
- failed command: `npm test`
- status: failed
- category: dom-query-failure
- severity: medium

## First Failing Signal

- first error line or safe summary: Unable to find an element with role "link" and name "Series"
- exit code: 1
- failing test or check: `src/components/post/__tests__/SeriesPanel.test.tsx`
- observed at: mock fixture

## Suspected Scope

- suspected files: `src/components/post/SeriesPanel.tsx`, `src/components/post/__tests__/SeriesPanel.test.tsx`
- suspected contract: reader-facing series navigation or test selector expectation
- generated artifact impact: none identified
- downstream impact: possible series page navigation review

## Reproduction

```bash
npm test
```

## Likely Next Action

- immediate check: Confirm whether UI copy/structure changed or the selector became brittle.
- owner decision needed: only if reader-facing navigation changed intentionally
- safe fix candidate: update test fixture or accessible selector after behavior is confirmed
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

