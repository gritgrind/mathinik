# Mathinik Architecture

This document defines the intended MVP architecture for Mathinik.

It bridges:
- `PRD.md` — product truth
- `CONTENT-SCHEMA.md` — curriculum/content truth
- `STATE-SCHEMA.md` — learner-state truth

This file should be used later to produce `IMPLEMENTATION-PLAN.md` and then GitHub issues.

## Architecture goals

Mathinik’s architecture should optimize for:
- **interaction-first math learning**
- **offline-first PWA behavior**
- **local-first learner state**
- **simple authoring through static JSON content packs**
- **clean separation between content, state, lesson flow, and UI mechanics**
- **small, deep modules with stable interfaces**

The architecture should protect the MVP from drifting back into a generic quiz app.

## Core architectural principles

### 1. Children build math

The architecture must treat interactive math-building as a first-class concern.

This means:
- activity rendering cannot be a thin wrapper around generic quiz widgets
- core interaction mechanics must have dedicated modules
- support formats like multiple choice and numeric input must not dominate the lesson engine design

### 2. Offline-first is a system property, not a bolt-on

The app should be usable once installed or loaded, even without reliable internet.

This means:
- app shell must be cacheable
- content packs must be cacheable
- learner progress must be stored locally
- content updates should be additive and safe when connectivity returns

### 3. Content and learner state are separate systems

Mathinik has two distinct data domains:

- **content**: grades, skills, lessons, activities, hints, explanations, rewards metadata
- **state**: child profiles, progress, mastery, resume state, unlocks, rewards earned

These must remain separate so:
- content can be versioned and updated safely
- state can be persisted locally without mutating authored lesson data
- testing remains cleaner

### 4. Use narrow interfaces between modules

Each major subsystem should do one job well and expose a small interface.

That keeps the MVP maintainable and makes later GitHub issues easier to map to module boundaries.

---

# System overview

Mathinik MVP is a **client-heavy offline-capable web app**.

High-level shape:

1. App boots into the PWA shell
2. App loads cached or bundled content packs
3. App loads local learner state from browser persistence
4. Parent selects or creates a child profile
5. Child enters the map/home flow
6. Lesson engine runs activities from content pack definitions
7. Interaction engine renders the activity mechanic
8. Results update local state: mastery, rewards, unlocks, resume
9. Parent summary derives from local learner state
10. When online, content update service checks for newer pack versions

---

# Recommended module map

## 1. App Shell

### Responsibility
Own the outer application frame and global lifecycle.

### Owns
- routing
- app boot/loading state
- global error boundaries
- layout shell
- PWA install/update prompts

### Should not own
- lesson-specific logic
- mastery calculation
- content parsing rules

---

## 2. Content Repository

### Responsibility
Load, validate, and provide authored curriculum content.

### Inputs
- static JSON content packs
- content schema validation rules

### Outputs
- typed/validated content pack objects
- lookup APIs for grades, skills, lessons, activities

### Suggested interface
- `loadContentPack()`
- `getGrades()`
- `getSkill(skillId)`
- `getLesson(lessonId)`
- `getActivity(lessonId, activityId)`
- `getContentVersion()`

### Notes
This module should be the only place that knows the raw pack layout.
The rest of the app should consume normalized lesson/activity objects.

---

## 3. Local State Store

### Responsibility
Persist and retrieve learner state from local browser storage.

### Inputs
- state schema
- profile changes
- lesson results
- unlock/mastery updates

### Outputs
- active profile state
- profile list
- persisted progress and resume data

### Suggested interface
- `loadStateStore()`
- `saveStateStore(state)`
- `createProfile(input)`
- `setActiveProfile(profileId)`
- `updateLessonProgress(profileId, patch)`
- `updateSkillMastery(profileId, skillId, mastery)`
- `updateResume(profileId, resume)`

### Notes
This module should hide storage implementation details.
It should be possible to swap LocalStorage/IndexedDB strategy later without rewriting the lesson engine.

---

## 4. Profile and Onboarding Module

### Responsibility
Handle parent-facing setup and profile selection.

### Owns
- create child profile flow
- choose starting grade/path
- optional placement check path
- profile switcher

### Inputs
- content repository for available grades/paths
- local state store for profile creation and updates

### Outputs
- active profile selected
- optional placement recommendation stored

### Notes
This module should remain lightweight in MVP.
It is not a full account system.

---

## 5. Lesson Engine

### Responsibility
Run the learner-facing lesson flow.

### Owns
- lesson session lifecycle
- current activity progression
- hint/retry/explanation flow
- completion decisions
- transition to follow-up representations when needed

### Inputs
- validated lesson definition from content repository
- current learner state

### Outputs
- session result summary
- per-activity outcomes
- completion signal
- resume state updates

### Suggested interface
- `startLesson(profileId, lessonId)`
- `resumeLesson(profileId, lessonId)`
- `submitActivityResult(result)`
- `advanceLesson()`
- `completeLesson()`

### Notes
The lesson engine should not directly own rendering.
It should coordinate flow and learning rules, while interaction-specific UI lives elsewhere.

---

## 6. Interaction Engine

### Responsibility
Render and evaluate learner interactions.

### MVP core mechanics
1. `equation-builder`
2. `object-manipulation`

### Support mechanics
- `multiple-choice`
- `numeric-input`

### Owns
- activity component dispatch by type
- interaction-level validation
- forgiving drag/drop behavior
- touch-friendly snapping and correction
- mechanic-specific event interpretation

### Suggested structure
- `ActivityRenderer`
  - `EquationBuilderActivity`
  - `ObjectManipulationActivity`
  - `MultipleChoiceActivity`
  - `NumericInputActivity`

### Notes
This is a critical architectural boundary.
The interaction engine should make it easy to add future interaction types **without** changing lesson progression rules.

---

## 7. Evaluation and Feedback Module

### Responsibility
Interpret activity outcomes and decide feedback behavior.

### Owns
- correct/incorrect evaluation
- hint trigger rules
- explanation trigger rules
- guessing-resistance checks
- follow-up representation triggers

### Inputs
- activity definition
- interaction result
- attempt history for the current session

### Outputs
- feedback action
- continue/retry/follow-up decision

### Notes
Keep this separate from the raw interaction components.
The interaction component captures what the child did.
This module interprets what that means educationally.

---

## 8. Mastery and Progression Engine

### Responsibility
Update learner progress after lesson/activity outcomes.

### Owns
- mastery value updates
- mastery status changes
- star calculations
- reward granting
- lesson completion state
- unlock decisions
- replay improvements

### Inputs
- lesson results
- prior profile state
- lesson unlock/reward metadata

### Outputs
- updated learner state patches
- completion summary
- newly unlocked content
- earned rewards

### Suggested interface
- `calculateActivityOutcome()`
- `calculateLessonCompletion()`
- `updateMastery()`
- `determineUnlocks()`
- `applyRewards()`

### Notes
This module should be deterministic and testable in isolation.
It is one of the most important “deep modules” in the system.

---

## 9. Map and Progress UI Module

### Responsibility
Present child-facing progression.

### Owns
- resume card
- world map / progression path
- next recommended lesson
- badges and simple progress visuals

### Inputs
- content repository for progression structure
- learner state for unlocks/completion/rewards

### Outputs
- navigation to lesson start/resume

### Notes
This module should remain mostly presentation-oriented.
It should not contain mastery or unlock rules itself.

---

## 10. Parent Summary Module

### Responsibility
Present parent-facing progress summaries.

### Owns
- completed lessons view
- stars/rewards summary
- simple mastery summary
- recent activity/resume context

### Inputs
- learner state only

### Outputs
- derived summary model for UI

### Notes
This should be a derived-read model over local state, not a separate analytics subsystem.

---

## 11. Offline and Update Module

### Responsibility
Handle caching, content version checks, and safe updates.

### Owns
- service worker coordination
- app shell caching
- content pack caching
- update detection
- safe swap/update rules

### Inputs
- content pack version metadata
- online/offline status

### Outputs
- cached content availability
- update notifications
- refreshed content pack data

### Notes
This module should protect learner continuity.
Do not allow careless content updates to break in-progress lessons or saved resume state.

---

# Data flow

## Boot flow

1. App Shell initializes
2. Offline and Update Module prepares cached assets/content
3. Content Repository loads current content pack
4. Local State Store loads saved learner state
5. Profile and Onboarding Module determines active profile or prompts setup
6. App routes to child home or onboarding

## Lesson flow

1. Child selects resume or lesson from map
2. Lesson Engine requests lesson definition from Content Repository
3. Lesson Engine requests current learner state from Local State Store
4. Interaction Engine renders current activity
5. Child performs interaction
6. Interaction Engine returns structured result
7. Evaluation and Feedback Module decides next action
8. Lesson Engine advances, retries, or shows explanation
9. On completion, Mastery and Progression Engine computes updates
10. Local State Store persists changes
11. Map and Progress UI updates available progression
12. Parent Summary can reflect derived changes immediately

## Update flow

1. Offline and Update Module detects connectivity
2. App checks content pack manifest/version
3. If newer content exists, download and validate
4. Swap active content pack only when safe
5. Preserve local learner state and existing lesson references where possible

---

# Key domain boundaries

## Boundary: content vs state

Never store authored lesson data inside learner state.
Never mutate content pack definitions to represent child progress.

### Reason
This separation is essential for:
- offline content updates
- clean testing
- future sync/migration options

## Boundary: interaction vs evaluation

The interaction component should report what happened.
The evaluation module should decide what it means.

### Reason
This allows:
- cleaner mechanic components
- reusable educational rules
- better testing of guessing-resistance and scaffolding flows

## Boundary: progression UI vs progression rules

The map UI should display unlocks and progress.
The mastery/progression engine should decide them.

### Reason
Avoid hidden business logic in UI components.

---

# Recommended internal models

These internal normalized models should exist even if the raw JSON shapes differ.

## Normalized Lesson
Suggested fields:
- `lessonId`
- `skillId`
- `grade`
- `title`
- `goal`
- `activityIds[]`
- `estimatedMinutes`
- `unlockRule`
- `rewardRule`

## Normalized Activity
Suggested fields:
- `activityId`
- `lessonId`
- `type`
- `prompt`
- `difficulty`
- `hint`
- `explanation`
- `followUp`
- `successRule`
- `uiModel`

## Normalized Profile State
Suggested fields:
- `profileId`
- `displayName`
- `gradeStart`
- `activeResume`
- `completedLessonIds`
- `unlockedLessonIds`
- `skillMastery`
- `rewards`

---

# Risks and tradeoffs

## 1. Mobile interaction complexity

### Risk
Core mechanics may feel fiddly or confusing for young children on phones.

### Architectural response
- keep mechanics narrow in MVP
- centralize forgiving interaction behavior
- test touch interactions early

## 2. Over-generalized activity system

### Risk
Trying to create a super-generic activity engine too early can make core interactions weak.

### Architectural response
- treat the two core mechanics as first-class modules
- allow support mechanics, but do not let the architecture center around quiz widgets

## 3. Content/state drift across updates

### Risk
Offline content updates could break saved progress or resume state.

### Architectural response
- version content packs explicitly
- preserve stable IDs
- treat content and learner state as separate domains

## 4. Scope creep around admin tooling

### Risk
A full CMS sneaks into the MVP and delays the learner experience.

### Architectural response
- keep authoring file-based for MVP
- do not add browser-based content editing to the core architecture yet

---

# Suggested technology direction

This is not the final stack decision, but the architecture suggests:
- component-based frontend
- strong TypeScript support
- schema validation at load boundaries
- local persistence abstraction over browser storage
- service worker / PWA support
- clean test support for touch-heavy UI

A likely fit is a modern TypeScript web stack, but stack choice should be finalized separately or folded into the implementation plan.

---

# What should become GitHub issues later

This architecture is designed to decompose into issues by module boundary.

Good issue buckets later:
- app shell + PWA boot
- content repository + validation
- local state store + persistence
- profile onboarding flow
- lesson engine
- equation-builder interaction
- object-manipulation interaction
- evaluation/feedback rules
- mastery/progression engine
- map/progress UI
- parent summary UI
- offline update flow

This is why `ARCHITECTURE.md` should come before `IMPLEMENTATION-PLAN.md`.

---

# Opencode note

If opencode or another agent is asked later to implement Mathinik:
- read `PRD.md`
- read `CONTENT-SCHEMA.md`
- read `STATE-SCHEMA.md`
- read `ARCHITECTURE.md`
- then derive or follow `IMPLEMENTATION-PLAN.md`

The architecture should be interpreted as:
- interaction-first
- offline-first
- local-state-first
- narrow MVP mechanics
- clean module boundaries
