# Mathinik State Schema

This document defines the MVP local state model for Mathinik.

It is the human-readable companion to:
- `schemas/mathinik-state.schema.json`

Read this file when you need to understand how Mathinik stores:
- local child profiles
- lesson progress
- mastery
- rewards
- resume state
- placement choices/results
- parent summary data

## Why this exists

Mathinik is intentionally split into two data worlds:

1. **Content data** — curriculum, lessons, activities, hints, explanations
2. **Learner state** — what a child has done on this device

`CONTENT-SCHEMA.md` covers content.
`STATE-SCHEMA.md` covers saved local progress.

## MVP storage model

For MVP, learner state is:
- local to the browser/device
- not cloud-synced
- profile-based
- offline-first

This matches the PRD decisions:
- parent-assisted setup
- multiple child profiles on one device
- offline-capable PWA
- no backend persistence in MVP

## Top-level object: `state-store`

The state store is the complete persisted local data object.

Required fields:
- `schemaVersion`
- `deviceId`
- `profiles`

Optional fields:
- `activeProfileId`
- `contentVersion`
- `updatedAt`

Example:

```json
{
  "schemaVersion": "1.0.0",
  "deviceId": "device-local-001",
  "contentVersion": "2026.03.21",
  "activeProfileId": "child-ava",
  "profiles": []
}
```

## Profile object

A profile represents one child on one device.

Required fields:
- `id`
- `displayName`
- `gradeStart`
- `createdAt`
- `progress`

Optional fields:
- `avatar`
- `placement`
- `preferences`
- `lastActiveAt`

### Profile design rules

- Keep identity lightweight.
- This is not a cloud account.
- No email/password in MVP.
- The profile should support light personalization only.

## Progress object

`progress` is the main learner-state object.

Required fields:
- `unlockedLessonIds`
- `completedLessonIds`
- `lessonProgress`
- `skillMastery`
- `rewards`
- `resume`

This object should answer:
- what is unlocked?
- what is complete?
- what mastery has been earned?
- where should the learner resume?
- what has the child been rewarded for?

## Lesson progress

`lessonProgress` is a map keyed by `lessonId`.

Each lesson record should store:
- attempt count
- best stars
- completion state
- last activity index
- whether the lesson is resumable
- whether a replay improved prior performance

## Skill mastery

`skillMastery` is a map keyed by `skillId`.

Each skill record should store:
- mastery value from `0` to `1`
- status label such as:
  - `not-started`
  - `practicing`
  - `approaching-mastery`
  - `mastered`
- updated timestamp

This keeps parent summaries simple and child-facing badges easy to derive.

## Rewards

Rewards should stay lightweight in MVP.

Recommended stored reward data:
- total stars earned
- badge ids earned
- completed map nodes

Do not turn this into a complex economy in MVP.

## Resume state

Resume state exists because the app is designed around short 5–10 minute sessions.

Store:
- current lesson id
- current activity id
- current activity index
- resumable boolean
- last touched timestamp

The app should auto-resume by default, with restart available in the UI.

## Placement object

Placement remains optional in MVP.

Store:
- whether placement was used
- recommended grade
- recommended skill or lesson
- summary result label

This allows:
- manual start path
- optional check-in path
- later revision of the recommendation logic

## Preferences object

Keep preferences minimal in MVP.

Possible fields:
- `soundEnabled`
- `reducedMotion`
- `handedness` (optional, if touch UX later needs it)

## Parent summary derivation

The parent summary screen should be derivable from local state.

It should not require a separate analytics data model in MVP.

A simple parent summary can be derived from:
- unlocked/completed lesson ids
- best stars
- skill mastery statuses
- recent activity timestamps
- rewards earned

## File organization recommendation

Recommended repo layout:

```text
schemas/
  mathinik-content.schema.json
  mathinik-state.schema.json
CONTENT-SCHEMA.md
STATE-SCHEMA.md
content/
  packs/
state/
  examples/
    local-state.example.json
```

## Opencode note

If opencode or another agent is asked later to build persistence or resume behavior:
- read `PRD.md`
- read `CONTENT-SCHEMA.md`
- read `STATE-SCHEMA.md`
- validate saved state against `schemas/mathinik-state.schema.json`
- preserve the MVP rule that state is **local-first, profile-based, and lightweight**
