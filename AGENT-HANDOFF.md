# Agent Handoff

Last updated: 2026-03-26

## Current project state

- `main` includes the merged offline batch from PR `#51`.
- `progress.txt` contains the detailed session-by-session build log from the docs-only start through the offline update flow.
- The current implementation now covers:
  - app shell and Cloudflare Pages baseline
  - content and state validation
  - onboarding and profile management
  - lesson mechanics and evaluation
  - feedback, progression, mastery, unlocks, and rewards
  - child home, map, completion UI, and personalization
  - PWA installability, app-shell caching, content-pack caching, and safe refresh behavior

## Best entry points in the codebase

- `progress.txt` - high-level build memory and rationale by batch
- `src/routes/learn.tsx` - child home + learner runtime shell
- `src/routes/learn.map.tsx` - progression map UI
- `src/routes/learn.completed.tsx` - lesson wrap-up UI
- `src/routes/parents.tsx` - parent-side setup and profile controls
- `src/lib/content/` - content loading and validation
- `src/lib/state/` - local learner state and persistence
- `src/lib/evaluation/` - activity result interpretation
- `src/lib/feedback/` - hint/retry/explanation/follow-up rules
- `src/lib/progression/` - completion, mastery, unlocks, rewards
- `src/lib/offline/` - content caching and safe refresh behavior

## Latest merged PRs

- `#47` child experience UI batch
- `#51` offline and update flow batch

## Recommended next batch

Most natural next step: parent summary UI.

Suggested next issues to create or execute:

- `MIP-029` Implement parent summary screen
- optionally after that: `MIP-035` unit/component QA hardening
- optionally after that: `MIP-036` end-to-end learner flow coverage

## If continuing with parent summary

Focus areas:

- derive completed lessons from local state only
- show mastery summary from `src/lib/progression/mastery.ts`
- show stars and rewards from `src/lib/progression/unlocks.ts`
- show recent or resumable activity context from learner state
- keep the parent view presentation-only; do not move progression rules into the route

Likely files to touch:

- `src/routes/parents.tsx`
- a new derived-read helper under `src/lib/` for parent summary state
- targeted tests for the derived summary model

## Operational conventions used in this repo

- one branch per batch
- one main commit per issue
- one PR contains multiple issue commits
- append `progress.txt` before opening a PR
- run validation before PRs:
  - `pnpm lint`
  - `pnpm test`

## Current branch note

The working branch may still be `feat/issues-48-50-offline`, but PR `#51` is already merged. A new agent should branch from updated `main` for the next batch.
