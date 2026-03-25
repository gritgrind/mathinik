# Mathinik

Mathinik is an offline-first, interaction-first math learning app for Grade 1
to Grade 3 learners. This repository now includes the initial TanStack Start
app shell, developer tooling baseline, support-surface styling primitives, and
testing setup for the first implementation batch.

## Stack

- React with TanStack Start
- TypeScript and pnpm
- Tailwind CSS v4 with selective shadcn/ui primitives
- Biome for linting and formatting
- Vitest, Testing Library, and Playwright for smoke coverage

## Getting Started

```bash
pnpm install
pnpm dev
```

The local app runs at `http://127.0.0.1:3000`.

## Common Commands

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm format
pnpm test:unit
pnpm test:e2e
pnpm test
```

Run `pnpm build` before `pnpm preview`, because preview serves the generated
production bundle on `http://127.0.0.1:4173`.
