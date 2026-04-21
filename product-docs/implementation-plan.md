# CodeLatch Implementation Plan

- **Document Version:** 0.1.1
- **Document Status:** Draft
- **Product Name:** CodeLatch
- **Document Owner:** guyinwonder168
- **Last Updated:** 2026-04-20
- **Source of Truth Location:** `product-docs/implementation-plan.md`
- **Derived From:**
  - `product-docs/codelatch-prd.md`
  - `product-docs/technical-design.md`

---

## Changelog

### v0.1.1 - 2026-04-20
- Marked Phase 0 as completed during planning now that the truth-doc reconciliation has already been applied.
- Aligned plan wording with the final PRD and technical-design terminology cleanup.

### v0.1.0 - 2026-04-20
- Created the first implementation plan for CodeLatch MVP.
- Aligned implementation sequencing with officially verified host documentation for OpenCode, Kilo CLI, Claude Code, and Codex.
- Locked the adapter order to OpenCode first, Kilo Code second, Claude Code third, and Codex last.
- Clarified that CodeLatch uses one shared internal contract and per-host native emitters rather than one shared external plugin format.
- Clarified that Kilo Code should reuse OpenCode-compatible internals where verified while remaining a separate adapter.
- Clarified that Codex hooks are experimental and must not become a hard dependency of the plugin architecture.

---

## 1. Purpose

This document defines the implementation sequence for building CodeLatch MVP.

It translates the product and technical truth docs into an execution plan that answers:

- what to build first,
- how the work is phased,
- which packages and repository surfaces are introduced in each phase,
- what verification gates must pass before the next phase begins,
- and how the host adapters are added without breaking the shared framework model.

This document is the execution source of truth for implementation sequencing and delivery boundaries.

---

## 2. Planning Inputs and Live-Doc Validation

This plan is derived from the PRD and technical design, then cross-checked against current official host documentation before phase sequencing was finalized.

### 2.1 OpenCode - Verified Planning Assumptions

Verified host facts:
- plugins are JavaScript or TypeScript modules,
- project plugins live under `.opencode/plugins/`,
- project configuration is driven through `opencode.json`,
- commands, agents, skills, and plugins are host-native config/discovery surfaces,
- and plugin behavior is realized through runtime events and tool hooks rather than a packaged manifest format like Claude or Codex.

Planning consequence:
- OpenCode is the first implementation target,
- and the canonical CodeLatch runtime contract must first prove itself against a runtime plugin host rather than a packaged plugin marketplace host.

### 2.2 Kilo Code - Verified Planning Assumptions

Verified host facts:
- Kilo CLI explicitly documents that it supports the same configuration options as OpenCode,
- `AGENTS.md` is a real instruction surface,
- project-level configuration uses `opencode.json` / `.opencode/` compatible surfaces,
- Kilo has additional Kilo-native configuration and behavior surfaces,
- and current public docs do not expose a Kilo-only plugin authoring spec equivalent to Claude's `.claude-plugin/plugin.json` or Codex's `.codex-plugin/plugin.json`.

Planning consequence:
- Kilo Code is implemented as a separate adapter,
- but it intentionally reuses OpenCode-compatible internals where the docs truly overlap,
- and the plan must not assume a separate Kilo manifest-packaging model until the docs explicitly support it.

### 2.3 Claude Code - Verified Planning Assumptions

Verified host facts:
- Claude Code has a real plugin package format rooted at `.claude-plugin/plugin.json`,
- plugins may include `skills/`, `commands/`, `agents/`, `hooks/hooks.json`, `.mcp.json`, `.lsp.json`, `monitors/`, `bin/`, and `settings.json`,
- and local development is supported through `claude --plugin-dir ./my-plugin`.

Planning consequence:
- Claude Code is the first strong test of rendering the canonical CodeLatch model into a truly packaged host-native plugin format,
- so it comes after the OpenCode and Kilo runtime family is complete and stable.

### 2.4 Codex - Verified Planning Assumptions

Verified host facts:
- Codex has a real plugin package format rooted at `.codex-plugin/plugin.json`,
- plugin distribution depends on a marketplace file under `$REPO_ROOT/.agents/plugins/marketplace.json` or `~/.agents/plugins/marketplace.json`,
- installed plugin copies are cached under `~/.codex/plugins/cache/...`,
- hooks are separate from plugin packaging,
- hooks are experimental,
- hooks require explicit feature enablement in `config.toml`,
- and current hook coverage is narrower than Claude Code's hook system.

Planning consequence:
- Codex must be the last host adapter in MVP sequencing,
- and Codex plugin packaging must not depend on hooks for core framework behavior.

### 2.5 Planning Rule Locked by Validation

The validated implementation rule is:

- **one shared internal canonical model**,
- **separate host adapters**,
- **separate host-native emitters/installers**,
- **OpenCode first**,
- **Kilo second with shared internals but separate adapter boundaries**,
- **Claude third**,
- **Codex last**.

CodeLatch must not attempt to force one shared external plugin format across all supported hosts.

---

## 3. MVP Delivery Strategy

### 3.1 Delivery Order

The MVP delivery order is:

1. reconcile truth docs with live host facts,
2. create the shared monorepo scaffold and canonical contracts,
3. build the OpenCode adapter shell,
4. build the minimal shared core required for bootstrap,
5. complete OpenCode bootstrap,
6. complete OpenCode sync,
7. complete the remaining OpenCode framework commands,
8. build the Kilo adapter with OpenCode-compatible reuse where verified,
9. harden OpenCode + Kilo parity,
10. build the Claude Code adapter,
11. build the Codex adapter,
12. then finish installer, catalog, and release hardening.

### 3.2 Why This Order

This order is intentionally not symmetrical.

It prioritizes:
- proving the canonical model against the most runtime-oriented host first,
- proving the nearest host-relative reuse second,
- completing the first full usable host family before moving to packaged hosts,
- then testing the canonical model against a richer packaged host (Claude),
- and finally against the most divergent plugin/install model (Codex).

### 3.3 Testing Model

The locked testing approach is:
- strict TDD for shared contracts, behavioral pipelines, state logic, and drift logic,
- integration and smoke verification for thin wrappers and generated host surfaces,
- and per-host conformance fixtures before a phase may exit.

### 3.4 Phase Exit Philosophy

Each phase must end with one of these outcomes:
- a new stable contract,
- a runnable host capability,
- or a host-family parity checkpoint.

No later phase should begin while the prior phase still lacks its defined verification gate.

---

## 4. Execution Principles

Implementation must follow these rules throughout the MVP.

1. **Truth docs first.** If implementation reveals a doc contradiction, the docs are updated before implementation continues.
2. **Host-native over fake symmetry.** Do not force the same packaging model across hosts.
3. **Shared semantics, native realization.** Shared core owns framework behavior; adapters own host-native realization.
4. **OpenCode family first.** OpenCode proves the runtime model; Kilo proves controlled reuse without collapsing adapter boundaries.
5. **Claude before Codex.** Claude is the first packaged-host validation; Codex is last because marketplace packaging and hooks diverge more.
6. **Codex hooks are optional enhancement.** They are not part of the minimum architectural foundation.
7. **Separate Kilo adapter always.** Even when internal emitter logic is shared, Kilo remains a first-class adapter target.
8. **Canonical workflow events are internal.** Hosts do not need to expose the same native event names; adapters map canonical CodeLatch events onto native hooks or wrapper checkpoints.
9. **TDD for behavioral logic.** Shared runtime logic, state logic, drift logic, and command pipelines require test-first implementation.
10. **Every phase must be runnable or provable.** Avoid phases that only generate scaffolding without a usable verification story.

---

## 5. Target Monorepo Shape

The implementation target remains a TypeScript/Node.js monorepo.

```text
packages/
  core/
  schemas/
  workflow-contracts/
  procedural-assets/
  adapter-base/
  adapter-opencode/
  adapter-kilocode/
  adapter-claude-code/
  adapter-codex/
  installer/
  profile-coding-development/
  shared-utils/

packs/
  global/

profiles/
  coding-development/

tests/
  unit/
  integration/
    opencode/
    kilocode/
    claude-code/
    codex/
  conformance/
  fixtures/
    bootstrap/
    drift/
    packs/
    adapters/

templates/
  truth-docs/
  root-files/
  command-wrappers/         # file-based wrappers for CLIs that use .md commands (not OpenCode)
```

---

## 6. Planned Root Tooling and Verification Commands

These repository-level commands should be established early and then used throughout the implementation plan:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm test:integration`
- `pnpm test:conformance`
- `pnpm test`
- `pnpm verify`

Expected responsibility split:
- `pnpm test:unit` validates package-local logic,
- `pnpm test:integration` validates command pipelines and host-emitted surfaces,
- `pnpm test:conformance` validates adapter contracts and shared semantics,
- `pnpm test` runs all test suites,
- `pnpm verify` runs lint, typecheck, and all test suites.

These commands are planned deliverables of the early repository scaffold and become mandatory gates for later phases.

---

## 7. Phase Overview

| Phase | Title | Main Outcome |
| --- | --- | --- |
| 0 | Truth-doc reconciliation | Host assumptions are corrected before implementation begins |
| 1 | Repository scaffold + canonical contracts | Stable monorepo and shared contracts exist |
| 2 | OpenCode adapter runtime shell | CodeLatch has a real OpenCode-native adapter shell |
| 3 | Minimal shared core for bootstrap | OpenCode shell can call real core bootstrap logic |
| 4 | OpenCode bootstrap end-to-end | `codelatch-bootstrap` works in OpenCode |
| 5 | OpenCode sync end-to-end | `codelatch-sync` works in OpenCode |
| 6 | Remaining OpenCode framework commands | OpenCode becomes the first full usable CodeLatch host |
| 7 | Kilo adapter | Kilo becomes a first-class adapter using verified shared internals |
| 8 | OpenCode + Kilo parity hardening | Shared runtime semantics are proven across both hosts |
| 9 | Claude Code adapter | Canonical model renders into Claude's packaged plugin format |
| 10 | Codex adapter | Canonical model renders into Codex plugin + marketplace format |
| 11 | Installer, catalog, and release hardening | CodeLatch is installable and governable as a real product |

---

## 8. Detailed Phase Plan

### Phase 0 - Completed Truth-Doc Baseline

**Status:** completed during planning on 2026-04-20

**Goal:** Ensure implementation starts from host-accurate assumptions.

**Depends on:** none

**Primary files:**
- Modify: `product-docs/codelatch-prd.md`
- Modify: `product-docs/technical-design.md`
- Modify: `product-docs/implementation-plan.md`

**Completed updates:**
- replaced outdated Kilo packaging assumptions with docs-verified OpenCode-compatible configuration/runtime assumptions,
- retained Kilo as a separate adapter target,
- clarified that Kilo-native additions are layered only where explicitly verified,
- clarified that Codex hooks are experimental and must not be relied on for core framework behavior,
- clarified that CodeLatch workflow events are canonical internal events mapped by adapters onto host-native hooks or checkpoints,
- and aligned active PRD and technical-design wording with the host-native integration model.

**Deliverables:**
- host-accurate truth docs,
- no unresolved contradiction between live host docs and the planned implementation order.

**Verification gate:**
- readback confirms that no truth doc claims one universal external plugin format,
- readback confirms Kilo is not reduced to an OpenCode alias,
- readback confirms Codex hooks are described as optional and experimental,
- and readback confirms the implementation plan, PRD, and technical design now use compatible sequencing terminology.

**Exit criteria:**
- satisfied before Phase 1 begins.

---

### Phase 1 - Repository Scaffold + Canonical Contracts

**Goal:** Create the monorepo, shared package skeletons, schema package, workflow contract package, and baseline verification harness.

**Depends on:** Phase 0

**Primary files and directories:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `vitest.config.ts`
- Create: `packages/core/`
- Create: `packages/schemas/`
- Create: `packages/workflow-contracts/`
- Create: `packages/adapter-base/`
- Create: `packages/shared-utils/`
- Create: `tests/unit/`
- Create: `tests/conformance/`
- Create: `tests/fixtures/`

**Planned tasks:**
1. create root workspace and package manager configuration,
2. create root scripts for lint, typecheck, unit, integration, conformance, and full verification,
3. create initial package manifests and TypeScript build boundaries,
4. define the canonical adapter interface,
5. define canonical command enums and command result shapes,
6. define canonical workflow-event enums and injection-policy interfaces,
7. create the initial schema package for project-manifest, truth-doc-registry, adapter-metadata, distribution-manifest, approval record, and run-contract types,
8. create the shared test harness structure and the first fixture directories.

**Deliverables:**
- compilable workspace,
- stable shared package boundaries,
- canonical TypeScript interfaces for adapters and core packages,
- baseline schema definitions,
- baseline test harness.

**Verification gate:**
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit`

**Exit criteria:**
- the shared contracts compile cleanly,
- root verification commands exist,
- later phases can build host adapters against a stable contract surface.

---

### Phase 2 - OpenCode Adapter Runtime Shell

**Goal:** Build the first host-native adapter shell using OpenCode's runtime plugin model.

**Depends on:** Phase 1

**Primary files and directories:**
- Create: `packages/adapter-opencode/`
- Create: `packages/adapter-opencode/src/index.ts`
- Create: `packages/adapter-opencode/src/plugin/`
- Create: `packages/adapter-opencode/src/render/`
- Create: `packages/adapter-opencode/src/metadata/`
- Create: `tests/integration/opencode/adapter-shell.test.ts`
- Create: `tests/fixtures/adapters/opencode/`

**Planned tasks:**
1. implement the OpenCode adapter package skeleton,
2. create the OpenCode plugin entry module for `.opencode/plugins/`,
3. define renderers for `AGENTS.md`, `opencode.json` (plugin entry only), command config entries (for plugin `config` hook), and adapter metadata,
4. map canonical CodeLatch workflow events onto OpenCode runtime hooks and deterministic wrapper checkpoints,
5. implement the minimal invocation bridge from the OpenCode plugin surface into the shared core dispatcher,
6. define OpenCode adapter metadata generation.

**Deliverables:**
- real OpenCode adapter package,
- OpenCode plugin shell,
- first host-native renderer set,
- canonical-event-to-host mapping table for OpenCode.

**Verification gate:**
- OpenCode integration tests prove that emitted surfaces match documented locations,
- the adapter shell can invoke a skeletal core entrypoint,
- generated repo surfaces are limited to host-native OpenCode needs.

**Exit criteria:**
- CodeLatch exists as a real OpenCode-native adapter shell rather than only a conceptual contract.

---

### Phase 3 - Minimal Shared Core for Bootstrap

**Goal:** Implement only the shared core needed to make bootstrap real.

**Depends on:** Phase 2

**Primary files and directories:**
- Modify: `packages/core/`
- Modify: `packages/schemas/`
- Modify: `packages/workflow-contracts/`
- Create: `tests/unit/core/bootstrap/`
- Create: `tests/integration/opencode/bootstrap-core.test.ts`

**Planned tasks:**
1. implement the core command dispatcher,
2. implement runtime-root initialization under `.tmp/codelatch/`,
3. implement project-manifest creation,
4. implement truth-doc-registry creation,
5. implement instruction-surface policy persistence,
6. implement the bootstrap-phase injected-context envelope primitive,
7. implement initial approval-anchor primitives needed for bootstrap state creation.

**Deliverables:**
- bootstrap-capable core,
- manifest and registry writers,
- minimal runtime-state initialization,
- bootstrap-oriented shared schemas.

**Verification gate:**
- unit tests cover manifest and registry creation,
- integration tests prove the OpenCode shell can call real bootstrap core logic,
- generated state matches the schema package.

**Exit criteria:**
- the OpenCode adapter can call shared core logic that performs actual bootstrap work.

---

### Phase 4 - OpenCode `codelatch-bootstrap` End-to-End

**Goal:** Make bootstrap fully usable inside OpenCode.

**Depends on:** Phase 3

**Primary files and directories:**
- Modify: `packages/core/`
- Modify: `packages/adapter-opencode/`
- Create: `templates/truth-docs/`
- Create: `templates/root-files/`
- Create: `tests/integration/opencode/bootstrap-e2e.test.ts`
- Create: `tests/fixtures/bootstrap/empty-repo/`
- Create: `tests/fixtures/bootstrap/adopted-repo/`

**Planned tasks:**
1. implement repo detection,
2. implement adopt / migrate / fresh bootstrap choices,
3. implement enabled-adapter selection and persistence,
4. create `.tmp/codelatch/` runtime root,
5. create or adopt truth docs through the truth-doc registry,
6. render the OpenCode-native instruction anchor (`AGENTS.md`),
7. render `.opencode/codelatch/adapter.json`,
8. register CodeLatch commands via the OpenCode plugin `config` hook (no `.md` wrapper files needed),
9. ensure the bootstrap summary reflects real emitted surfaces and policies.

**Deliverables:**
- real bootstrap pipeline,
- runnable OpenCode bootstrap flow,
- project-local runtime root,
- truth-doc registry and project manifest initialization.

**Verification gate:**
- empty repository fixture bootstraps successfully,
- adopted repository fixture bootstraps successfully,
- emitted instruction surfaces match the enabled adapter policy,
- no extra non-native instruction anchors are emitted by default.

**Exit criteria:**
- `codelatch-bootstrap` is runnable and useful in OpenCode.

---

### Phase 5 - OpenCode `codelatch-sync` End-to-End

**Goal:** Make sync real inside OpenCode and prove drift classification.

**Depends on:** Phase 4

**Primary files and directories:**
- Modify: `packages/core/`
- Modify: `packages/workflow-contracts/`
- Create: `tests/fixtures/drift/class-0/`
- Create: `tests/fixtures/drift/class-1/`
- Create: `tests/fixtures/drift/class-2/`
- Create: `tests/integration/opencode/sync-e2e.test.ts`

**Planned tasks:**
1. implement bounded drift inputs,
2. implement Class 0 / 1 / 2 drift classification,
3. implement instruction-surface validation against the project manifest policy,
4. implement approval-anchor staleness checks,
5. implement sync metadata recording,
6. implement readable sync report materialization only when actionable,
7. implement approval-aware proposed writes,
8. implement re-brainstorm stop behavior for Class 1 and Class 2 drift.

**Deliverables:**
- real sync pipeline,
- drift engine,
- approval-aware sync behavior,
- sync report logic.

**Verification gate:**
- class-0 fixtures produce low-risk drift only,
- class-1 fixtures force hard stop and doc update path,
- class-2 fixtures force re-brainstorm path,
- stale approval anchors are detected reliably,
- sync reports are materialized only when required.

**Exit criteria:**
- `codelatch-sync` works correctly and safely in OpenCode.

---

### Phase 6 - Remaining OpenCode Framework Commands

**Goal:** Finish the full CodeLatch framework on the first host.

**Depends on:** Phase 5

**Primary files and directories:**
- Modify: `packages/core/`
- Create: `packages/procedural-assets/`
- Create: `tests/integration/opencode/audit-e2e.test.ts`
- Create: `tests/integration/opencode/pack-create-e2e.test.ts`
- Create: `tests/integration/opencode/learn-e2e.test.ts`
- Create: `tests/integration/opencode/clean-e2e.test.ts`
- Create: `tests/integration/opencode/promote-e2e.test.ts`
- Create: `tests/fixtures/packs/`
- Create: `tests/fixtures/incidents/`

**Planned tasks:**
1. implement `codelatch-audit`,
2. implement `codelatch-pack-create`,
3. implement `codelatch-learn`,
4. implement `codelatch-clean`,
5. implement `codelatch-promote`,
6. complete pack selection and conflict logic,
7. complete incident lifecycle and worthy-threshold logic,
8. complete proposal metadata and optional review-material logic,
9. complete cleanup-report behavior,
10. complete promotion-gate behavior.

**Deliverables:**
- complete OpenCode command set,
- complete pack-resolution layer,
- incident and proposal flows,
- promotion and cleanup flows.

**Verification gate:**
- all OpenCode command integration tests pass,
- pack-conflict fixtures classify correctly,
- incident fixtures produce correct learning candidate behavior,
- cleanup retention behavior matches the truth docs.

**Exit criteria:**
- OpenCode becomes the first full usable CodeLatch host.

---

### Phase 7 - Kilo Adapter

**Goal:** Build Kilo as a separate adapter using OpenCode-compatible reuse where the docs support it.

**Depends on:** Phase 6

**Primary files and directories:**
- Create: `packages/adapter-kilocode/`
- Create: `packages/adapter-kilocode/src/index.ts`
- Create: `packages/adapter-kilocode/src/render/`
- Create: `tests/integration/kilocode/adapter-e2e.test.ts`
- Create: `tests/fixtures/adapters/kilocode/`

**Planned tasks:**
1. implement the Kilo adapter package boundary,
2. reuse verified OpenCode-compatible config/runtime emitters where appropriate,
3. keep Kilo-specific adapter metadata separate,
4. support the verified instruction surface (`AGENTS.md`) and OpenCode-compatible project config/runtime path first,
5. add Kilo-specific repo/config surfaces only where those surfaces are explicitly validated by docs or conformance testing,
6. ensure Kilo invokes the shared core without becoming an alias of the OpenCode adapter.

**Deliverables:**
- first-class Kilo adapter,
- controlled OpenCode-compatible internal reuse,
- Kilo-specific adapter metadata and rendering logic.

**Verification gate:**
- Kilo can load emitted instruction/config surfaces,
- Kilo can run CodeLatch command flows through the shared core,
- the adapter passes Kilo-specific integration tests without introducing a fake packaged-plugin assumption.

**Exit criteria:**
- Kilo works as a first-class adapter target with real host-aware behavior.

---

### Phase 8 - OpenCode + Kilo Parity Hardening

**Goal:** Prove that the shared core behaves consistently across the OpenCode/Kilo host family.

**Depends on:** Phase 7

**Primary files and directories:**
- Modify: `tests/conformance/`
- Modify: `tests/integration/opencode/`
- Modify: `tests/integration/kilocode/`
- Create: `tests/conformance/openfamily-parity.test.ts`

**Planned tasks:**
1. add adapter-conformance tests for both adapters,
2. add parity tests for bootstrap, sync, audit, pack-create, learn, clean, and promote semantics,
3. validate instruction precedence and runtime-state parity,
4. validate that `.tmp/codelatch/` remains the shared runtime root without host-specific divergence,
5. validate MVI bundle and injected-envelope reproducibility across both hosts.

**Deliverables:**
- parity test suite,
- shared runtime conformance proof,
- hardened adapter mappings.

**Verification gate:**
- equivalent fixtures produce equivalent semantic outcomes across OpenCode and Kilo,
- no adapter writes host-specific state that conflicts with shared runtime rules,
- parity suite passes before Claude work begins.

**Exit criteria:**
- the canonical CodeLatch model is proven across the OpenCode/Kilo family.

---

### Phase 9 - Claude Code Adapter

**Goal:** Render the canonical CodeLatch model into Claude Code's packaged plugin format.

**Depends on:** Phase 8

**Primary files and directories:**
- Create: `packages/adapter-claude-code/`
- Create: `packages/adapter-claude-code/src/index.ts`
- Create: `packages/adapter-claude-code/src/render/plugin-manifest.ts`
- Create: `packages/adapter-claude-code/src/render/hooks.ts`
- Create: `packages/adapter-claude-code/src/render/claude-md.ts`
- Create: `tests/integration/claude-code/adapter-e2e.test.ts`
- Create: `tests/fixtures/adapters/claude-code/`

**Planned tasks:**
1. implement the Claude adapter package,
2. render `.claude-plugin/plugin.json`,
3. render Claude-native instruction surfaces (`CLAUDE.md` and host-local mirror behavior where policy requires it),
4. render Claude component layout for commands, skills, agents, hooks, and related plugin assets,
5. map canonical workflow events onto Claude hooks and runtime checkpoints,
6. define Claude-specific precedence and adapter metadata behavior,
7. validate local development flow through `claude --plugin-dir`.

**Deliverables:**
- first packaged-plugin adapter,
- Claude-native plugin renderer,
- Claude hook/event mapping,
- Claude adapter metadata.

**Verification gate:**
- local plugin load succeeds,
- emitted plugin structure matches documented Claude plugin surfaces,
- canonical model renders into Claude format without adapter-specific behavior drift.

**Exit criteria:**
- CodeLatch works as a real Claude Code plugin adapter.

---

### Phase 10 - Codex Adapter

**Goal:** Render the canonical CodeLatch model into Codex's plugin + marketplace model.

**Depends on:** Phase 9

**Primary files and directories:**
- Create: `packages/adapter-codex/`
- Create: `packages/adapter-codex/src/index.ts`
- Create: `packages/adapter-codex/src/render/plugin-manifest.ts`
- Create: `packages/adapter-codex/src/render/marketplace.ts`
- Create: `packages/adapter-codex/src/render/agents-md.ts`
- Create: `tests/integration/codex/adapter-e2e.test.ts`
- Create: `tests/fixtures/adapters/codex/`

**Planned tasks:**
1. implement the Codex adapter package,
2. render `.codex-plugin/plugin.json`,
3. render Codex plugin assets such as `skills/`, `.app.json`, `.mcp.json`, and `assets/`,
4. generate local repo marketplace metadata and personal marketplace metadata,
5. validate Codex cache/install expectations,
6. support Codex hooks only as an additive, optional integration path,
7. keep core framework behavior independent from experimental hook availability.

**Deliverables:**
- Codex adapter package,
- Codex plugin renderer,
- marketplace generator,
- optional experimental hook integration layer.

**Verification gate:**
- plugin appears via local marketplace flow,
- emitted plugin structure matches documented Codex surfaces,
- installed plugin copy resolves through Codex cache correctly,
- Codex hook integration, if implemented, passes only as an additive feature and not as a core dependency.

**Exit criteria:**
- CodeLatch works as a real Codex plugin adapter.

---

### Phase 11 - Installer, Catalog, and Release Hardening

**Goal:** Finish product distribution, version governance, and release-readiness across all supported hosts.

**Depends on:** Phase 10

**Primary files and directories:**
- Create: `packages/installer/`
- Create: `packages/profile-coding-development/`
- Create: `tests/integration/installer/`
- Create: `tests/fixtures/catalog/`

**Planned tasks:**
1. implement the installer package,
2. implement profile selection and stack/add-on resolution,
3. implement version-governor creation and validation,
4. implement signed-catalog verification,
5. implement per-host distribution planning,
6. implement per-host installation validation,
7. implement explicit upgrade compatibility checks,
8. finalize release verification across OpenCode, Kilo, Claude, and Codex.

**Deliverables:**
- installer package,
- profile package,
- version governor,
- signed-catalog support,
- release verification matrix.

**Verification gate:**
- install / uninstall / upgrade tests pass,
- signed-catalog validation passes,
- incompatible upgrade attempts stop with a compatibility report,
- release matrix passes for all Tier-1 adapters.

**Exit criteria:**
- CodeLatch MVP is installable, upgradeable, and releasable as a real product.

---

## 9. Cross-Phase Verification Matrix

The following verification matrix is mandatory across the plan.

### 9.1 Shared Contract Verification

Must be proven before host-family expansion:
- schema validation,
- workflow-contract validation,
- adapter-interface conformance,
- project-manifest and truth-doc-registry stability.

### 9.2 Command-Pipeline Verification

Must be proven as each command becomes real:
- bootstrap pipeline fixtures,
- sync pipeline fixtures,
- audit and pack conflict fixtures,
- learn candidate-scoring fixtures,
- clean retention fixtures,
- promote approval-gate fixtures.

### 9.3 Host Adapter Verification

Must be proven for every adapter:
- host-native instruction surface emission,
- host-native config/plugin surface emission,
- invocation bridge correctness,
- adapter metadata correctness,
- parity with shared command semantics.

### 9.4 Runtime-State Verification

Must be proven before Claude and Codex work begins:
- `.tmp/codelatch/` remains the shared runtime root,
- no host adapter creates a competing runtime memory store,
- approval anchors stay reproducible,
- injected bundles preserve provenance and MVI constraints.

### 9.5 Final Verification Before Release

Must be proven in the final release phase:
- all Tier-1 adapters pass conformance,
- install and upgrade flows are deterministic,
- signed catalog verification works,
- marketplace or packaged-host emitters pass fixture validation,
- and no adapter depends on an undocumented host surface.

---

## 10. Risks and Mitigations

### Risk 1 - Kilo documentation leaves room for interpretation

**Risk:** Kilo exposes OpenCode-compatible config/runtime behavior, but Kilo-specific packaging surfaces are not documented as fully as Claude or Codex plugin packaging.

**Mitigation:**
- build Kilo as a separate adapter,
- implement OpenCode-compatible surfaces first,
- and gate any Kilo-native additions behind explicit doc verification or conformance proof.

### Risk 2 - Over-generic canonical event model

**Risk:** The internal CodeLatch workflow-event model could drift too far from what hosts can actually support.

**Mitigation:**
- force every adapter to maintain an explicit mapping table,
- test canonical event realization through real host checkpoints,
- and avoid pretending hosts share identical native lifecycle events.

### Risk 3 - Codex hook immaturity creates false assumptions

**Risk:** Codex hooks are experimental, feature-flagged, and narrower than Claude hooks.

**Mitigation:**
- treat hooks as additive,
- keep Codex packaging and marketplace behavior independent of hook support,
- and verify hook behavior only after the packaged adapter works without them.

### Risk 4 - Cross-host runtime divergence

**Risk:** One adapter may begin storing behaviorally important state outside the shared `.tmp/codelatch/` runtime model.

**Mitigation:**
- use schema-validated shared runtime records,
- add parity tests across OpenCode and Kilo before moving to packaged hosts,
- and keep adapter-native directories limited to discovery, wrappers, metadata, and host-facing assets.

### Risk 5 - Truth docs and implementation drift apart during build-out

**Risk:** Later host-specific implementation may expose assumptions that the truth docs no longer match.

**Mitigation:**
- treat Phase 0 as mandatory,
- stop and update truth docs whenever a host assumption materially changes,
- and keep this implementation plan versioned and updated alongside the PRD and technical design.

---

## 11. MVP Exit Criteria

The MVP implementation plan is complete only when all of the following are true:

1. the shared monorepo scaffold and canonical contracts are stable,
2. OpenCode supports the full CodeLatch command set end-to-end,
3. Kilo supports the full CodeLatch command set through a separate adapter with verified OpenCode-compatible reuse,
4. Claude Code supports CodeLatch through its packaged plugin model,
5. Codex supports CodeLatch through its packaged plugin plus marketplace model,
6. no supported adapter depends on forcing one shared external plugin format,
7. no supported adapter treats Codex hooks as a hard architectural dependency,
8. the shared runtime root under `.tmp/codelatch/` remains authoritative across all hosts,
9. instruction-anchor policy and adapter metadata are validated per host,
10. cross-host conformance and parity tests pass,
11. installer, version governor, and signed catalog flows pass release verification,
12. and the final repository remains aligned with the PRD and technical design.

---

## 12. Post-MVP Follow-Ups

After MVP, likely follow-up work includes:
- richer packaged-host UX,
- stronger Codex hook usage once the feature matures,
- stronger Kilo-native feature exploitation if the docs evolve,
- benchmark and replay infrastructure,
- richer global promotion workflows,
- and broader adapter expansion beyond the Tier-1 host set.

---

## 13. Implementation Plan Summary

This plan locks the CodeLatch MVP execution order as:

- reconcile the truth docs first,
- build the shared monorepo and canonical contracts,
- prove the framework on OpenCode,
- extend it to Kilo through controlled reuse with a separate adapter,
- harden the shared runtime and command semantics across that host family,
- then add Claude Code,
- then add Codex,
- and finish with installer, catalog, and release hardening.

The core implementation rule is stable:

- **one shared internal canonical model**,
- **per-host native adapters and emitters**,
- **shared semantics, host-native realization**,
- and **no forced universal external plugin format**.

This sequencing gives CodeLatch the highest chance of delivering a real, maintainable, cross-CLI framework without prematurely overfitting to the wrong host abstraction.
