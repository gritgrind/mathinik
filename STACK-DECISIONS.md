# Mathinik Stack Decisions

This document records the current implementation technology decisions for Mathinik MVP.

It should be read after:
- `PRD.md`
- `CONTENT-SCHEMA.md`
- `STATE-SCHEMA.md`
- `ARCHITECTURE.md`

This file exists to make implementation planning concrete and to reduce ambiguity when creating GitHub issues later.

## Decision status

These are the current stack decisions for MVP unless explicitly marked as future-facing.

---

## 1. Application shape

### Decision
Mathinik MVP will be a **static-first frontend application**.

### Why
This matches the current product scope:
- static JSON content packs
- local child profiles
- local-first progress persistence
- no cloud accounts in MVP
- no admin CMS in MVP
- offline-first PWA experience

### Implication
Do not introduce backend complexity unless a feature clearly requires it.

---

## 2. Frontend framework

### Decision
Use **React** with **TanStack Start**.

### Why
This fits the project’s needs well:
- strong support for complex interactive UIs
- mature ecosystem for testing and touch-heavy components
- good TypeScript ergonomics
- modern routing/app structure without forcing a heavy backend model
- strong long-term maintainability

### Constraint
TanStack Start should be used where it helps, but the product’s real complexity lives in lesson flow and interaction mechanics, not in over-engineered route data patterns.

---

## 3. Deployment platform

### Decision
Deploy MVP on **Cloudflare Pages**.

### Why
This fits the MVP architecture:
- static-first frontend
- edge-friendly hosting
- PWA-compatible deployment model
- easy delivery of versioned content assets

### Future direction
If backend behavior is needed later, the likely evolution path is:
- **Cloudflare Workers** for server-side logic
- **Cloudflare D1** and/or **R2** depending persistence/storage needs

This is future-facing only and is **not** part of MVP scope.

---

## 4. Styling and UI approach

### Decision
Use **Tailwind CSS** plus **shadcn/ui selectively**.

### Why
This provides:
- fast development of application shell and support UI
- consistency for layout and primitives
- flexibility for highly custom learning interactions

### Rule
Use shadcn/ui for:
- dialogs
- sheets
- popovers
- forms
- simple settings/profile UI
- parent summary scaffolding

Do **not** let shadcn/ui define the core learner experience for:
- equation builder
- object manipulation
- map/game progression feel
- child-facing interaction surfaces

Those should be custom components.

---

## 5. Client-side app state

### Decision
Use **Zustand** for local application state.

### Why
This fits the MVP well:
- low ceremony
- easy local-first state modeling
- good fit for profile selection, session state, resume state, and UI state
- easier to keep lightweight than Redux-style architectures

### Intended uses
Zustand should be used for:
- active profile selection
- current lesson/session state
- transient UI state
- app-level coordination state

Do not treat it as a dumping ground for raw content definitions.

---

## 6. Local persistence

### Decision
Use **localStorage first, behind a persistence abstraction**.

### Why
This is the most practical MVP choice:
- sufficient for the current local-first profile/progress model
- easy to implement
- avoids premature storage complexity
- preserves a migration path to IndexedDB or other storage later

### Rule
All persistence must go through a small storage interface.

Do not scatter direct `localStorage` calls across the app.

### Future evolution
If local state becomes too large or more complex, move behind the same interface to:
- IndexedDB
- Dexie
- or another browser persistence layer

Browser SQLite is explicitly **not** recommended for MVP.

---

## 7. Data validation

### Decision
Use **JSON Schema as the source of truth** and **Ajv for runtime validation**.

### Why
Mathinik already has explicit schema files for:
- content data
- learner state

Those schemas should remain canonical.

### Rule
- JSON Schema defines the contract.
- Ajv validates runtime-loaded data.
- TypeScript-friendly helpers/types may sit on top, but must not replace runtime validation.

### Reason
Content packs and local state are loaded data, not trusted compile-time code.

---

## 8. Testing stack

### Decision
Use:
- **Vitest** for unit tests
- **Testing Library** for component behavior tests
- **Playwright** for end-to-end and interaction-heavy flows

### Why
This is the best fit for the chosen frontend stack and product risks.

### Priority areas
Testing should focus first on:
- touch interactions
- forgiving drag/drop behavior
- lesson progression
- resume behavior
- mastery/unlock logic
- offline/update behavior

---

## 9. Analytics

### Decision
Use **no analytics in MVP**.

### Why
This is a deliberate early-stage and privacy-conscious choice.
It keeps MVP simpler and avoids premature instrumentation in a child-focused product.

### Tradeoff
This reduces visibility into product usage patterns.
That is acceptable for MVP.

### Future note
Product analytics can be reconsidered later once the core learning experience is validated.

---

## 10. Monitoring

### Decision
Use **lightweight error monitoring** in MVP.

### Why
Even a static-first offline-capable app can fail in subtle ways:
- update issues
- cache issues
- local persistence issues
- browser/runtime edge cases

Minimal error monitoring provides visibility without introducing heavy observability tooling.

---

## 11. Package manager

### Decision
Use **pnpm**.

### Why
It is a strong default for modern TypeScript projects:
- reliable
- fast
- ecosystem-friendly
- good fit for structured repos and future growth

---

## 12. Linting and formatting

### Decision
Use **Biome** only.

### Why
This keeps the toolchain simple and modern:
- fewer moving parts than ESLint + Prettier
- fast enough for routine development
- good fit for a greenfield TypeScript project

---

## 13. Routing and app data posture

### Decision
Use **TanStack Start routing/data features where they fit**, but do not force everything into route-based data patterns.

### Why
This app’s core complexity is in:
- learner interactions
- lesson flow
- local state
- progression logic

not in server-driven route loaders.

### Rule
Keep route abstractions helpful, not dominant.

---

## 14. PWA and offline strategy

### Decision
Implement **real service worker support and cache strategy from early MVP**.

### Why
Offline-first is part of the product promise, not a future enhancement.

### Required capabilities
- app shell caching
- content pack caching
- safe update detection
- explicit refresh/update behavior when new content is available online

### Rule
Do not fake offline support with only installability.

---

## 15. Authentication posture

### Decision
MVP will use **no cloud auth/account system**.

### Why
This matches the product decisions:
- local child profiles only
- parent-assisted use
- no cloud sync in MVP

### Future note
Future auth is acknowledged, but deliberately not selected yet.
No auth vendor should be chosen now.

---

## 16. Summary of chosen MVP stack

### Core stack
- React
- TanStack Start
- TypeScript
- Tailwind CSS
- shadcn/ui (selectively)
- Zustand
- Ajv
- pnpm
- Biome
- Vitest
- Testing Library
- Playwright

### Deployment
- Cloudflare Pages

### Offline/persistence
- service worker + cache strategy
- localStorage behind a persistence abstraction

### Not in MVP
- backend-driven persistence
- cloud auth
- analytics platform
- full observability stack
- browser SQLite

---

## 17. Implications for implementation planning

`IMPLEMENTATION-PLAN.md` should assume:
- a frontend-first work breakdown
- Cloudflare Pages deployment tasks
- service worker work as an early concern
- storage abstraction work early
- Ajv/schema validation work early
- Playwright coverage for touch-heavy flows
- custom interaction components for learner-facing mechanics

---

## Opencode note

If opencode or another agent is asked later to implement Mathinik:
- read `PRD.md`
- read `CONTENT-SCHEMA.md`
- read `STATE-SCHEMA.md`
- read `ARCHITECTURE.md`
- read `STACK-DECISIONS.md`
- then derive or follow `IMPLEMENTATION-PLAN.md`

These stack decisions should be treated as the current implementation baseline for MVP.
