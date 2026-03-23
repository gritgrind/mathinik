# Opencode Agent Notes

This file is written by opencode during controlled test runs. It documents agent-level observations and constraints for future runs.

## Doc reading confirmation

All six docs were read before this file was created:
- `PRD.md` — product definition, user stories, constraints
- `CONTENT-SCHEMA.md` — JSON content model and authoring rules
- `STATE-SCHEMA.md` — local learner state model
- `ARCHITECTURE.md` — 11-module system design
- `STACK-DECISIONS.md` — chosen tech stack (React, TanStack Start, Tailwind, Zustand, Ajv, Vitest, Playwright, pnpm, Biome, Cloudflare Pages)
- `IMPLEMENTATION-PLAN.md` — 38 ordered MIP tasks (MIP-001 to MIP-038)

## Key constraints for implementation

1. **Interaction-first**: Mathinik is NOT a quiz app. Core mechanics are `equation-builder` and `object-manipulation`. Support formats (`multiple-choice`, `numeric-input`) must not dominate.
2. **Two hard module boundaries**: content vs state (never mix), interaction vs evaluation (interaction reports what happened; evaluation decides meaning).
3. **Offline-first is a system property**: service worker + content pack caching from day one. Not a future feature.
4. **Local-first state**: no cloud, no backend in MVP. localStorage behind an abstraction.
5. **Schema validation at load boundaries**: Ajv validates content packs and saved state at runtime.
6. **One issue = one commit on the long-lived branch**: `feat/mathinik-mvp` accumulates commits; a bundled PR lands when the batch is complete.
7. **Forgiving touch UX**: accidental drags, wrong drops, easy correction — this is a make-or-break product requirement.
8. **Biome only**: no ESLint + Prettier. Biome handles linting and formatting.
9. **pnpm**: package manager. Not npm or yarn.
10. **shadcn/ui is selective**: use for dialogs, sheets, forms, settings. Do NOT use for core learner interaction surfaces.
11. **Before any implementation work**: read the six docs above. For a specific issue, also read the issue's References section in IMPLEMENTATION-PLAN.md.
12. **Agent loop rules**: pick only issues with satisfied dependencies, keep commit scope tight, stop and ask when blocked or ambiguous.

## Ambiguity notes

- No schema JSON files (`schemas/mathinik-content.schema.json`, `schemas/mathinik-state.schema.json`) exist in the repo yet. They are referenced in docs but not yet created. MIP-006 and MIP-007 will likely need to create these.
- The repo appears to be in a pre-implementation state — docs-only. No app code, no package.json, no src/ directory.

## Test run summary

- Branch: `opencode/test-run`
- Purpose: controlled test of opencode workflow, not implementation
- Action: created this OPENCODE.md file
