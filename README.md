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
pnpm build:pages
pnpm preview
pnpm pages:dev
pnpm deploy
pnpm lint
pnpm format
pnpm test:unit
pnpm test:e2e
pnpm test
```

Run `pnpm build` before `pnpm preview`, because preview serves the generated
production bundle on `http://127.0.0.1:4173`.

## Cloudflare Pages Baseline

Mathinik now includes a Pages deployment baseline in `wrangler.jsonc` using
Pages advanced mode.

- `pnpm build:pages` prepares `dist/pages`, which contains the Pages asset
  bundle plus a generated `_worker.js` that forwards app requests to the
  TanStack Start server output.
- `pnpm pages:dev` builds that output and serves it locally at
  `http://127.0.0.1:8788` through Wrangler Pages.
- `pnpm deploy` builds the Pages output and uploads `dist/pages` using
  Wrangler Pages Direct Upload.
- `scripts/build-pages.mjs` keeps the Pages bundle explicit by copying hashed
  assets and the server build into a single deployable directory.

If this is the first Pages deployment for the repository, create the Pages
project first with `pnpm exec wrangler pages project create mathinik` and then
run `pnpm deploy`.
