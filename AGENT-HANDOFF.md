# Agent Handoff

Last updated: 2026-03-26 after PR #54 merge

## Current project state

- `main` includes the merged offline batch from PR `#51`, the merged parent summary batch from PR `#53`, and the merged QA hardening batch from PR `#54`.
- `progress.txt` contains the detailed session-by-session build log from the docs-only start through the MIP-035 QA hardening batch.
- The current implementation now covers:
  - app shell and Cloudflare Pages baseline
  - content and state validation
  - onboarding and profile management
  - lesson mechanics and evaluation
  - feedback, progression, mastery, unlocks, and rewards
  - child home, map, completion UI, and personalization
  - PWA installability, app-shell caching, content-pack caching, and safe refresh behavior
  - parent summary UI derived from local learner state only
  - stronger direct unit and component coverage for evaluation, progression, persistence, and learner mechanics

## Best entry points in the codebase

- `progress.txt` - high-level build memory and rationale by batch
- `src/routes/learn.tsx` - child home + learner runtime shell
- `src/routes/learn.map.tsx` - progression map UI
- `src/routes/learn.completed.tsx` - lesson wrap-up UI
- `src/routes/parents.tsx` - parent-side setup and profile controls
- `src/lib/parent-summary.ts` - derived parent summary read model
- `src/lib/content/` - content loading and validation
- `src/lib/state/` - local learner state and persistence
- `src/lib/evaluation/` - activity result interpretation
- `src/lib/feedback/` - hint/retry/explanation/follow-up rules
- `src/lib/progression/` - completion, mastery, unlocks, rewards
- `src/lib/offline/` - content caching and safe refresh behavior

## Latest merged PRs

- `#47` child experience UI batch
- `#51` offline and update flow batch
- `#53` parent summary batch
- `#54` QA hardening batch

## Recommended next batch

Most natural next step: critical-path end-to-end coverage.

Suggested next issues to create or execute:

- `MIP-036` Add end-to-end coverage for critical learner flows
- after that: `MIP-037` deployed Cloudflare Pages verification and production-like smoke coverage

## If continuing with MIP-036

Focus areas:

- expand `tests/e2e/` beyond the existing smoke test
- cover profile creation through the parent route
- cover starting a lesson from the learner route
- cover completing the first lesson and reaching the wrap-up route
- cover resume behavior after a refresh or reload
- add offline-start or offline-return assertions only if they stay practical and stable in Playwright

Likely files to touch:

- `tests/e2e/`
- possibly tiny testability tweaks in `src/routes/learn.tsx`, `src/routes/learn.map.tsx`, `src/routes/learn.completed.tsx`, and `src/routes/parents.tsx`
- keep business rules in the existing `src/lib/*` modules rather than re-implementing them in tests or routes

## Operational conventions used in this repo

- one branch per batch
- one main commit per issue
- one PR contains multiple issue commits
- append `progress.txt` before opening a PR
- run validation before PRs:
  - `pnpm lint`
  - `pnpm test`

## Current branch note

PR `#54` is already merged. Start from updated `main` for the next batch.

## Recommended first prompt for the next agent

Read `AGENT-HANDOFF.md` and `progress.txt`, then continue from updated `main`.

Start with `MIP-036`.
Follow the repo workflow:
- one new branch from `main`
- one main commit per issue
- append `progress.txt` before opening a PR

Focus first on stable end-to-end coverage for profile creation, lesson start, lesson completion, and resume behavior. Add offline-return assertions only where the Playwright flow stays reliable, then run `pnpm lint` and `pnpm test` before opening the PR.
