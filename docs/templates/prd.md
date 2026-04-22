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

## Proposed Change

- Summarize the change
- Note any new files, commands, or schemas

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
