# Phase 1 Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the CodeLatch Phase 1 monorepo scaffold with real root tooling, foundational packages, canonical contracts, baseline schemas, and unit tests that satisfy the Phase 1 verification gate.

**Architecture:** This phase is contracts-first. It creates a TypeScript/pnpm monorepo with thin package boundaries and type/schema exports, while deferring real runtime command behavior to later phases. The implementation should stay minimal, test-driven, and explicit about package responsibilities.

**Tech Stack:** Node.js 20+, TypeScript, pnpm workspaces, Vitest, Zod

---

### Task 1: Create root workspace and repository tooling

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `vitest.config.ts`
- Create: `tsconfig.json`
- Create: `tests/unit/.gitkeep`
- Create: `tests/integration/.gitkeep`
- Create: `tests/conformance/.gitkeep`
- Create: `tests/fixtures/.gitkeep`

**Step 1: Write the failing test**

Create a root smoke test file to assert the workspace package exports can eventually be imported:

```ts
import { describe, expect, it } from 'vitest';

describe('workspace foundation', () => {
  it('exposes foundational package entrypoints', async () => {
    await expect(import('@codelatch/core')).resolves.toBeDefined();
    await expect(import('@codelatch/schemas')).resolves.toBeDefined();
    await expect(import('@codelatch/workflow-contracts')).resolves.toBeDefined();
    await expect(import('@codelatch/adapter-base')).resolves.toBeDefined();
    await expect(import('@codelatch/shared-utils')).resolves.toBeDefined();
  });
});
```

Save it as `tests/unit/workspace-foundation.test.ts`.

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit`

Expected: FAIL because the workspace config and package entrypoints do not exist yet.

**Step 3: Write minimal implementation**

Create:
- root `package.json` with workspace scripts for `lint`, `typecheck`, `test:unit`, `test:integration`, `test:conformance`, `test`, and `verify`
- `pnpm-workspace.yaml` covering `packages/*`
- `tsconfig.base.json` with shared compiler settings
- `tsconfig.json` as the root solution config
- `vitest.config.ts` wired for the repository test folders
- placeholder test directories under `tests/`

Keep the root config lean and Phase-1-oriented.

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit tests/unit/workspace-foundation.test.ts`

Expected: still FAIL until package entrypoints exist; this task is only complete after Task 2 creates those packages.

**Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json tsconfig.json vitest.config.ts tests
git commit -m "chore: add monorepo root tooling"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

### Task 2: Create foundational package manifests and entrypoints

**Files:**
- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/src/index.ts`
- Create: `packages/schemas/package.json`
- Create: `packages/schemas/tsconfig.json`
- Create: `packages/schemas/src/index.ts`
- Create: `packages/workflow-contracts/package.json`
- Create: `packages/workflow-contracts/tsconfig.json`
- Create: `packages/workflow-contracts/src/index.ts`
- Create: `packages/adapter-base/package.json`
- Create: `packages/adapter-base/tsconfig.json`
- Create: `packages/adapter-base/src/index.ts`
- Create: `packages/shared-utils/package.json`
- Create: `packages/shared-utils/tsconfig.json`
- Create: `packages/shared-utils/src/index.ts`
- Modify: `tests/unit/workspace-foundation.test.ts`

**Step 1: Write the failing test**

Keep `tests/unit/workspace-foundation.test.ts` and make sure it imports the exact package names you will publish internally.

If package names change, update the test first.

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit tests/unit/workspace-foundation.test.ts`

Expected: FAIL because package manifests and source entrypoints are still missing.

**Step 3: Write minimal implementation**

Create each foundational package with:
- a small `package.json`
- a local `tsconfig.json`
- a `src/index.ts` public entrypoint

Each package should export only minimal placeholders at first, enough for imports to resolve and for later tasks to add real types and schemas.

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit tests/unit/workspace-foundation.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add packages tests/unit/workspace-foundation.test.ts
git commit -m "chore: add foundational workspace packages"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

### Task 3: Define canonical workflow contracts

**Files:**
- Modify: `packages/workflow-contracts/src/index.ts`
- Test: `tests/unit/workflow-contracts.test.ts`

**Step 1: Write the failing test**

Create `tests/unit/workflow-contracts.test.ts`.

Test for:
- canonical command enum exports,
- workflow-event enum exports,
- command result shape compatibility,
- injection-policy contract exports.

Example shape:

```ts
import { describe, expect, it } from 'vitest';
import {
  CanonicalCommand,
  WorkflowEvent,
  type CommandResult,
} from '@codelatch/workflow-contracts';

describe('workflow contracts', () => {
  it('exports canonical commands', () => {
    expect(CanonicalCommand.BOOTSTRAP).toBeDefined();
  });

  it('exports workflow events', () => {
    expect(WorkflowEvent.BEFORE_COMMAND).toBeDefined();
  });

  it('supports command result typing', () => {
    const result: CommandResult = { success: true };
    expect(result.success).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit tests/unit/workflow-contracts.test.ts`

Expected: FAIL because the exports are not implemented yet.

**Step 3: Write minimal implementation**

Add:
- canonical command enum for the CodeLatch command set named in the truth docs
- workflow-event enum with the initial canonical internal events
- command result interfaces/types
- injection-policy interfaces kept intentionally small

Keep the module focused and host-neutral.

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit tests/unit/workflow-contracts.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add packages/workflow-contracts tests/unit/workflow-contracts.test.ts
git commit -m "feat: add canonical workflow contracts"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

### Task 4: Define the host-agnostic adapter base contract

**Files:**
- Modify: `packages/adapter-base/src/index.ts`
- Test: `tests/unit/adapter-base.test.ts`

**Step 1: Write the failing test**

Create `tests/unit/adapter-base.test.ts`.

Test for:
- exported adapter interface,
- adapter metadata type availability,
- a small fixture object satisfying the adapter contract.

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit tests/unit/adapter-base.test.ts`

Expected: FAIL because the adapter contract exports are not defined yet.

**Step 3: Write minimal implementation**

Add:
- canonical adapter interface
- adapter identity/capability types
- adapter metadata contracts aligned with the implementation plan and technical design

Do not add host-specific behavior.

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit tests/unit/adapter-base.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add packages/adapter-base tests/unit/adapter-base.test.ts
git commit -m "feat: add adapter base contracts"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

### Task 5: Add the initial shared schema package

**Files:**
- Modify: `packages/schemas/src/index.ts`
- Test: `tests/unit/schemas.test.ts`

**Step 1: Write the failing test**

Create `tests/unit/schemas.test.ts`.

Write tests that:
- parse valid examples for project manifest, truth-doc registry, adapter metadata, distribution manifest, approval record, and run contract
- reject at least one invalid example per schema

Use table-driven tests if that keeps the file small and clear.

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit tests/unit/schemas.test.ts`

Expected: FAIL because the schemas do not exist yet.

**Step 3: Write minimal implementation**

Implement the initial Zod schemas and export inferred types.

Keep them:
- aligned to current truth docs,
- strict enough to be meaningful,
- but still minimal for Phase 1.

Avoid speculative fields unless the current docs clearly require them.

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit tests/unit/schemas.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add packages/schemas tests/unit/schemas.test.ts
git commit -m "feat: add initial runtime schemas"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

### Task 6: Add minimal shared utilities and core boundary exports

**Files:**
- Modify: `packages/shared-utils/src/index.ts`
- Modify: `packages/core/src/index.ts`
- Test: `tests/unit/core-exports.test.ts`

**Step 1: Write the failing test**

Create `tests/unit/core-exports.test.ts`.

Test that:
- `@codelatch/core` exports a stable placeholder public surface
- `@codelatch/shared-utils` exports only tiny pure helpers actually used by the contract/schema layer

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit tests/unit/core-exports.test.ts`

Expected: FAIL because the planned exports are not present yet.

**Step 3: Write minimal implementation**

In `packages/shared-utils`, add only the smallest pure helpers needed now.

In `packages/core`, export a thin shared-core boundary such as:
- version or package constants,
- placeholder public types,
- future entrypoint stubs that do not implement runtime behavior.

Keep this task intentionally light.

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit tests/unit/core-exports.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add packages/core packages/shared-utils tests/unit/core-exports.test.ts
git commit -m "feat: add shared core boundary exports"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

### Task 7: Add lint and typecheck coverage for the new workspace

**Files:**
- Modify: `package.json`
- Create or Modify: root lint config files as needed
- Test: existing unit tests

**Step 1: Write the failing test**

For this task, the failing check is the tool gate itself.

Run the root verification commands before the lint setup is complete.

**Step 2: Run test to verify it fails**

Run:
- `pnpm lint`
- `pnpm typecheck`

Expected: at least one command FAILS until the configuration is fully wired.

**Step 3: Write minimal implementation**

Add the smallest real lint configuration that fits the repository.

Goal:
- `pnpm lint` performs an actual check
- `pnpm typecheck` checks the workspace cleanly

Avoid a heavy lint regime in Phase 1.

**Step 4: Run test to verify it passes**

Run:
- `pnpm lint`
- `pnpm typecheck`

Expected: PASS.

**Step 5: Commit**

```bash
git add package.json tsconfig.base.json tsconfig.json .
git commit -m "chore: add repository verification tooling"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

### Task 8: Run the Phase 1 verification gate

**Files:**
- No new files expected unless fixes are required

**Step 1: Write the failing test**

The gate itself is the test.

Run all required Phase 1 verification commands.

**Step 2: Run test to verify it fails**

Run:
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit`

Expected: if any command fails, stop, inspect, and fix the smallest missing issue before retrying.

**Step 3: Write minimal implementation**

Apply only the minimal fixes needed to make the gate pass.

Do not broaden scope into Phase 2 behavior.

**Step 4: Run test to verify it passes**

Run:
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit`

Expected: all PASS.

Optionally also run:
- `pnpm test:integration`
- `pnpm test:conformance`
- `pnpm verify`

If those commands are intentionally empty or placeholder-backed in Phase 1, document that clearly in the implementation notes.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: complete phase 1 repository foundation"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

## Notes for the Implementer

- Follow the truth docs, especially `product-docs/implementation-plan.md` and `product-docs/technical-design.md`.
- Keep modules small and functional.
- Use explicit dependencies and pure helpers.
- Do not implement OpenCode adapter behavior yet.
- Do not implement bootstrap or sync behavior yet.
- If a truth-doc contradiction appears, stop and update docs before continuing.

## Phase 1 Done Means

- the repository has a real pnpm/TypeScript workspace,
- foundational packages compile,
- canonical contracts exist,
- baseline schemas exist,
- unit tests prove the initial shared surface,
- and the Phase 1 gate passes cleanly.
