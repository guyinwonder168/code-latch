# Phase 2 OpenCode Adapter Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the first real OpenCode-native adapter package for CodeLatch, including the plugin entry module, pure renderers for OpenCode-native surfaces, adapter metadata generation, and an integration-tested shell that invokes a skeletal core boundary.

**Architecture:** This phase adds a thin host adapter on top of the Phase 1 contract layer. The adapter owns only OpenCode-native rendering, discovery wiring, metadata, and invocation transport. Product behavior remains in shared packages.

**Tech Stack:** Node.js 20+, TypeScript, pnpm workspaces, Vitest, OpenCode-native file surface generation

---

### Task 1: Create the OpenCode adapter package skeleton

**Files:**
- Create: `packages/adapter-opencode/package.json`
- Create: `packages/adapter-opencode/tsconfig.json`
- Create: `packages/adapter-opencode/src/index.ts`
- Test: `tests/integration/opencode/adapter-shell.test.ts`
- Create: `tests/fixtures/adapters/opencode/.gitkeep`

**Step 1: Write the failing test**

Create `tests/integration/opencode/adapter-shell.test.ts` with a first assertion that importing `@codelatch/adapter-opencode` succeeds and exposes the planned public entrypoint surface.

**Step 2: Run test to verify it fails**

Run: `pnpm test:integration tests/integration/opencode/adapter-shell.test.ts`

Expected: FAIL because the package and integration test target do not exist yet.

**Step 3: Write minimal implementation**

Create the adapter package skeleton with:
- package manifest,
- TypeScript config,
- package entrypoint,
- integration test folder,
- OpenCode fixture directory.

Keep the public surface intentionally thin.

**Step 4: Run test to verify it passes**

Run: `pnpm test:integration tests/integration/opencode/adapter-shell.test.ts`

Expected: PASS for the package-import smoke assertion.

**Step 5: Commit**

```bash
git add packages/adapter-opencode tests/integration/opencode tests/fixtures/adapters/opencode
git commit -m "feat: add opencode adapter package skeleton"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

### Task 2: Add the OpenCode adapter metadata generator

**Files:**
- Create: `packages/adapter-opencode/src/metadata/index.ts`
- Modify: `packages/adapter-opencode/src/index.ts`
- Test: `tests/integration/opencode/adapter-shell.test.ts`

**Step 1: Write the failing test**

Extend `tests/integration/opencode/adapter-shell.test.ts` with assertions that the adapter exports metadata describing:
- OpenCode identity,
- discovery surfaces,
- wrapper mode,
- and canonical-event-to-host bindings.

**Step 2: Run test to verify it fails**

Run: `pnpm test:integration tests/integration/opencode/adapter-shell.test.ts`

Expected: FAIL because metadata generation does not exist yet.

**Step 3: Write minimal implementation**

Add a metadata module that returns a typed OpenCode adapter metadata object derived from shared contracts and OpenCode-specific host facts.

Keep metadata deterministic and minimal for Phase 2.

**Step 4: Run test to verify it passes**

Run: `pnpm test:integration tests/integration/opencode/adapter-shell.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add packages/adapter-opencode/src/metadata packages/adapter-opencode/src/index.ts tests/integration/opencode/adapter-shell.test.ts
git commit -m "feat: add opencode adapter metadata"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

### Task 3: Add the `AGENTS.md` renderer

**Files:**
- Create: `packages/adapter-opencode/src/render/agents-md.ts`
- Test: `tests/integration/opencode/adapter-shell.test.ts`

**Step 1: Write the failing test**

Add an integration assertion that rendering the OpenCode instruction anchor returns deterministic `AGENTS.md` content and targets the expected host-native location.

**Step 2: Run test to verify it fails**

Run: `pnpm test:integration tests/integration/opencode/adapter-shell.test.ts`

Expected: FAIL because the renderer does not exist yet.

**Step 3: Write minimal implementation**

Create a pure renderer that accepts typed adapter input and returns `AGENTS.md` content for the OpenCode shell.

Avoid filesystem writes here.

**Step 4: Run test to verify it passes**

Run: `pnpm test:integration tests/integration/opencode/adapter-shell.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add packages/adapter-opencode/src/render/agents-md.ts tests/integration/opencode/adapter-shell.test.ts
git commit -m "feat: add opencode agents renderer"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

### Task 4: Add the `opencode.json` renderer

**Files:**
- Create: `packages/adapter-opencode/src/render/opencode-json.ts`
- Test: `tests/integration/opencode/adapter-shell.test.ts`

**Step 1: Write the failing test**

Add an integration assertion that rendering the OpenCode config surface returns deterministic `opencode.json` output for the expected project-level location.

**Step 2: Run test to verify it fails**

Run: `pnpm test:integration tests/integration/opencode/adapter-shell.test.ts`

Expected: FAIL because the renderer does not exist yet.

**Step 3: Write minimal implementation**

Create a pure renderer that returns the OpenCode project config structure required by the shell.

Keep the payload minimal and aligned with Phase 2 only.

**Step 4: Run test to verify it passes**

Run: `pnpm test:integration tests/integration/opencode/adapter-shell.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add packages/adapter-opencode/src/render/opencode-json.ts tests/integration/opencode/adapter-shell.test.ts
git commit -m "feat: add opencode config renderer"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

### Task 5: Add command wrapper rendering

**Files:**
- Create: `packages/adapter-opencode/src/render/command-wrappers.ts`
- Test: `tests/integration/opencode/adapter-shell.test.ts`

**Step 1: Write the failing test**

Add integration assertions that the OpenCode adapter renders thin branded command wrapper definitions for the canonical CodeLatch command set required in Phase 2.

**Step 2: Run test to verify it fails**

Run: `pnpm test:integration tests/integration/opencode/adapter-shell.test.ts`

Expected: FAIL because wrapper rendering is not implemented yet.

**Step 3: Write minimal implementation**

Create a pure wrapper renderer that derives wrapper definitions from shared command contracts and OpenCode-native expectations.

Keep wrappers thin and deterministic.

**Step 4: Run test to verify it passes**

Run: `pnpm test:integration tests/integration/opencode/adapter-shell.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add packages/adapter-opencode/src/render/command-wrappers.ts tests/integration/opencode/adapter-shell.test.ts
git commit -m "feat: add opencode command wrapper renderer"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

### Task 6: Add the plugin entry module and minimal invocation bridge

**Files:**
- Create: `packages/adapter-opencode/src/plugin/index.ts`
- Modify: `packages/adapter-opencode/src/index.ts`
- Test: `tests/integration/opencode/adapter-shell.test.ts`

**Step 1: Write the failing test**

Add an integration assertion that the OpenCode plugin shell can call a skeletal shared-core boundary and receive a stable placeholder result.

**Step 2: Run test to verify it fails**

Run: `pnpm test:integration tests/integration/opencode/adapter-shell.test.ts`

Expected: FAIL because the plugin bridge does not exist yet.

**Step 3: Write minimal implementation**

Implement:
- an OpenCode plugin entry module,
- normalized invocation handling,
- a thin bridge into the current shared-core placeholder boundary.

Do not add real bootstrap or sync behavior.

**Step 4: Run test to verify it passes**

Run: `pnpm test:integration tests/integration/opencode/adapter-shell.test.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add packages/adapter-opencode/src/plugin packages/adapter-opencode/src/index.ts tests/integration/opencode/adapter-shell.test.ts
git commit -m "feat: add opencode plugin invocation bridge"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

### Task 7: Run the Phase 2 verification gate

**Files:**
- No new files expected unless fixes are required

**Step 1: Write the failing test**

The gate itself is the test.

Run the Phase 2 integration verification commands.

**Step 2: Run test to verify it fails**

Run:
- `pnpm typecheck`
- `pnpm test:integration tests/integration/opencode/adapter-shell.test.ts`

Expected: if anything fails, stop and fix the smallest missing issue before retrying.

**Step 3: Write minimal implementation**

Apply only the minimal fixes needed to make the gate pass.

Do not broaden scope into Phase 3 bootstrap behavior.

**Step 4: Run test to verify it passes**

Run:
- `pnpm typecheck`
- `pnpm test:integration tests/integration/opencode/adapter-shell.test.ts`

Expected: PASS.

Optionally also run:
- `pnpm lint`
- `pnpm test:unit`

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add opencode adapter runtime shell"
```

Do not run this commit step unless the user explicitly asks for a commit.

---

## Notes for the Implementer

- Follow `product-docs/implementation-plan.md` and `product-docs/technical-design.md` closely.
- Keep the adapter thin and host-native.
- Keep renderers pure and deterministic.
- Use shared contracts instead of OpenCode-specific hardcoding where possible.
- Do not implement real bootstrap behavior yet.
- If documentation assumptions about OpenCode change materially, update truth docs before continuing.

## Phase 2 Done Means

- `packages/adapter-opencode/` exists as a real package,
- OpenCode-native surfaces can be rendered from shared contracts,
- adapter metadata exists,
- the plugin shell invokes a skeletal core boundary,
- and integration verification proves the emitted shell is OpenCode-native and Phase-2-scoped.
