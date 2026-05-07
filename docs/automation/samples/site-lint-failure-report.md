# Failure Report

## Summary

- repository: ai-survival-log-site
- surface: lint
- failed command: `npm run lint`
- status: failed
- category: lint-format-failure
- severity: low

## First Failing Signal

- first error line or safe summary: eslint: src/components/post/PostCard.tsx
- exit code: 1
- failing test or check: lint
- observed at: mock fixture

## Suspected Scope

- suspected files: `src/components/post/PostCard.tsx`
- suspected contract: style or lint rule
- generated artifact impact: none identified
- downstream impact: none identified

## Reproduction

```bash
npm run lint
```

## Likely Next Action

- immediate check: Fix the reported lint issue and rerun the same command.
- owner decision needed: no, unless lint rule behavior is disputed
- safe fix candidate: mechanical lint cleanup
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

