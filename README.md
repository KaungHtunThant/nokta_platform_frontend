# Nokta Platform — Frontend

Configurable, multi-tenant CRM + EMR client — **Nuxt 3 + TypeScript**, Pinia, PrimeVue.
Built **MVC-first**: screens render from tenant configuration via a generic engine.

See the planning set in [`../crm_emr_platform_plan/`](../crm_emr_platform_plan/).

## Conventions (enforced)
- **View** (`*.vue`) — UI/UX only, minimal script. No business logic, API calls, or animation logic.
- **Controller** (`*.utils.ts`) — business logic + API calls; maps DTOs → Models; assigns to stores.
- **Model (type)** (`*.model.ts`) — precise per-util typed shape + `from*` mapper (the only DTO→Model crossing).
- **Model (state)** (Pinia `stores/`) — pure typed state only; never holds raw DTOs.
- **API client** (`lib/api/`) — HTTP + endpoints; returns typed DTOs. Views/stores may not import it.
- **Design** (`*.design.ts`) — animation/style logic; base styles & layout are typed tokens (`design/`).
- One model per util/use-case; the type a util produces === the type its store slice stores.
- Boundaries enforced by `eslint.config.mjs`; strict TypeScript; logic unit-tested with Vitest.

See the worked example in `components/example/RecordCard/` (View + utils + model + design + spec).

## Status
Skeleton only — no business features yet. Build order is in the roadmap (Phase 0 first).

## Getting started
See [`SETUP.md`](SETUP.md).
