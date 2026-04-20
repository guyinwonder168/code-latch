# Phase 1 Foundation Design

- **Date:** 2026-04-21
- **Status:** Approved
- **Scope:** CodeLatch Phase 1 — Repository Scaffold + Canonical Contracts
- **Related truth docs:**
  - `product-docs/implementation-plan.md`
  - `product-docs/technical-design.md`
  - `product-docs/codelatch-prd.md`

---

## Goal

Establish the first real CodeLatch implementation surface as a TypeScript/Node.js monorepo with stable package boundaries, canonical shared contracts, baseline schemas, and genuine repository verification commands.

This phase should create a usable foundation for later adapter and core work without prematurely implementing runtime behavior that belongs to Phases 2 and beyond.

---

## Chosen Approach

The approved approach is the **balanced foundation**:

- create the monorepo and package skeletons,
- add real but minimal repository tooling for lint, typecheck, and tests,
- define canonical contracts and the first schema set,
- and keep implementation intentionally thin and type-first.

This approach avoids both under-building the foundation and over-designing runtime behavior before the host adapters exist.

---

## Rejected Alternatives

### 1. Thin foundation

Only create the smallest possible workspace and contract stubs.

Why rejected:
- likely creates churn in Phase 2 and Phase 3,
- leaves too many root-tooling decisions unresolved,
- and weakens the value of the Phase 1 verification gate.

### 2. Heavy foundation

Build a near-production monorepo with broad schemas and richer internal utilities.

Why rejected:
- overfits before enough runtime behavior is proven,
- increases risk of speculative abstractions,
- and violates the plan's intent to keep early phases stable, small, and verifiable.

---

## Architecture

Phase 1 should establish a **contracts-first monorepo**. The main output is not runtime workflow behavior. The main output is a stable shared surface that later phases can depend on.

The repository should introduce the foundational packages named in the implementation plan:

- `packages/core/`
- `packages/schemas/`
- `packages/workflow-contracts/`
- `packages/adapter-base/`
- `packages/shared-utils/`

The architectural rule for this phase is:

> **types, schemas, and package boundaries now; real command execution behavior later**.

That keeps Phase 1 aligned with the technical design's layered model and prevents runtime concerns from leaking into scaffolding work.

---

## Package Responsibilities

### `packages/core`

Owns the shared core boundary, but only as a thin placeholder surface in Phase 1.

It may export:
- shared entrypoint placeholders,
- package-level public interfaces,
- and types needed to express future core contracts.

It should **not** implement real bootstrap, sync, drift, or adapter-dispatch behavior yet.

### `packages/schemas`

Owns the initial runtime and interchange schema layer.

The first schema set should cover the records already named in the implementation plan:
- project manifest,
- truth-doc registry,
- adapter metadata,
- distribution manifest,
- approval record,
- and run contract.

This package should export both Zod schemas and inferred TypeScript types.

### `packages/workflow-contracts`

Owns shared semantic contracts used across core and adapters:
- canonical command enums,
- command result shapes,
- workflow-event enums,
- and injection-policy contracts.

This package should define the shared language of the framework before host-specific adapters appear.

### `packages/adapter-base`

Owns the host-agnostic adapter interface.

It should define:
- canonical adapter capabilities,
- adapter metadata contracts,
- renderer or emitter interface boundaries if needed,
- and any host-neutral abstractions that later adapters must implement.

This package should remain intentionally small so it does not become a speculative framework.

### `packages/shared-utils`

Owns only tiny pure helpers that are immediately needed by the contract and schema layer.

This package must stay minimal. No convenience dumping ground.

---

## Repository Tooling

The root repository should add the following early:

- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `vitest.config.ts`

And the following scripts should exist at the root:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm test:integration`
- `pnpm test:conformance`
- `pnpm test`
- `pnpm verify`

The tooling should be **real but minimal**:

- pnpm workspaces for package orchestration,
- TypeScript for package boundaries and typechecking,
- Vitest for unit and later integration/conformance harness growth,
- Zod for runtime schema validation,
- and a lightweight lint setup that gives a meaningful Phase 1 gate without dragging in avoidable complexity.

---

## Testing Strategy

Phase 1 should follow TDD, but the tests will mostly be contract and schema tests rather than behavioral pipeline tests.

The first unit tests should prove:

- schemas accept valid fixtures,
- schemas reject invalid fixtures,
- canonical enums and contract exports are available and stable,
- and package public entrypoints can be imported without broken boundaries.

This phase does **not** need rich integration behavior yet. The integration and conformance folders can be scaffolded now for later phases while the active gate remains centered on unit tests.

---

## Boundary Rules

To keep this phase clean:

1. do not implement real bootstrap or sync behavior,
2. do not introduce host-specific adapter code yet,
3. do not create large utility abstractions without a present need,
4. keep functions pure and package boundaries explicit,
5. and keep exported surfaces small enough that Phase 2 can build directly on them without refactoring churn.

---

## Success Criteria

Phase 1 is successful when:

- the workspace installs cleanly,
- the five foundational packages exist,
- the canonical contracts and initial schemas are exported,
- unit tests cover the initial schema and contract surface,
- and the required gate passes:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test:unit`

---

## Expected Outcome

At the end of Phase 1, CodeLatch should have a stable monorepo foundation and a trustworthy shared contract layer.

That gives Phase 2 a concrete base for building the OpenCode adapter runtime shell without reopening fundamental repository structure decisions.
