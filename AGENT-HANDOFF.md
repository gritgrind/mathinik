# Agent Handoff

Last updated: 2026-03-26 during MIP-037 branch work

## Current project state

- `main` includes the merged offline batch from PR `#51`, the merged parent summary batch from PR `#53`, the merged QA hardening batch from PR `#54`, and the merged critical learner-flow E2E batch from PR `#55`.
- `progress.txt` contains the detailed session-by-session build log from the docs-only start through the MIP-037 broader E2E batch on the current branch.
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
  - critical learner, parent-summary, and offline-update Playwright coverage

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
- `#55` critical learner-flow E2E batch

## Recommended next batch

Most natural next step: deployed verification and production-like smoke coverage.

Suggested next issues to create or execute:

- `MIP-037` Deployed Cloudflare Pages verification and production-like smoke coverage
- after that: fix any deployment-only regressions or deepen offline-return coverage if the deployed checks surface gaps

## If continuing with deployed verification

Focus areas:

- verify the actual deployed Pages environment still boots and routes correctly
- smoke-test learner, parent, and offline-update surfaces against the deployed build
- compare deployed behavior against local preview behavior, especially for PWA/update prompts and nested learner routes
- keep fixes small and targeted if a deployment-only mismatch appears

Likely files to touch:

- `tests/e2e/`
- deployment config and Pages preview settings if needed
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

PR `#55` is already merged. Start from updated `main` for the next batch.

## Recommended first prompt for the next agent

Read `AGENT-HANDOFF.md` and `progress.txt`, then continue from updated `main`.

Start with deployed verification work.
Follow the repo workflow:
- one new branch from `main`
- one main commit per issue
- append `progress.txt` before opening a PR

Focus first on production-like Cloudflare Pages verification and deployed smoke checks. Reuse the broader local Playwright coverage as the baseline, then run `pnpm lint` and `pnpm test` before opening the PR.
