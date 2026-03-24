# Mathinik Implementation Plan

This document translates the existing project docs into an execution plan for implementation.

It is the primary source for generating GitHub issues.

Read this after:
- `PRD.md`
- `CONTENT-SCHEMA.md`
- `STATE-SCHEMA.md`
- `ARCHITECTURE.md`
- `STACK-DECISIONS.md`

## Purpose

This file exists to:
- sequence the MVP work in a dependency-aware order
- define issue-sized implementation units
- make it easy for agents or humans to pick the next task
- support a workflow where **one branch contains many commits from different issues**
- support a later **single bundled PR** once the issue set is complete

## Planned working model

Mathinik implementation is expected to follow this execution style:

- one long-lived implementation branch
- one GitHub issue = one commit
- multiple issue commits accumulate on the same branch
- each commit should be scoped tightly to a single issue
- the branch should remain healthy as work progresses
- one final PR can be opened after the planned batch or MVP is complete

## Branch and commit discipline

### Branch model
Use one implementation branch for the active build phase.

Suggested branch name example:
- `feat/mathinik-mvp`

### Commit model
Each issue should produce exactly one coherent commit whenever practical.

Suggested commit format:
- `feat: scaffold app shell (#12)`
- `feat: add local profile persistence (#13)`
- `test: add lesson engine progression tests (#24)`

### Rules
- do not mix unrelated issues into one commit
- do not leave the branch in a broken state after a commit
- do not skip referenced docs when implementing an issue
- if an issue is too large for one coherent commit, it should be split before implementation

## How to use this file to create issues

Each task below includes:
- **ID** — stable plan identifier
- **Title** — suggested GitHub issue title
- **Why** — why the task matters
- **Depends on** — prerequisite tasks
- **References** — source docs to read before implementation
- **Acceptance criteria** — definition of done
- **Suggested commit scope** — what should fit in the commit for that issue

When creating GitHub issues from this plan:
- use one issue per task unless explicitly grouped
- copy the `References` and `Acceptance criteria` into the issue body
- keep issue order dependency-aware
- label issues that are safe for agents, for example `agent-ok`

---

# Phase 0 — Project Foundation

## MIP-001 — Scaffold the frontend app shell

**Why**
Create the baseline project structure for all later work.

**Depends on**
- none

**References**
- `ARCHITECTURE.md`
- `STACK-DECISIONS.md`

**Acceptance criteria**
- TanStack Start app is scaffolded in the repo
- TypeScript is configured and working
- base app routes render successfully
- the app runs locally in development
- the app builds successfully for production

**Suggested commit scope**
Initial app scaffold, baseline route structure, and minimal startup wiring only.

---

## MIP-002 — Set up package scripts and developer tooling baseline

**Why**
Establish consistent local development commands.

**Depends on**
- MIP-001

**References**
- `STACK-DECISIONS.md`

**Acceptance criteria**
- pnpm is used consistently
- scripts exist for dev, build, test, lint/format, and preview
- Biome is configured and runnable
- repository README/setup instructions are updated if needed

**Suggested commit scope**
Tooling and scripts only; no feature work.

---

## MIP-003 — Set up Tailwind and selective shadcn/ui baseline

**Why**
Provide styling primitives for the shell and support surfaces.

**Depends on**
- MIP-001

**References**
- `STACK-DECISIONS.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- Tailwind is configured and working
- shadcn/ui is installed/configured for selective use
- basic shell styling primitives render correctly
- no learner-facing core interaction UI is implemented in this issue

**Suggested commit scope**
Styling system and support primitives only.

---

## MIP-004 — Set up testing baseline

**Why**
Ensure new work can be verified from the start.

**Depends on**
- MIP-001

**References**
- `STACK-DECISIONS.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- Vitest is configured
- Testing Library is configured
- Playwright is configured
- at least one smoke test exists for each layer
- CI-friendly test commands exist

**Suggested commit scope**
Testing infrastructure only.

---

## MIP-005 — Set up Cloudflare Pages deployment baseline

**Why**
Make deployment part of implementation from the start.

**Depends on**
- MIP-001

**References**
- `STACK-DECISIONS.md`

**Acceptance criteria**
- project can build for Cloudflare Pages
- deployment configuration is present
- preview or deploy instructions are documented
- basic deployed shell can be verified

**Suggested commit scope**
Deployment baseline only, not full offline/PWA behavior.

---

# Phase 1 — Data and Validation Foundation

## MIP-006 — Implement content schema validation and content loading module

**Why**
All lesson content depends on safe validated content loading.

**Depends on**
- MIP-001

**References**
- `CONTENT-SCHEMA.md`
- `schemas/mathinik-content.schema.json`
- `ARCHITECTURE.md`
- `STACK-DECISIONS.md`

**Acceptance criteria**
- content pack JSON can be loaded from the app
- Ajv validates content packs at runtime
- invalid content fails clearly
- normalized content access layer exists
- example content pack loads successfully

**Suggested commit scope**
Content repository + schema validation + example pack loading.

---

## MIP-007 — Implement local state schema validation and persistence abstraction

**Why**
Profile/progress persistence is a core product requirement.

**Depends on**
- MIP-001

**References**
- `STATE-SCHEMA.md`
- `schemas/mathinik-state.schema.json`
- `ARCHITECTURE.md`
- `STACK-DECISIONS.md`

**Acceptance criteria**
- persistence abstraction exists
- localStorage-backed implementation exists
- saved state validates at load boundaries
- invalid or missing state is handled safely
- example local state can be loaded

**Suggested commit scope**
State store abstraction + local persistence + runtime validation.

---

## MIP-008 — Define normalized internal models for content and state access

**Why**
The rest of the app should not depend on raw JSON layout details.

**Depends on**
- MIP-006
- MIP-007

**References**
- `ARCHITECTURE.md`
- `CONTENT-SCHEMA.md`
- `STATE-SCHEMA.md`

**Acceptance criteria**
- normalized lesson/activity/profile models exist
- raw schema objects are not passed everywhere in UI code
- adapter/mapper layer is covered by tests

**Suggested commit scope**
Normalization/adaptation layer only.

---

# Phase 2 — Profiles and Onboarding

## MIP-009 — Implement child profile creation flow

**Why**
Parent-managed local child profiles are core to MVP.

**Depends on**
- MIP-007

**References**
- `PRD.md`
- `STATE-SCHEMA.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- parent can create a child profile locally
- profile includes display name and starting grade
- created profile persists across refresh
- invalid input is handled cleanly

**Suggested commit scope**
Create-profile UI + persistence wiring only.

---

## MIP-010 — Implement profile switcher and active profile handling

**Why**
Multiple local child profiles on one device are part of MVP.

**Depends on**
- MIP-009

**References**
- `PRD.md`
- `STATE-SCHEMA.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- user can switch between child profiles
- active profile selection persists locally
- wrong profile data is not leaked into another profile’s state

**Suggested commit scope**
Profile switching and active-profile resolution only.

---

## MIP-011 — Implement starting grade selection and optional placement shell

**Why**
The app must support manual starting choice and optional placement.

**Depends on**
- MIP-009
- MIP-006

**References**
- `PRD.md`
- `STATE-SCHEMA.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- parent can manually choose a starting grade/path
- placement entry point exists as an optional path
- placement result can be stored in local state
- recommendation fields are persisted correctly

**Suggested commit scope**
Onboarding path selection and placement persistence shell; not full placement intelligence.

---

# Phase 3 — Lesson Runtime Foundation

## MIP-012 — Implement lesson session runner skeleton

**Why**
The lesson engine is the backbone of the learning loop.

**Depends on**
- MIP-006
- MIP-007
- MIP-008

**References**
- `PRD.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- lesson can start from content definitions
- lesson session tracks current activity index
- lesson can advance between activities
- lesson can produce a session summary shell

**Suggested commit scope**
Lesson runner skeleton only; no rich interaction logic yet.

---

## MIP-013 — Implement resume-state handling for in-progress lessons

**Why**
Short 5–10 minute sessions require strong resume behavior.

**Depends on**
- MIP-012
- MIP-007

**References**
- `PRD.md`
- `STATE-SCHEMA.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- in-progress lesson state is persisted
- reopening the app restores resumable lesson context
- resume can continue from last known activity
- restart remains possible

**Suggested commit scope**
Resume-state persistence and restoration only.

---

# Phase 4 — Core Interaction Engine

## MIP-014 — Implement activity renderer dispatch by type

**Why**
The app needs a clean way to route activities to mechanic-specific components.

**Depends on**
- MIP-012
- MIP-008

**References**
- `CONTENT-SCHEMA.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- activity renderer routes by `type`
- core activity component boundaries exist
- unsupported activity types fail safely

**Suggested commit scope**
Activity rendering dispatch and component boundaries only.

---

## MIP-015 — Implement `equation-builder` interaction

**Why**
This is one of the two core MVP mechanics.

**Depends on**
- MIP-014

**References**
- `PRD.md`
- `CONTENT-SCHEMA.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- numbers/operators/groups can be dragged into equation slots
- success can be evaluated from content-defined answers
- interaction works on mobile/touch screens
- component behavior is tested

**Suggested commit scope**
Equation builder mechanic only.

---

## MIP-016 — Implement `object-manipulation` interaction

**Why**
This is the second core MVP mechanic.

**Depends on**
- MIP-014

**References**
- `PRD.md`
- `CONTENT-SCHEMA.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- objects/groups can be manipulated according to activity definitions
- result can be evaluated against content rules
- interaction works on mobile/touch screens
- component behavior is tested

**Suggested commit scope**
Object manipulation mechanic only.

---

## MIP-017 — Implement forgiving touch/drag behavior shared by core mechanics

**Why**
Touch forgiveness is a make-or-break product quality requirement.

**Depends on**
- MIP-015
- MIP-016

**References**
- `PRD.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- accidental mis-drags can be corrected easily
- snap/drop behavior is clear and forgiving
- touch targets are usable on mobile
- wrong drops do not feel punitive
- interaction tests cover correction flows

**Suggested commit scope**
Shared touch forgiveness behavior only.

---

## MIP-018 — Implement support-only `multiple-choice` and `numeric-input` activities

**Why**
Support mechanics are needed, but must not dominate the product.

**Depends on**
- MIP-014

**References**
- `PRD.md`
- `CONTENT-SCHEMA.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- multiple-choice and numeric-input activity components exist
- components are clearly treated as support formats
- no lesson flow assumes quiz formats are primary

**Suggested commit scope**
Support activity components only.

---

# Phase 5 — Feedback, Evaluation, and Learning Rules

## MIP-019 — Implement activity evaluation module

**Why**
The app must separate raw interaction results from educational interpretation.

**Depends on**
- MIP-015
- MIP-016
- MIP-018

**References**
- `ARCHITECTURE.md`
- `CONTENT-SCHEMA.md`

**Acceptance criteria**
- activity result evaluation is centralized
- success modes are interpreted correctly
- evaluation logic is testable in isolation

**Suggested commit scope**
Evaluation rules only.

---

## MIP-020 — Implement hint → retry → explanation flow

**Why**
This scaffolded feedback loop is core to the learning experience.

**Depends on**
- MIP-019
- MIP-012

**References**
- `PRD.md`
- `CONTENT-SCHEMA.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- hints can be shown before answer reveal
- retry flow works correctly
- explanations can be shown after repeated struggle
- lesson engine integrates the flow correctly

**Suggested commit scope**
Scaffolded feedback flow only.

---

## MIP-021 — Implement second-representation / guessing-resistance flow

**Why**
The app should avoid shallow brute-force success.

**Depends on**
- MIP-019
- MIP-020

**References**
- `PRD.md`
- `CONTENT-SCHEMA.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- follow-up representation logic can be triggered
- second-step confirmation can be enforced when configured
- tests cover guessing-resistance behavior

**Suggested commit scope**
Second-representation flow only.

---

# Phase 6 — Mastery, Rewards, and Unlocks

## MIP-022 — Implement lesson completion and star calculation

**Why**
Lesson completion drives progression and rewards.

**Depends on**
- MIP-019
- MIP-012

**References**
- `PRD.md`
- `STATE-SCHEMA.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- lesson completion is computed deterministically
- stars are calculated and stored correctly
- replay can preserve or improve best stars

**Suggested commit scope**
Lesson completion + star logic only.

---

## MIP-023 — Implement skill mastery updates

**Why**
Mastery is essential to progression and parent summary.

**Depends on**
- MIP-022

**References**
- `PRD.md`
- `STATE-SCHEMA.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- mastery values update correctly per skill
- status transitions (`practicing`, `mastered`, etc.) work correctly
- state persists correctly across refresh

**Suggested commit scope**
Mastery update logic only.

---

## MIP-024 — Implement unlock logic and reward granting

**Why**
Progression requires completion plus minimum mastery.

**Depends on**
- MIP-022
- MIP-023

**References**
- `PRD.md`
- `STATE-SCHEMA.md`
- `ARCHITECTURE.md`
- `CONTENT-SCHEMA.md`

**Acceptance criteria**
- unlock rules can be evaluated from lesson metadata
- newly unlocked lessons are persisted
- badges/rewards are granted and stored correctly

**Suggested commit scope**
Unlock + reward logic only.

---

# Phase 7 — Child Experience UI

## MIP-025 — Implement child home screen with resume card and progression entry

**Why**
The child home screen is the hub of short-session usage.

**Depends on**
- MIP-013
- MIP-024

**References**
- `PRD.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- active child home screen renders
- resume card appears when a lesson is resumable
- progression entry point is visible
- child-facing UI remains mobile-friendly

**Suggested commit scope**
Home screen shell and core child-entry flow only.

---

## MIP-026 — Implement world map / progression UI

**Why**
Map progression is a major motivational layer.

**Depends on**
- MIP-024
- MIP-025

**References**
- `PRD.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- unlocked vs locked lessons are visually distinct
- next recommended lesson is clear
- progress path reflects stored state

**Suggested commit scope**
Map/progression presentation only.

---

## MIP-027 — Implement lesson completion screen and reward presentation

**Why**
The app needs satisfying closure after a lesson.

**Depends on**
- MIP-022
- MIP-024

**References**
- `PRD.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- lesson completion screen shows stars and progress outcome
- next-step choice is clear
- reward/badge presentation works

**Suggested commit scope**
Lesson-complete UI only.

---

## MIP-028 — Implement mascot/personalization baseline

**Why**
Light personalization is part of the product feel.

**Depends on**
- MIP-009
- MIP-025

**References**
- `PRD.md`
- `STATE-SCHEMA.md`

**Acceptance criteria**
- child name appears in appropriate places
- lightweight mascot/avatar selection is supported
- personalization persists locally

**Suggested commit scope**
Personalization baseline only.

---

# Phase 8 — Parent Experience

## MIP-029 — Implement parent summary screen

**Why**
Parent-assisted usage requires a simple progress summary.

**Depends on**
- MIP-023
- MIP-024

**References**
- `PRD.md`
- `STATE-SCHEMA.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- parent summary shows completed lessons
- mastery summary is visible
- rewards/stars are visible
- view is derived from local state only

**Suggested commit scope**
Parent summary UI and derivation only.

---

# Phase 9 — Offline and Update Flow

## MIP-030 — Implement PWA installability and app-shell caching

**Why**
Offline-first is part of the product promise.

**Depends on**
- MIP-005

**References**
- `STACK-DECISIONS.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- app is installable as a PWA
- service worker is active
- app shell caches correctly
- app starts correctly after prior load when offline

**Suggested commit scope**
PWA installability and shell cache only.

---

## MIP-031 — Implement content-pack caching and version-aware updates

**Why**
Offline curriculum access depends on explicit content caching.

**Depends on**
- MIP-006
- MIP-030

**References**
- `CONTENT-SCHEMA.md`
- `ARCHITECTURE.md`
- `STACK-DECISIONS.md`

**Acceptance criteria**
- content packs are cached for offline use
- app can detect newer content version when online
- update path is explicit and safe

**Suggested commit scope**
Content caching and update detection only.

---

## MIP-032 — Implement safe content refresh behavior with state preservation

**Why**
Updates must not quietly break local progress and resume state.

**Depends on**
- MIP-031
- MIP-007

**References**
- `CONTENT-SCHEMA.md`
- `STATE-SCHEMA.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- content updates do not wipe learner state
- known lesson/profile references remain stable when possible
- update failure degrades safely

**Suggested commit scope**
Safe refresh and state-preservation logic only.

---

# Phase 10 — Initial Content Authoring

## MIP-033 — Author first real Grade 1 content pack slice

**Why**
The app needs real content beyond examples.

**Depends on**
- MIP-006

**References**
- `PRD.md`
- `CONTENT-SCHEMA.md`

**Acceptance criteria**
- at least one real skill/topic slice exists for Grade 1
- content validates successfully
- content exercises both core mechanics

**Suggested commit scope**
Initial real content only.

---

## MIP-034 — Add limited visually supported word-problem content

**Why**
Word problems are in MVP only in a constrained way.

**Depends on**
- MIP-033
- MIP-018

**References**
- `PRD.md`
- `CONTENT-SCHEMA.md`

**Acceptance criteria**
- word-problem content remains limited in scope
- reading burden is low
- visuals meaningfully support comprehension
- content validates successfully

**Suggested commit scope**
Limited word-problem content only.

---

# Phase 11 — Testing and QA Hardening

## MIP-035 — Add unit and component coverage for core engines

**Why**
The app’s logic-heavy modules need confidence before release.

**Depends on**
- MIP-019
- MIP-022
- MIP-023
- MIP-024

**References**
- `ARCHITECTURE.md`
- `STACK-DECISIONS.md`

**Acceptance criteria**
- evaluation, mastery, unlock, and persistence behaviors have direct tests
- core component tests exist for interaction components
- failures are meaningful and maintainable

**Suggested commit scope**
Test coverage additions only.

---

## MIP-036 — Add end-to-end coverage for critical learner flows

**Why**
Touch-heavy flows and resume/progression behavior require E2E verification.

**Depends on**
- MIP-025
- MIP-026
- MIP-027
- MIP-030

**References**
- `PRD.md`
- `ARCHITECTURE.md`
- `STACK-DECISIONS.md`

**Acceptance criteria**
- E2E tests cover profile creation
- E2E tests cover starting a lesson
- E2E tests cover completing a lesson
- E2E tests cover resume behavior
- E2E tests cover offline-start or offline-return flows where practical

**Suggested commit scope**
Critical-path E2E tests only.

---

# Phase 12 — Deployment Verification and Release Readiness

## MIP-037 — Verify deployed Cloudflare Pages build and smoke-test production-like flow

**Why**
A working local build is not enough.

**Depends on**
- MIP-005
- MIP-030
- MIP-031
- MIP-036

**References**
- `STACK-DECISIONS.md`
- `ARCHITECTURE.md`

**Acceptance criteria**
- deployed build is reachable
- app shell works on deployed environment
- content loads in deployed environment
- basic learner flow works in deployed environment
- no obvious deployment-only failures remain

**Suggested commit scope**
Deployment verification and environment-specific fixes only.

---

## MIP-038 — Run release-readiness pass for MVP branch

**Why**
Before the final PR, the long-lived branch needs a holistic readiness check.

**Depends on**
- all prior MVP tasks intended for the current release batch

**References**
- `PRD.md`
- `ARCHITECTURE.md`
- `STACK-DECISIONS.md`
- this file

**Acceptance criteria**
- build passes
- relevant tests pass
- docs are up to date enough for implementation handoff
- branch health is acceptable for final PR
- known blockers are documented explicitly if any remain

**Suggested commit scope**
Release-readiness fixes, small cleanup, and explicit documentation updates only.

---

# Suggested issue execution order

Recommended initial order:

1. MIP-001
2. MIP-002
3. MIP-003
4. MIP-004
5. MIP-005
6. MIP-006
7. MIP-007
8. MIP-008
9. MIP-009
10. MIP-010
11. MIP-011
12. MIP-012
13. MIP-013
14. MIP-014
15. MIP-015
16. MIP-016
17. MIP-017
18. MIP-018
19. MIP-019
20. MIP-020
21. MIP-021
22. MIP-022
23. MIP-023
24. MIP-024
25. MIP-025
26. MIP-026
27. MIP-027
28. MIP-028
29. MIP-029
30. MIP-030
31. MIP-031
32. MIP-032
33. MIP-033
34. MIP-034
35. MIP-035
36. MIP-036
37. MIP-037
38. MIP-038

## Note on issue ordering

If a task is discovered to be too large for one issue/one commit, split it before implementation.
Do not quietly inflate issue scope on the long-lived branch.

---

# Agent loop guidance

If an agent is executing issues from this plan:
- choose only issues whose dependencies are satisfied
- stay within the currently assigned batch
- read all listed `References` before implementing
- keep commit scope aligned with `Suggested commit scope`
- run relevant validation/tests before finalizing the commit
- stop and ask when an issue is ambiguous, blocked, or larger than planned

---

# Definition of implementation-plan success

This plan is successful if:
- GitHub issues can be created directly from it
- each issue is small enough to map to one coherent commit
- the issue order preserves branch health
- the final implementation branch can be reviewed as an ordered stack of issue commits

---

# Opencode note

If opencode or another agent is asked to implement an issue from this plan:
- read the referenced markdown docs first
- implement only the issue’s intended scope
- keep the branch healthy after the commit
- assume one issue should normally map to one commit on the long-lived branch
t on the long-lived branch
