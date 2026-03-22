# Mathinik Content Schema

This document defines the MVP content model for Mathinik.

It exists for two audiences:
- **humans/agents** reading the repo later, including opencode
- **tooling** that will validate or generate JSON content files

The source of truth for validation lives in `schemas/mathinik-content.schema.json`.
This markdown file is the human-readable companion spec.

## Design goals

The schema is optimized for the current PRD decisions:
- children **build math**
- MVP is **interaction-first**
- offline-first PWA
- content stored as static JSON
- only **two core interaction types** at launch:
  1. `equation-builder`
  2. `object-manipulation`
- support-only interactions:
  - `multiple-choice`
  - `numeric-input`

## Content hierarchy

Mathinik content is organized like this:

- `content-pack`
  - `grades[]`
    - `skills[]`
      - `lessons[]`
        - `activities[]`

### Why this shape

This mirrors the PRD:
- curriculum grouped by **grade first**
- then by **skill/topic**
- then by **short lessons**
- each lesson contains a **small activity sequence** suited to a 5–10 minute session

## Top-level object: `content-pack`

A content pack represents a versioned bundle of curriculum content that the app can cache offline.

Required fields:
- `schemaVersion`
- `packId`
- `title`
- `version`
- `grades`

Optional fields:
- `locale`
- `updatedAt`
- `description`

Example:

```json
{
  "schemaVersion": "1.0.0",
  "packId": "mathinik-core-en",
  "title": "Mathinik Core Content",
  "version": "2026.03.21",
  "locale": "en",
  "grades": []
}
```

## Grade object

A grade groups skills for a curriculum level.

Required fields:
- `id`
- `grade`
- `title`
- `skills`

Example:

```json
{
  "id": "grade-1",
  "grade": 1,
  "title": "Grade 1",
  "skills": []
}
```

## Skill object

A skill groups lessons around one topic, such as number sense or addition.

Required fields:
- `id`
- `slug`
- `title`
- `domain`
- `lessons`

Recommended `domain` values for MVP:
- `number-sense`
- `addition-subtraction`
- `multiplication-foundations`
- `word-problems`

Example:

```json
{
  "id": "g1-add-within-10",
  "slug": "add-within-10",
  "title": "Addition Within 10",
  "domain": "addition-subtraction",
  "lessons": []
}
```

## Lesson object

A lesson is a short sequence of activities focused on one skill.

Required fields:
- `id`
- `slug`
- `title`
- `goal`
- `activities`

Optional fields:
- `estimatedMinutes`
- `unlock`
- `reward`
- `tags`

### Lesson design rules

- Keep lessons small.
- Prefer 3–6 activities for MVP.
- Default `estimatedMinutes` should usually land in the 5–10 minute range.
- Lessons should unlock through completion plus minimum mastery.

Example:

```json
{
  "id": "lesson-add-1",
  "slug": "build-addition-within-5",
  "title": "Build Addition Within 5",
  "goal": "Understand simple addition by combining groups and building equations.",
  "estimatedMinutes": 6,
  "activities": []
}
```

## Activity object

An activity is the smallest learner-facing interaction unit.

Required fields:
- `id`
- `type`
- `prompt`
- `difficulty`
- `success`

Optional fields:
- `intro`
- `hint`
- `explanation`
- `followUp`
- `masteryWeight`
- `audio`
- `ui`
- `content`

### Activity `type`

Allowed MVP values:
- `equation-builder` — **core**
- `object-manipulation` — **core**
- `multiple-choice` — support only
- `numeric-input` — support only

## Core interaction types

### `equation-builder`

Use for drag-and-drop equation construction.

Required `content` fields:
- `leftSide`
- `rightSide`
- `palette`
- `validAnswers`

Typical palette items:
- number tokens
- operator tokens
- visual group tokens

Use this when the child should build math by arranging numbers, operators, and visual groups/objects.

### `object-manipulation`

Use for directly manipulating visual groups or objects.

Required `content` fields:
- `scene`
- `task`
- `validAnswers`

Use this when the child should count, group, combine, separate, or match objects.

## Support interaction types

### `multiple-choice`

Use only when a short check or alternate representation is helpful.

Required `content` fields:
- `choices`
- `correctChoiceIds`

### `numeric-input`

Use only when a short answer-production step is useful.

Required `content` fields:
- `acceptedAnswers`

## Feedback model

Every activity should support scaffolded feedback.

### Hint
A hint should help the child try again without immediately revealing the answer.

### Explanation
An explanation should clarify the idea visually or concretely after repeated struggle.

### Follow-up
A follow-up is used to defend against guessing or shallow success.
It should ask for the same idea in a second representation.

Example uses:
- build the equation, then match the visual group
- manipulate the group, then confirm the number

## Success object

Each activity must define what success means.

Required fields:
- `mode`
- `stars`

Recommended `mode` values:
- `exact-match`
- `set-match`
- `numeric-match`
- `choice-match`

## Unlock object

Lesson unlocks should reflect the PRD rule: completion plus minimum mastery.

Suggested fields:
- `requiresLessonIds`
- `minStars`
- `minMastery`

## Reward object

Rewards should stay lightweight in MVP.

Suggested fields:
- `starsAvailable`
- `badgeId`
- `mapNodeId`

## Authoring guidance

### Keep authoring honest

Do not create lots of equal-weight activity types in MVP.
The schema allows support formats, but product identity should stay centered on:
- `equation-builder`
- `object-manipulation`

### Prefer second representations

If an activity could be brute-forced, add a `followUp` activity or confirmation step.

### Keep reading load low

- prompts should be short
- lean visual-first
- avoid text-heavy word problems
- if word problems are used, keep them limited and visually supported

### Keep touch interactions forgiving

Content should assume:
- large drop zones
- obvious targets
- easy correction
- low penalty for accidental touch mistakes

## File organization recommendation

Recommended content layout for the repo:

```text
content/
  packs/
    mathinik-core-en.json
schemas/
  mathinik-content.schema.json
  mathinik-activity.schema.json
CONTENT-SCHEMA.md
```

## Opencode note

If opencode or another agent is asked later to add or edit Mathinik content:
- read `PRD.md` first
- read `CONTENT-SCHEMA.md` second
- validate against `schemas/mathinik-content.schema.json`
- preserve the MVP rule that core interactions are `equation-builder` and `object-manipulation`
