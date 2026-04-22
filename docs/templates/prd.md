# PRD Template

## When to Use

Create a PRD for changes that:

- alter content contract or runtime metadata behavior
- introduce a new user-facing feature or major rendering workflow
- change derived-state schemas or their consumers
- intentionally diverge from upstream `ai-survival-log` behavior

Do not use a PRD for trivial copy edits, small styling tweaks with no contract impact, or routine maintenance.

## Problem

- What problem exists now?
- Why does it matter to readers, authors, or operators?

## Goals

- Primary outcome
- Secondary outcome

## Non-Goals

- Explicitly list what this change will not solve

## Users and Surfaces

- Who is affected: reader, operator, agent, manual author, upstream publisher
- Which surfaces change: content, runtime, metadata, state export, docs
- Which consumer changes: post pages, series pages, presentation pages, companion pages, or other

## Constraints

- content contract constraints
- route and metadata constraints
- UI and SEO constraints
- security and privacy constraints

## Documents To Read First

- List the architecture, operating, ADR, and contract documents that must be read before implementation
- List any files or outputs created by earlier steps that later steps must understand first

## Proposed Change

- Summarize the change
- Note any new files, commands, or schemas

## Step Plan

If the work is non-trivial, break it into small self-contained steps.

Rules:

- each step should change one layer, module, route, or contract surface at a time
- each step should be understandable without relying on unstated conversation context
- each step should name the files to read first
- interface or contract expectations should be explicit even when implementation details are left open

## Alternatives Considered

- Rejected option 1
- Rejected option 2

## Contract Impact

- frontmatter impact
- route impact
- state schema impact
- upstream alignment impact
- consumer boundary impact

## Edge Cases

- malformed frontmatter
- broken links or image paths
- missing thumbnail or series data
- partial rendering or hydration failure

## Validation Plan

- tests
- scripts
- manual checks
- state diff review
- executable acceptance criteria commands
- any required runtime, contract, or rendering checklist review

## Prohibitions

- List concrete `do not X because Y` rules when the work needs hard guardrails
- Name the contract, route, or consumer boundaries that must not be crossed

## Rollout

- how the change is introduced
- whether migration is needed

## Rollback

- what would trigger rollback
- how to revert safely

## Follow-Up

- ADR updates
- document sync
- cleanup or migration tasks
