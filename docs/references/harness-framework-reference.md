This document is a reference note for Harness-style workflow ideas.

`ai-survival-log-site` selectively adopts the planning and step-design ideas from that framework, but does not currently use its execution mechanism (`phases/*`, `scripts/execute.py`) as a live runtime contract.

Use this document only as reference context. The actual operating rules for this repository live in:

- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/operating/*`
- `docs/templates/prd.md`
- `docs/adr/*`

Reference ideas that are intentionally adopted here:

- document-first exploration before non-trivial implementation
- discussion or escalation for real contract decisions
- self-contained step planning
- executable acceptance criteria
- explicit prohibitions with reasons

Reference ideas that are not currently adopted as runtime mechanisms:

- `phases/index.json`
- task-level step state files
- `scripts/execute.py`
- automatic retries, automatic branch orchestration, and metadata timestamps
