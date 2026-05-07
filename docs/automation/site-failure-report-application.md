# Site Failure Report Mock Application

## Source Status

- This file is a site-local application note for the shared failure report shape.
- It uses mock logs only.
- Real CI logs, production logs, customer payloads, credentials, env values, and upstream raw wiki material do not belong here.

## Purpose

Apply the shared failure report envelope to `ai-survival-log-site` validation surfaces before adding any CI comment, Slack alert, or auto-fix behavior.

The site repository is a downstream presentation and content-consumer layer. Failure reports here should help reviewers understand lint, test, build, state, and content-contract failures without turning raw logs into source-of-truth records.

## Command Map

| Site command | Likely category | Reviewer question |
| --- | --- | --- |
| `npm run lint` | `lint-format-failure` | Is this mechanical cleanup or a rule conflict? |
| `npm test` | `assertion-mismatch`, `dom-query-failure`, `import-runtime-error` | Did runtime behavior change, or did a test fixture/selector drift? |
| `npm run build` | `import-runtime-error`, `contract-mismatch`, `environment-dependency-failure` | Is the failure runtime code, content shape, or local environment? |
| `npm run state` | `contract-mismatch` | Did content metadata, series data, or generated state schema drift? |

## Mock Fixtures

| Fixture | Intended category | Sample report |
| --- | --- | --- |
| `docs/automation/samples/site-lint-failure.log` | `lint-format-failure` | `docs/automation/samples/site-lint-failure-report.md` |
| `docs/automation/samples/site-test-dom-failure.log` | `dom-query-failure` | `docs/automation/samples/site-test-dom-failure-report.md` |
| `docs/automation/samples/site-build-contract-failure.log` | `contract-mismatch` | `docs/automation/samples/site-build-contract-failure-report.md` |
| `docs/automation/samples/site-state-contract-failure.log` | `contract-mismatch` | `docs/automation/samples/site-state-contract-failure-report.md` |

## Boundary

Allowed:

- sanitized mock logs
- compact first failing signal
- suspected files or contract
- reproduction command
- likely next action
- unsafe data check

Not allowed:

- real production logs
- real customer or newsletter payloads
- credentials, env values, tokens, webhook URLs, or API keys
- raw upstream wiki material
- GitHub comments, Slack alerts, auto-fix branches, commits, or CI writes before a separate approval gate

## Review Rule

The report is an aid for human review. It does not replace:

- the actual failing command
- content contract validation
- runtime tests
- `output/state/*.json` generated diff review
- owner decision for contract changes

