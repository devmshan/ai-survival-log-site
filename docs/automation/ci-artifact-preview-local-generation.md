# CI Artifact Preview Local Generation

## Source Status

- This file documents a local-only artifact preview for the deploy checklist report.
- It uses sanitized mock checklist input only.
- It does not upload GitHub Actions artifacts, write GitHub comments, send Slack alerts, run deploy commands, or retain production logs.

## Command

```bash
npm run deploy:checklist:report -- --input docs/automation/samples/deploy-checklist-blocked.json --output tmp/ci-artifacts/deploy-checklist-report.md
```

## Artifact Contract

| Field | Rule |
| --- | --- |
| input | sanitized JSON fixture only |
| output | `tmp/ci-artifacts/deploy-checklist-report.md` |
| determinism | same fixture should produce the same markdown |
| safety scan | input and rendered report are scanned before writing |
| external writes | none |

## Stop Conditions

The local artifact generation must stop before writing when:

- the input contains credentials, env assignments, PII-like values, SQL bodies, company evidence signals, or production log signals
- the requested output path is outside repository `tmp/` or the operating system temp directory
- the checklist input claims a deploy or external write already occurred
- required checklist fields are missing

## Review Rule

This artifact is a preview for human review. It is not CI evidence, deployment approval, rollback evidence, or a GitHub Actions uploaded artifact.
