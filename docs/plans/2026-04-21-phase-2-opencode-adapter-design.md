# Phase 2 OpenCode Adapter Design

- **Date:** 2026-04-21
- **Status:** Approved
- **Scope:** CodeLatch Phase 2 — OpenCode Adapter Runtime Shell
- **Related truth docs:**
  - `product-docs/implementation-plan.md`
  - `product-docs/technical-design.md`
  - `docs/plans/2026-04-21-phase-1-foundation-design.md`

---

## Goal

Build the first real host-native adapter shell for CodeLatch using OpenCode's documented runtime plugin model.

This phase should prove that the Phase 1 contracts are usable by a real host adapter, while still keeping all product behavior in shared core packages rather than inside the adapter.

---

## Chosen Approach

The approved approach is a **broader, contract-driven first slice**:

- create the `@codelatch/adapter-opencode` package,
- add the OpenCode plugin entry module,
- implement renderers for `AGENTS.md`, `opencode.json`, command wrappers, and adapter metadata,
- wire a minimal invocation bridge into the shared core boundary,
- and verify emitted OpenCode-native surfaces through fixture-driven integration tests.

This approach intentionally proves more than a toy shell. It validates that the shared contracts created in Phase 1 can already drive a real host-native adapter package.

---

## Rejected Alternatives

### 1. Smallest runnable shell

Only add a package skeleton, a plugin entrypoint, and one minimal renderer.

Why rejected:
- too narrow to meaningfully validate the adapter architecture,
- delays renderer and metadata integration that are already part of the Phase 2 goal,
- and increases the chance of another reshaping pass in Phase 2.5 work that does not formally exist.

### 2. Static placeholder rendering

Hardcode OpenCode-native outputs first and retrofit Phase 1 contracts later.

Why rejected:
- weakens proof that the Phase 1 contract layer is useful,
- encourages temporary patterns that would need to be unwound,
- and risks putting OpenCode-specific assumptions in the wrong layer.

---

## Architecture

Phase 2 should keep the architecture rule from the technical design intact:

> **All product behavior lives in the framework core. Adapters own host-native discovery surfaces, rendering, and invocation transport only.**

That means the OpenCode adapter must stay thin.

The new package should:
- consume shared contracts from `@codelatch/adapter-base`, `@codelatch/workflow-contracts`, and `@codelatch/core`,
- own OpenCode-specific rendering and plugin wiring,
- and avoid implementing any Phase 3 bootstrap behavior ahead of time.

The purpose of this phase is not to make bootstrap real. The purpose is to make the OpenCode shell real.

---

## Package Shape

The OpenCode adapter package should follow this structure:

```text
packages/adapter-opencode/
  package.json
  tsconfig.json
  src/
    index.ts
    plugin/
      index.ts
    render/
      agents-md.ts
      opencode-json.ts
      command-wrappers.ts
    metadata/
      index.ts
```

This split keeps responsibilities clear:

- `src/index.ts` — package public surface
- `src/plugin/index.ts` — OpenCode plugin entrypoint and invocation bridge
- `src/render/*.ts` — pure host-native renderers
- `src/metadata/index.ts` — OpenCode adapter metadata generation

This structure also keeps later OpenCode-specific expansion localized rather than scattering host logic across shared packages.

---

## Rendering Model

The renderers should be **pure functions**.

They should accept typed inputs and return deterministic content or structured data. They should not write to disk directly.

Expected renderer responsibilities:

### `agents-md.ts`

Generates the OpenCode-native `AGENTS.md` instruction anchor content needed for the adapter shell.

### `opencode-json.ts`

Generates the OpenCode project configuration object or serialized output required by the adapter.

### `command-wrappers.ts`

Generates thin branded wrapper definitions for the initial CodeLatch command surface.

### `metadata/index.ts`

Builds OpenCode adapter metadata that describes:
- OpenCode-native discovery surfaces,
- canonical workflow-event mappings,
- wrapper mode,
- and host-facing adapter identity.

The important design decision is that these outputs should be derived from the shared contract layer wherever possible rather than from untyped OpenCode-specific constants.

---

## Invocation Bridge

The plugin entry module should include a **minimal invocation bridge** from the OpenCode plugin surface into the current shared core boundary.

This bridge should:
- accept normalized host invocation input,
- map the request into a shared-core-facing call shape,
- and return a stable placeholder result until later phases make the shared core behavior real.

This is a shell, not a behavior engine.

So the invocation bridge should prove connectivity and contract usage, not implement real command execution.

---

## OpenCode Event Mapping

Phase 2 should introduce the first explicit mapping table from canonical CodeLatch workflow events to OpenCode runtime hooks and deterministic wrapper checkpoints.

This table does not need to cover every future event in rich detail, but it should prove the model:

- canonical internal event names remain shared,
- OpenCode realization stays host-native,
- and wrapper checkpoints may be used where native runtime events are not sufficient.

This is important because the technical design explicitly rejects fake cross-host event symmetry.

---

## Testing Strategy

Phase 2 verification should be integration-heavy relative to Phase 1.

Add:
- `tests/integration/opencode/adapter-shell.test.ts`
- `tests/fixtures/adapters/opencode/`

The integration test should prove:

1. emitted surfaces match documented OpenCode locations,
2. only OpenCode-native surfaces are produced,
3. adapter metadata is generated consistently,
4. and the plugin shell can call a skeletal core entrypoint successfully.

This test should work from fixtures and renderer outputs rather than requiring a full live OpenCode installation.

---

## Boundary Rules

To keep Phase 2 clean:

1. do not implement real bootstrap, sync, or drift behavior,
2. do not write product behavior into the adapter package,
3. keep all renderers pure and deterministic,
4. keep the plugin bridge minimal and contract-oriented,
5. and do not emit non-native instruction or config surfaces by default.

---

## Success Criteria

Phase 2 is successful when:

- `packages/adapter-opencode/` exists as a real package,
- the package exposes a plugin entrypoint,
- OpenCode-native renderers exist for `AGENTS.md`, `opencode.json`, command wrappers, and metadata,
- the adapter metadata includes the initial canonical-event-to-host mapping,
- the plugin shell can invoke a skeletal shared-core boundary,
- and Phase 2 integration tests prove the emitted surfaces are limited to OpenCode-native needs.

---

## Expected Outcome

At the end of Phase 2, CodeLatch should no longer be only a shared contract library. It should exist as a real OpenCode-native adapter shell built from the shared contract model.

That creates the stable host shell needed for Phase 3, where the shared core begins to perform real bootstrap work.
