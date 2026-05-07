# Failure Report

## Summary

- repository: ai-survival-log-site
- surface: build
- failed command: `npm run build`
- status: failed
- category: contract-mismatch
- severity: high

## First Failing Signal

- first error line or safe summary: post frontmatter contract mismatch; missing required field: description
- exit code: 1
- failing test or check: build
- observed at: mock fixture

## Suspected Scope

- suspected files: `content/posts/2026-05-02-example.mdx`
- suspected contract: content post frontmatter contract
- generated artifact impact: `output/state/content-contract-summary.json` may need regeneration if content changes
- downstream impact: metadata, sitemap, and post rendering may be affected

## Reproduction

```bash
npm run build
```

## Likely Next Action

- immediate check: Restore required frontmatter or confirm an intentional contract change with the owner.
- owner decision needed: yes, if the frontmatter contract changes
- safe fix candidate: add the missing `description` field when the content contract remains unchanged
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

