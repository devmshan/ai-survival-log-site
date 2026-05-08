# Deploy Checklist Local Dry-Run

## Source Status

- This file is a site-local mock application for the deploy checklist report shape.
- It uses sanitized mock report material only.
- It does not run deploy, inspect secret values, upload CI artifacts, write Slack alerts, write GitHub comments, create release commits, or create rollback automation.

## Purpose

Apply the deploy checklist runner plan to `ai-survival-log-site` before adding any deploy command or CI workflow.

The goal is to prove that a deploy checklist can stop at local dry-run report stage when a release-facing condition is not ready, even if lint, tests, and build pass.

## Local Dry-Run Checklist

| Check | Status in mock | Reviewer question |
| --- | --- | --- |
| lint | pass | Did `npm run lint` complete without rule failures? |
| tests | pass | Did `npm test` complete without behavior or selector failures? |
| build | pass | Did `npm run build` render the new post routes? |
| derived state | blocked | Is the generated state diff reviewed and intentional? |
| content contract | review required | Did published post metadata and series ordering remain valid? |
| environment readiness | skipped | Are runtime secrets checked only in runtime surfaces, not docs? |
| rollback readiness | needs manual note | Is the rollback path known before deploy? |

## Mock Reports

| Report | Purpose |
| --- | --- |
| `docs/automation/samples/deploy-checklist-blocked-report.md` | Demonstrates a local dry-run that blocks before deploy because generated state review and rollback note are incomplete |

## Boundary

Allowed:

- sanitized checklist report
- checks run and checks skipped
- first blocking signal
- generated artifact impact
- owner decision needed
- rollback readiness note

Not allowed:

- deployment tokens or env values
- production logs
- customer or newsletter payloads
- raw CI logs
- deploy command output
- GitHub comments, Slack alerts, release commits, auto-fix branches, or rollback actions

## Review Rule

The checklist report is a release review aid. It is not deploy approval, rollback evidence, or source-of-truth runtime state.

Deploy remains blocked until the owning operator confirms generated state review, target environment, branch/commit, and rollback readiness.
