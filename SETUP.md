# Frontend — Setup

> This repo ships the **conventions skeleton** (config, layer structure, registries, a worked
> example, CI). Nuxt generates its `.nuxt/` types on `yarn dev`/`yarn prepare`; `tsconfig.json`
> and `eslint.config.mjs` extend files under `.nuxt/`, so run an install/prepare first.

## Prerequisites
- Node 20+
- Yarn 4 (via Corepack: `corepack enable`)
- The backend API running (see `../nokta_platform_backend`)

## Install & run
```bash
corepack enable
yarn install
cp .env.example .env        # point NUXT_PUBLIC_API_BASE at the backend
yarn dev                    # http://localhost:3000
```

## Quality gates (also run in CI)
```bash
yarn lint        # ESLint incl. MVC layer-boundary rules
yarn typecheck   # strict TypeScript (vue-tsc)
yarn test        # Vitest (unit tests on *.utils.ts / *.model.ts)
yarn dedupe --check   # dependency hygiene: one version per package
yarn check       # lint + typecheck + test
```

## Conventions in practice
See `components/example/RecordCard/` — the canonical layout for every component/view:
`*.vue` (View) · `*.utils.ts` (Controller) · `*.model.ts` (Model + mapper) · `*.design.ts` (design)
· `*.spec.ts` (tests). Copy this shape; keep logic out of the `.vue`.

## First work
Start with **Phase 0/1** (see `../crm_emr_platform_plan/` roadmap). The rendering engine
(`components/render/SurfaceRenderer.vue`) and registries are stubbed for Phase 1.
