# CodeLatch Technical Design

- **Document Version:** 0.2.16
- **Document Status:** Draft
- **Product Name:** CodeLatch
- **Document Owner:** guyinwonder168
- **Last Updated:** 2026-04-22
- **Source of Truth Location:** `product-docs/technical-design.md`
- **Derived From:** `product-docs/codelatch-prd.md`

---

## Changelog

### v0.2.16 - 2026-04-22
- Section 8.3.3: Added OpenCode Plugin SDK interface detail — `Plugin = async (ctx) => { config, tool, event, ... }`; documented Bun as OpenCode runtime (native TypeScript transpile, no build step for local dev); documented plugin resolution path (`exports` → `main` → index files); auto-runs `bun install` for local plugin dependencies.
- Section 8.4: Enhanced all four adapter layouts with distribution-format annotations (bundled module vs declarative directory); added Claude Code hook types (command/http/prompt/agent), env vars (`${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_DATA}`), userConfig, plugin cache path; added Codex `interface` field detail, marketplace mechanics, plugin cache path; added OpenCode Plugin SDK interface specification, Bun runtime note, and build/bundling requirement for production.
- Section 8.4.1 (new): Added Adapter Distribution Format section documenting the bundled-module vs declarative-directory architectural distinction, build requirements per adapter, and local development implications.
- Section 9.1.1: Updated plugin-registered commands example to reference the actual OpenCode Plugin SDK interface shape.

### v0.2.15 - 2026-04-21
- Added Section 7.1.1: Global-First Install Path Rule for OpenCode — `~/.config/opencode/` is the default install target; `.opencode/` is project-level opt-in only.
- Section 7.1 layout: Removed `.opencode/commands/` (exists but we choose programmatic), removed `.opencode/package.json` (not a real OpenCode surface), changed `.opencode/skills/` to `skills/*/SKILL.md` folder pattern, added `.opencode/instructions.md`, added `~/.config/opencode/` global config tree.
- Section 8.4 OpenCode layout: Added `~/.config/opencode/` as global default, removed `package.json`, clarified `opencode.json` `command` key mechanism, added SKILL.md YAML frontmatter note, added cross-discovery note, added `config.instructions` URLs, added plugin hook enumeration.
- Section 8.3.3: Added OpenCode global config directory note.
- Section 9.1.1: Fixed "eliminates" wording — CodeLatch chooses programmatic registration; `.opencode/commands/` remains valid for other plugins.
- Section 12A.2 Layer 2 OpenCode: Added global path, instructions.md, SKILL.md frontmatter, cross-discovery, command key, config.instructions URLs.

### v0.2.14 - 2026-04-20
- Cleaned up remaining wording drift after the Kilo/Codex reconciliation pass.
- Aligned scope, installer, and architecture wording with the implementation plan's host-first delivery order.
- Marked Codex hooks as optional in the current-layout and distribution-manifest examples.
- Added an explicit note that multi-host repositories may still carry OpenCode-compatible surfaces used by the Kilo adapter.

### v0.2.13 - 2026-04-20
- Reconciled the technical design with the implementation plan and current host documentation for Kilo Code and Codex.
- Clarified that Kilo Code uses documented OpenCode-compatible config/runtime surfaces first in MVP, while remaining a separate adapter with Kilo-native additions layered on top.
- Clarified that MVP does not assume a dedicated Kilo packaged-plugin manifest equivalent to Claude Code or Codex.
- Strengthened the Codex adapter wording so plugin packaging and marketplace wiring remain the baseline path while hooks stay optional and experimental.
- Added an explicit downstream linkage from the technical design to `product-docs/implementation-plan.md` for implementation sequencing.

### v0.2.12 - 2026-04-19
- Added the missing OpenCode `AGENTS.md` native instruction surface to the concrete layout and installed-context examples.
- Made bootstrap explicitly select and persist enabled-adapter / instruction-surface policy before emitting anchors, and taught sync to validate against that policy.
- Extended the project manifest with repo-level instruction-surface policy so bootstrap, sync, and audit can reason about native anchors and compatibility mirrors deterministically.

### v0.2.11 - 2026-04-18
- Switched the instruction-anchor model from universal dual-anchor creation to adapter-detected host-native emission by default.
- Clarified the native instruction mapping for Claude Code, Codex, OpenCode, and Kilo Code, with compatibility mirrors remaining opt-in.
- Updated bootstrap, adapter responsibilities, and verification wording to prove native-anchor detection rather than unnecessary mirror creation.

### v0.2.10 - 2026-04-18
- Finished the thin-instruction-anchor model by clarifying how Kilo Code uses root `AGENTS.md` / `CLAUDE.md`, optional `CONTEXT.md`, and `kilo.jsonc` without creating competing authority layers.
- Extended the MVP verification strategy to test instruction precedence, workflow-binding fallback behavior, and MVI/injection-policy enforcement explicitly.

### v0.2.9 - 2026-04-17
- Operationalized injected model context as a concrete envelope with deterministic event bindings, instruction precedence, and overflow/escalation rules.
- Extended the adapter contract and adapter metadata with explicit workflow binding and injection policy surfaces.
- Added repository ownership rules for committed wiring, generated metadata, runtime state, and user-local install artifacts.

### v0.2.8 - 2026-04-17
- Added the `12A Context Authority and Injection Contract`, including the MVI rule and the install-many / select-few / inject-minimal model.
- Aligned the OpenCode and Kilo Code adapter design with current official instruction, skill, agent, config, and plugin documentation.
- Removed unsupported old OpenCode and Kilo folder assumptions from the MVP adapter model and replaced them with documented host-specific surfaces.

### v0.2.7 - 2026-04-17
- Aligned the Claude Code and Codex adapter design with current official plugin, instruction-surface, and hook documentation.
- Replaced unsupported generic Claude and Codex folder assumptions with documented host-specific discovery surfaces.
- Clarified that Codex plugin packaging and Codex hooks are separate mechanisms, while Claude Code supports richer plugin-bundled hooks.

### v0.2.6 - 2026-04-14
- Defined steady-state maintenance rules for `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, and `AGENTS.md`, including a thin `AGENTS.md` contract.
- Locked silent read-only scouting behavior, brainstorm interaction rules, and the install-selection exclusion rule.
- Added explicit `codelatch-pack-create` modes and clarified that sync/audit may inspect maintained root docs when they become stale.

### v0.2.5 - 2026-04-14
- Fixed the runtime layout example so `cleanup/` is represented and `review-index.json` is explicitly conditional.
- Added approval anchoring, approved-plan, pending-review, workspace, sync-report, cleanup-report, context-bundle, adapter-metadata, and distribution-manifest schemas.
- Defined the runtime concurrency model, drift detection mechanics, reproducibility anchor set, procedural-asset trust policy, and verification strategy.

### v0.2.4 - 2026-04-03
- Clarified where selected global packs are materialized as reproducibility snapshots inside project runtime state.
- Defined the exact readable incident artifact path and retention contract.
- Defined cleanup report storage and clarified that cleanup reports are removed only through later explicit cleanup approval.

### v0.2.3 - 2026-04-03
- Clarified the difference between canonical truth-doc roles, default filenames for newly bootstrapped repositories, and registry-based path mapping for adopted repositories.
- Defined retention lifecycle terms and separated lifecycle auto-deletion from explicit user-invoked cleanup.

### v0.2.2 - 2026-04-03
- Locked lifecycle for actionable sync and audit Markdown: auto-delete by default once resolved unless the user explicitly keeps it.

### v0.2.1 - 2026-04-03
- Reworked persistent state into a hybrid model with plugin-managed runtime indexes plus selective Markdown artifacts for durable human review.
- Locked artifact-retention rules so proposals, plans, sync, audit, and run outputs do not create routine file spam.
- Clarified that the plugin owns routine bookkeeping while the model is reserved for semantic decisions, approvals, and review-worthy summaries.

### v0.2.0 - 2026-04-03
- Replaced the prior `.codelatch/` canonical state model with project-local runtime memory under `.tmp/codelatch/`.
- Split global installer/plugin distribution from `codelatch-bootstrap` repository scaffolding.
- Added procedural asset distribution for reviewed skills, agents, and instruction assets with CodeLatch-reviewed defaults.
- Added canonical workflow-role contracts, approval history, and run-contract schemas.
- Locked the plan-driven strict TDD execution model for code and behavior changes.
- Clarified that installer/plugin distribution is global per user by default for each supported CLI, with optional project-local installation when explicitly needed.

### v0.1.0 - 2026-04-03
- Initial technical design draft created from the MVP PRD.
- Finalized the MVP architecture, monorepo package model, adapter model, command pipelines, pack resolution logic, persistent state model, and upgrade strategy.
- Resolved the PRD technical-design open items for adapter structure, folder layouts, schemas, sync/install pipelines, pack conflict handling, and merge guardrails.

---

## 1. Purpose

This document translates the PRD into an MVP-ready technical architecture for CodeLatch.

It defines:
- the host-native integration distribution architecture,
- the runtime and packaging architecture,
- the project filesystem layout,
- the adapter model for supported CLIs,
- the command execution pipelines,
- the truth-doc synchronization model,
- the context pack resolution model,
- the persistent storage schemas,
- the learning and promotion flow,
- and the safety mechanisms for drift and parallel work.

This document is the technical source of truth for how CodeLatch should be built in MVP.

Implementation sequencing, delivery order, and phase gates are defined downstream in `product-docs/implementation-plan.md`.

---

## 2. Scope and Design Boundaries

### 2.1 In Scope for MVP

This design covers:
- Tier-1 support for OpenCode, Claude Code, Codex, and Kilo Code,
- global installer-managed host integration distribution into supported CLIs,
- a shared framework core with thin CLI adapters,
- reviewed procedural asset distribution across documented host-tool instruction, skill, agent, hook, and plugin surfaces,
- branded command semantics,
- bootstrap, sync, audit, pack creation, learning, cleanup, and promotion flows,
- the 3 truth-doc model,
- project-local runtime memory under `.tmp/codelatch/`,
- project-local learning and incident storage,
- approval history and run contracts,
- strict TDD inside approved behavioral execution,
- selective pack loading,
- and isolated subtask execution with guarded merge-back.

### 2.2 Out of Scope for MVP

This design does not include:
- a hosted backend service,
- a web UI or dashboard,
- automatic global promotion without approval,
- path-aware routing as a hard requirement,
- distributed multi-machine execution,
- or a benchmark/replay service.

### 2.3 Key Assumptions

- CodeLatch is implemented as a TypeScript/Node.js monorepo.
- Markdown remains the human-readable source format for truth docs and pack content.
- Plugin-managed indexed state remains the machine-readable runtime layer, while JSON Schema defines logical record shapes and interchange formats.
- Adapters own CLI-native discovery and wrapper generation, but framework logic stays in shared core packages.
- Newly bootstrapped repositories should use canonical truth-doc filenames: `product-docs/prd.md`, `product-docs/technical-design.md`, and `product-docs/implementation-plan.md`.
- Adopted repositories may map the same logical truth-doc roles to non-canonical filenames during migration. For example, this repository currently uses `product-docs/codelatch-prd.md` for the logical `prd` role.

---

## 3. Design Drivers

The MVP architecture is driven by the following requirements from the PRD:

1. **Truth-doc-led execution**: code and plans must follow PRD, technical design, and implementation plan.
2. **Sparse approvals**: the framework must stop only at high-value checkpoints.
3. **Small active context**: packs must be selected lazily and semantically.
4. **Cross-CLI consistency**: command semantics and behavior must remain stable across adapters.
5. **Project-first learning**: repeated incidents must persist across sessions without silently changing behavior.
6. **Safe parallelism**: independent work may run in isolation, but merge-back must be guarded.
7. **Installer/bootstrap split**: global host integration distribution and per-project scaffolding must remain separate responsibilities.
8. **Controllable procedural assets**: distributed skills, agents, instruction assets, and host-integration assets must remain reviewable and version-governed.
9. **Plan-driven strict TDD**: code and behavior changes must follow explicit red/green/refactor contracts inside approved scope.

---

## 4. Technical Decisions Summary

### 4.1 Primary Stack Choices

CodeLatch MVP uses:
- **TypeScript** for shared implementation logic,
- **Node.js 20+** as the minimum runtime,
- **pnpm workspaces** for the monorepo,
- **Markdown** for human-owned truth docs and pack content,
- **SQLite-backed indexes + JSON Schema** for machine state and validation,
- **Zod** for runtime schema validation inside the core,
- and **isolated temporary workspaces/worktrees** for parallel write safety.

### 4.2 Why This Stack

These choices keep the system:
- easy to publish as many packages,
- strong at filesystem-heavy CLI work,
- portable across Linux/macOS development environments,
- compatible with JSON/Markdown-first project state,
- and simple to validate and audit.

### 4.3 Architecture Strategy

The MVP architecture is:
- **shared-core behavior with host-first validation sequencing**,
- **adapter-thin at the behavior layer, host-native at the realization layer**,
- **project-local runtime state under `.tmp/codelatch/`**,
- **docs-as-truth**,
- and **references-before-snippets** for context loading.

---

## 5. System Architecture Overview

CodeLatch is a layered local framework.

```text
┌──────────────────────────────────────────────┐
│ CLI-native command surface                   │
│ (OpenCode / Claude Code / Codex / Kilo Code) │
└──────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│ Adapter layer                                │
│ - wrapper generation                         │
│ - CLI discovery integration                  │
│ - native procedural asset mapping            │
│ - invocation normalization                   │
└──────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│ Framework core                               │
│ - command handlers                           │
│ - truth-doc sync engine                      │
│ - pack resolver                              │
│ - drift classifier                           │
│ - learning engine                            │
│ - merge guardrails                           │
└──────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│ Project data plane                           │
│ - truth docs                                 │
│ - packs                                      │
│ - db-backed operational state                │
│ - active plans and incidents                 │
│ - selective review artifacts                 │
│ - runs and workspaces                        │
│ - caches                                     │
└──────────────────────────────────────────────┘
```

### 5.1 Core Architectural Rule

All product behavior lives in the framework core.

Adapters may customize:
- command discovery,
- wrapper file format,
- CLI-native folder wiring,
- and invocation transport.

Adapters must not fork:
- drift rules,
- truth hierarchy,
- learning thresholds,
- pack precedence,
- or merge guardrails.

### 5.2 Runtime State Rule

To avoid state fragmentation across CLIs while keeping project memory explicitly cleanable, MVP uses this split:

- truth docs remain under `product-docs/`,
- `.tmp/codelatch/` is the project-local runtime and machine-memory root,
- CLI-native roots like `.opencode/`, `.claude/`, `.codex/`, and `.kilo/` contain discovery files, installed procedural assets, and adapter metadata only.

This keeps multi-CLI projects consistent without turning CLI-native discovery roots into competing memory stores.

---

## 6. Monorepo and Package Architecture

### 6.1 Monorepo Layout

```text
packages/
  core/
  schemas/
  workflow-contracts/
  procedural-assets/
  adapter-base/
  adapter-opencode/
  adapter-claude-code/
  adapter-codex/
  adapter-kilocode/
  installer/
  profile-coding-development/
  shared-utils/

packs/
  global/

profiles/
  coding-development/

templates/
  truth-docs/
  root-files/
  command-wrappers/
```

### 6.2 Package Responsibilities

#### `@codelatch/core`
Owns:
- command handlers,
- project bootstrap logic,
- truth-doc registry handling,
- drift detection and classification,
- pack resolution,
- learning candidate scoring,
- proposal generation,
- and merge guardrails.

#### `@codelatch/schemas`
Owns:
- JSON schemas,
- Zod validators,
- schema versioning,
- and migration helpers for persistent state.

#### `@codelatch/workflow-contracts`
Owns:
- canonical workflow phases,
- approval contract shapes,
- canonical core role definitions,
- TDD task contract shapes,
- and stop-condition semantics.

#### `@codelatch/procedural-assets`
Owns:
- official reviewed baseline skills,
- official reviewed agent definitions,
- official reviewed instruction assets,
- reviewed host-integration templates such as plugin, hook, or config fragments,
- provenance metadata for wrapped or derived upstream assets,
- and canonical source templates before adapter rendering.

#### `@codelatch/adapter-base`
Defines the shared adapter contract:
- install wrapper files,
- resolve documented host discovery surfaces,
- normalize invocation context,
- surface user-visible summaries,
- and map core command results into host-CLI expectations.

#### Adapter Packages

- `@codelatch/adapter-opencode`
- `@codelatch/adapter-claude-code`
- `@codelatch/adapter-codex`
- `@codelatch/adapter-kilocode`

Each adapter package owns:
- wrapper templates,
- CLI-native discovery file generation,
- adapter metadata,
- and small compatibility shims.

#### `@codelatch/installer`
Owns:
- global CLI host-native integration distribution,
- package/profile selection,
- procedural asset selection,
- version-governed install plans,
- upgrade checks,
- and adapter-native installation into supported CLIs.

#### `@codelatch/profile-coding-development`
Owns the default coding-development profile bundle definition:
- required packs,
- optional add-ons,
- and install-time prompts.

### 6.3 Why Many Packages

The monorepo is split this way so that:
- shared logic stays stable,
- adapters can move independently when host CLIs change,
- packs and profiles can publish separately,
- and version governance can pin compatible sets.

---

## 7. Project Filesystem Layout

### 7.1 Current Repository Layout

The layout below shows this repository's adopted-repository mapping. Newly bootstrapped repositories should use the canonical default truth-doc filenames from Section 2.3.

```text
README.md
CHANGELOG.md
CONTRIBUTING.md
AGENTS.md
CLAUDE.md

product-docs/
  codelatch-prd.md
  technical-design.md
  implementation-plan.md

.tmp/
  codelatch/
    index.db
    project-manifest.json
    version-governor.json
    truth-doc-registry.json
    review-index.json   # only when pending review exists
    plans/
    runs/
    sync/
    audits/
    cleanup/
    packs/
      project/
      cache/
    incidents/
    proposals/
      review/
    cache/
      refs/
      snippets/
    workspaces/

.opencode/                          # project-level only (opt-in); default is ~/.config/opencode/
  skills/*/SKILL.md               # skill folders, each containing SKILL.md with YAML frontmatter
  agents/
  plugins/
  instructions.md                 # project-level instruction surface discovered by OpenCode
  codelatch/
    adapter.json
    distribution-manifest.json

~/.config/opencode/                # global config — DEFAULT install target for new CodeLatch installations
  opencode.json                    # user-level plugin registration
  plugins/                         # user-level plugin modules
  agents/                          # user-level agents
  skills/*/SKILL.md                # user-level skill folders
  instructions.md                  # user-level instruction surface

.claude/
  CLAUDE.md
  commands/
  skills/
  agents/
  codelatch/
    adapter.json
    distribution-manifest.json

.agents/
  skills/

.codex/
  agents/
  hooks.json              # only when Codex experimental hooks are enabled
  config.toml
  codelatch/
    adapter.json
    distribution-manifest.json

.kilo/
  kilo.jsonc
  skills/
  agents/
  codelatch/
    adapter.json
    distribution-manifest.json
```

In multi-host repositories, documented OpenCode-compatible root or project surfaces such as `opencode.json` and `.opencode/` may also be present and reused by the Kilo adapter when that path is enabled.

### 7.1.1 Global-First Install Path Rule for OpenCode

OpenCode supports two configuration scopes:

- **Global** (`~/.config/opencode/`) — the default installation target for CodeLatch. New CodeLatch installations place plugin modules, configuration, skills, agents, and instructions here.
- **Project-local** (`.opencode/` in the project root) — used only when a team explicitly opts in to project-level customization. This is not the default and must not be treated as the primary configuration location.

CodeLatch adapters and installers must default to the global path. Project-level `.opencode/` surfaces are used only when:
- a user explicitly requests project-level customization during bootstrap or sync,
- or the project already carries project-level OpenCode configuration that CodeLatch should adopt.

The `opencode.json` `command` key is the mechanism through which the plugin `config` hook registers commands; CodeLatch uses this programmatically rather than creating `.md` files in `.opencode/commands/`.

OpenCode also discovers skill content from cross-host directories (`.claude/skills/*/SKILL.md`, `.agents/skills/*/SKILL.md`), and supports remote instruction URLs via `config.instructions`. These are additional instruction surfaces that adapters should account for.

### 7.2 Why `.tmp/codelatch/` Is the Runtime Root

Without a shared root, the same project could accumulate:
- different incident histories per CLI,
- inconsistent installed pack views,
- and conflicting audit results.

Using `.tmp/codelatch/` keeps runtime memory project-local, reviewable, and explicitly cleanable, while keeping the human source of truth in `product-docs/`.

Inside that root, the plugin should own routine bookkeeping, indexes, retention, and status updates so that high-churn operational state does not repeatedly enter model context. Human-readable Markdown should be materialized only when a user may reasonably reopen it for review. When a sync or audit report stops being actionable because the underlying issue is resolved, it should auto-delete by default unless the user explicitly keeps it.

### 7.3 Truth-Doc Registry Rule

Because adopted repositories may not use canonical filenames, CodeLatch keeps a registry that maps logical truth-doc roles to actual file paths.

For this repository, the initial registry should map:

```json
{
    "truth_docs": {
      "prd": {
        "path": "product-docs/codelatch-prd.md",
        "version": "0.2.8",
        "hash": "sha256:<computed>"
      },
      "technical_design": {
        "path": "product-docs/technical-design.md",
        "version": "0.2.12",
        "hash": "sha256:<computed>"
      },
    "implementation_plan": {
      "path": "product-docs/implementation-plan.md",
      "version": "0.1.0",
      "hash": "sha256:<computed>"
    }
  },
  "updated_at": "2026-04-19T00:00:00Z"
}
```

Commands refer to logical truth-doc roles, not hardcoded filenames.

### 7.4 Root Repository Document Maintenance Rule

`README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, and any host-native thin instruction anchors such as `AGENTS.md` or `CLAUDE.md` are maintained repository-facing documents, but they are not part of the truth-doc trio.

Rules:
- bootstrap creates or adopts the ones required by enabled adapters or explicit compatibility policy,
- sync may inspect them for staleness when truth-doc meaning, setup flow, command surface, or contributor guidance has changed,
- low-risk refreshes to these files may be proposed during sync, but still require approval before write,
- the root `CHANGELOG.md` remains repository/application level and must not replace truth-doc-local changelogs,
- each truth doc must keep its own inline document version and changelog section,
- and README badge policy must stay conservative and evidence-based rather than aspirational.

### 7.5 `AGENTS.md` Contract

`AGENTS.md` remains the thin project anchor for AGENTS-aware hosts such as Codex, OpenCode, and Kilo Code.

Required logical fields:
1. framework identity (`This repository uses CodeLatch` or equivalent),
2. truth-doc locations,
3. local project context location when one exists,
4. and a very small set of repo-specific non-negotiable reminders.

It must not become:
- a pack registry,
- a workflow engine copy,
- approval history storage,
- a machine lockfile,
- or a duplicate of the PRD, technical design, or implementation plan.

Default shape:

```md
# AGENTS.md

This repository uses CodeLatch.

## Source of Truth
- PRD: `[prd-path-from-truth-doc-registry]`
- Technical Design: `[technical-design-path-from-truth-doc-registry]`
- Implementation Plan: `[implementation-plan-path-from-truth-doc-registry]`

## Local Context
- Project context: `[path-if-used]`

## Non-Negotiable Reminders
- Keep work aligned to the truth docs.
- Keep changes scoped to approved work.
- Use CodeLatch flows for sync, planning, execution, and review.
```

Bootstrap renders those truth-doc pointers from the truth-doc registry. In newly bootstrapped repositories they typically resolve to `product-docs/prd.md`, `product-docs/technical-design.md`, and `product-docs/implementation-plan.md`; adopted repositories may render mapped paths instead. Bootstrap creates the initial file only when an `AGENTS.md`-first host is enabled or explicit compatibility policy requires it. Sync may update only stale truth-doc pointers, local-context pointers, and the minimal reminder block. If `AGENTS.md` grows beyond this thin-anchor shape, audit should flag it for reduction.

### 7.6 `CLAUDE.md` Contract

`CLAUDE.md` remains the thin project anchor for Claude Code.

Required logical fields:
1. framework identity (`This repository uses CodeLatch` or equivalent),
2. truth-doc locations,
3. local project context location when one exists,
4. and a very small set of repo-specific non-negotiable reminders.

It must not become:
- a pack registry,
- a workflow engine copy,
- approval history storage,
- a machine lockfile,
- or a duplicate of the PRD, technical design, or implementation plan.

Default shape:

```md
# CLAUDE.md

This repository uses CodeLatch.

## Source of Truth
- PRD: `[prd-path-from-truth-doc-registry]`
- Technical Design: `[technical-design-path-from-truth-doc-registry]`
- Implementation Plan: `[implementation-plan-path-from-truth-doc-registry]`

## Local Context
- Project context: `[path-if-used]`

## Non-Negotiable Reminders
- Keep work aligned to the truth docs.
- Keep changes scoped to approved work.
- Use CodeLatch flows for sync, planning, execution, and review.
```

Bootstrap renders those truth-doc pointers from the truth-doc registry. In newly bootstrapped repositories they typically resolve to `product-docs/prd.md`, `product-docs/technical-design.md`, and `product-docs/implementation-plan.md`; adopted repositories may render mapped paths instead. Bootstrap creates `CLAUDE.md` or `.claude/CLAUDE.md` when Claude Code support is enabled. Sync may update only stale truth-doc pointers, local-context pointers, and the minimal reminder block. If `AGENTS.md` also exists for other enabled hosts or explicit compatibility policy, the files must not drift on truth-doc paths or non-negotiable reminders.

### 7.7 Instruction Anchor Precedence Rule

Some supported hosts expose more than one instruction anchor. CodeLatch must define precedence explicitly rather than silently merging all instruction files as co-equal inputs.

Rules:
- truth-doc pointers and non-negotiable reminders must stay semantically aligned across mirrored anchors,
- a host-local adapter-managed anchor may add host-specific wiring hints, but it must not contradict the root repository anchor,
- and if two anchors disagree on truth-doc paths, approval rules, or stop conditions, sync must flag drift rather than choose silently.

MVP precedence expectations:
- **Claude Code**: `CLAUDE.md` is the native project instruction surface, with `.claude/CLAUDE.md` as the Claude-specific runtime-preferred form when present. If the repository also keeps `AGENTS.md` for other enabled hosts, `CLAUDE.md` may mirror or import shared instructions, but Claude Code's native entrypoint remains `CLAUDE.md`.
- **Codex**: `AGENTS.md` is the native project instruction surface unless Codex explicitly documents a more specific override surface.
- **OpenCode**: `AGENTS.md` is the native project instruction surface. `CLAUDE.md` is only a compatibility fallback and must never outrank `AGENTS.md`; if both exist, OpenCode treats `AGENTS.md` as authoritative.
- **Kilo Code**: `AGENTS.md` is the native project instruction surface. `.kilo/kilo.jsonc` is the adapter-managed runtime config when present, and root `kilo.jsonc` is the repo-visible companion or bootstrap seed. Optional compatibility or fallback surfaces such as `CLAUDE.md`, `CONTEXT.md`, `.agents/`, or `AGENT.md` may exist, but they do not replace `AGENTS.md` as the default repo-facing instruction anchor and never outrank truth docs, approved runtime-resolved bundles, or approved stop conditions.

When a host provides both a root anchor and a host-local anchor, CodeLatch treats the host-local file as runtime-preferred and the root file as the human-facing mirror unless that host's documented behavior requires the opposite.

### 7.8 Repository Ownership and Persistence Rule

CodeLatch must distinguish clearly between author-owned repo content, generated project wiring, runtime state, and user-local install artifacts.

Rules:
- **author-owned and usually committed**: truth docs, maintained root repo docs, project pack sources, and team-approved project-local instruction anchors when repository policy enables them,
- **generated project wiring, commit only when repo-local adapter mode is intentional**: thin wrappers plus `.opencode/codelatch/`, `.claude/codelatch/`, `.codex/codelatch/`, or `.kilo/codelatch/` metadata that teams want to keep for reproducible project wiring,
- **generated runtime state, never committed**: `.tmp/codelatch/**`, including cache entries, active workspaces, run state, and review artifacts,
- **user-local or global install artifacts, never committed**: home-directory plugin packages, global skill/agent installs, host config files, and global hook registrations outside the repository.

`distribution-manifest.json` records actual install reality. In `global-host-integration` mode it is local diagnostic metadata; in explicit project-local adapter mode it may be committed when the team wants the repository to carry reproducible adapter wiring.

---

## 8. Adapter Model

### 8.1 Adapter Contract

Every adapter implements the same contract:

```ts
interface CodelatchAdapter {
  id: "opencode" | "claude-code" | "codex" | "kilocode";
  installGlobal(cliHome: string): Promise<void>;
  installProjectWiring(projectRoot: string): Promise<void>;
  installProceduralAssets(target: InstallTarget): Promise<void>;
  installHostIntegration(target: InstallTarget): Promise<void>;
  invoke(command: CodelatchCommand, context: InvocationContext): Promise<InvocationResult>;
  resolveDiscoverySurfaces(projectRoot: string): Record<string, string[]>;
  resolveInstructionPrecedence(projectRoot: string): string[];
  resolveWorkflowBindings(projectRoot: string): AdapterWorkflowBinding[];
  resolveInjectionPolicy(event: WorkflowEvent, phase: WorkflowPhase): InjectionPolicy;
  metadataDirectory(projectRoot: string): string;
}
```

### 8.1.1 Workflow Event Binding Contract

Every adapter must expose a deterministic workflow event map for the shared event set:
- `bootstrap.start`
- `brainstorm.start`
- `sync.start`
- `exact-plan.generate`
- `approval.checkpoint`
- `execution.step`
- `drift.stop`
- `review.checkpoint`
- `learn.review`
- `promote.review`

Each binding records:
- the shared workflow event,
- the host surface used to realize it (`plugin-hook`, `plugin-event`, `wrapper-prelude`, `config-trigger`, or equivalent),
- the host binding reference when one exists,
- the injection policy identifier,
- and the fallback path when the host lacks a richer native hook.

### 8.1.2 Injection Policy Contract

Each adapter-specific injection policy must declare:
- required truth-doc inputs,
- optional pack or incident inputs,
- whether hot snippets are allowed,
- the escalation behavior when the MVI budget would be exceeded,
- and the reproducibility references that must be stored when the policy is used.

### 8.2 Adapter Responsibilities

Adapters are responsible for:
- placing native wrapper files, plugin manifests, or other host-native entrypoints where the host CLI expects them,
- installing reviewed skills, agents, instruction assets, hooks, and other supported procedural assets only into documented host surfaces,
- wiring host-specific configuration, MCP, marketplace, or hook files when the adapter requires them,
- detecting whether the target host is Claude Code, Codex, OpenCode, or Kilo Code,
- emitting only the host-native instruction anchor or anchors required for that host by default,
- emitting compatibility mirrors only when multi-host support, migration mode, or explicit user policy enables them,
- declaring deterministic instruction-anchor precedence for the host,
- registering workflow-event bindings and their fallback path,
- exposing the injection policy used at each workflow event,
- mapping native invocation into shared core command calls,
- mapping canonical CodeLatch roles into native CLI entities,
- writing adapter metadata,
- and returning concise native-feeling output.

Adapters are not responsible for product logic.

Adapters must not assume that every host supports the same command, agent-mode, instruction-file, plugin, config, or lifecycle-hook surface.

### 8.3 Procedural Asset Install Rule

Installer-managed host integration distribution is global per user by default for each supported CLI.

Adapters may support explicit project-local installation when requested, but that is an opt-in override, not the default distribution mode.

### 8.3.1 Install Path Resolution Rule

Exact global install locations vary by host CLI and operating system.

Therefore:
- each adapter resolves its own actual discovery roots at install time,
- installer persists the resolved locations in that adapter's `distribution-manifest.json`,
- shared core logic must not hardcode host-specific global install paths,
- and install validation must confirm that wrappers and procedural assets are discoverable after the adapter writes them.

### 8.3.2 Install Selection Exclusion Rule

Installer selection is additive and explicit.

Rules:
- the required core procedural bundle is installed,
- the selected profile, selected stack bundles, and explicitly chosen add-ons are installed,
- unselected packs or bundles must not be installed, even as dormant global defaults,
- and later additions require an explicit install or upgrade flow rather than silent background expansion.

### 8.3.3 Host Capability Variance Rule

Shared CodeLatch workflow semantics stay consistent across adapters, but host realization differs:

- **Claude Code** realizes event-driven integration primarily through plugin components and plugin hooks. Hooks support 4 types (command, http, prompt, agent) across 18+ events. User config uses `userConfig` declarations with `${user_config.KEY}` substitution. Runtime paths use `${CLAUDE_PLUGIN_ROOT}` (install dir) and `${CLAUDE_PLUGIN_DATA}` (persistent data dir). Installed plugins are cached at `~/.claude/plugins/cache/`.
- **OpenCode** realizes event-driven integration primarily through runtime plugin modules, documented config surfaces, and plugin event subscriptions. The global config directory `~/.config/opencode/` is the default install target; project-level `.opencode/` is opt-in only. The OpenCode Plugin SDK interface is `Plugin = async (ctx) => ({ config, tool, event, ... })` — an async function receiving a context object and returning hook registrations. OpenCode runs on Bun, which natively transpiles TypeScript; local `.ts` plugin files are loaded directly without a build step. Plugin resolution follows `exports` → `main` → index files (`.ts`, `.tsx`, `.js`, `.mjs`, `.cjs`). OpenCode auto-runs `bun install` for local plugins with a `package.json`. Because `@codelatch/adapter-opencode` imports workspace packages, a build/bundling step (e.g., esbuild) is required for production distribution to collapse workspace dependencies into a single consumable module.
- **Codex** realizes reusable distribution primarily through packaged plugins and marketplace wiring, while lifecycle interception uses separate experimental hooks that must remain optional. The Codex `plugin.json` manifest includes an `interface` field for marketplace presentation (displayName, brandColor, screenshots, defaultPrompt, etc.). Distribution relies on marketplace catalogs at `.agents/plugins/marketplace.json` or `~/.agents/plugins/marketplace.json`. Installed plugins are cached at `~/.codex/plugins/cache/`. The `$plugin-creator` built-in skill scaffolds new plugin structure.
- **Kilo Code** realizes MVP behavior primarily through documented OpenCode-compatible config/runtime surfaces plus Kilo-native `.kilo/` discovery roots, with config-triggered or wrapper-level checkpoints where richer plugin hooks are absent.

The shared core must not assume event parity or identical install surfaces across supported CLIs.

### 8.4 Tier-1 Adapter Layouts

The layouts below show the documented project-local or plugin-packaged surfaces each adapter may use. Not every surface exists in every install mode.

#### OpenCode

> **Distribution format:** Bundled TypeScript module (local dev via Bun native transpile; production via esbuild or equivalent bundler).

```text
AGENTS.md

opencode.json              # plugin entry only; commands registered by plugin config hook via the command key

.opencode/                 # project-level only (opt-in); default install target is ~/.config/opencode/
  skills/*/SKILL.md        # skill folders with YAML frontmatter (name, description)
  agents/
  plugins/
  instructions.md          # project-level instruction surface
  codelatch/
    adapter.json
    distribution-manifest.json

~/.config/opencode/        # DEFAULT global install target for new CodeLatch installations
  opencode.json            # user-level config; plugin key registers @codelatch/adapter-opencode
  plugins/                 # user-level plugin modules
    codelatch/              # CodeLatch plugin directory or bundled module
      package.json          # plugin manifest with exports/main pointing to entry
      index.ts              # plugin entry (local dev; Bun transpiles natively)
      index.js              # bundled entry (production; collapsed workspace deps)
      node_modules/         # auto-installed by OpenCode via bun install
  agents/                  # user-level agents
  skills/*/SKILL.md        # user-level skill folders
  instructions.md          # user-level instruction surface
```

**OpenCode Plugin SDK interface (verified from source):**

```typescript
import { type Plugin, tool } from "@opencode-ai/plugin"

export const CodeLatchPlugin: Plugin = async (ctx) => {
  return {
    config: async (opencodeConfig) => {
      // Register CodeLatch commands via opencode.json command key
    },
    tool: {
      codelatch: tool({
        description: "CodeLatch framework commands",
        args: { /* ... */ },
        async execute(args, context) { /* ... */ }
      })
    },
    event: {
      "command.execute.before": async (data) => {
        // Intercept CodeLatch command execution → delegate to shared core
      }
    }
  }
}
```

**Plugin resolution (verified from source):** OpenCode resolves plugin entry points by checking `exports` → `main` → directory index files (`index.ts`, `index.tsx`, `index.js`, `index.mjs`, `index.cjs`). For local directory plugins with a `package.json`, OpenCode auto-runs `bun install` to install dependencies.

**Build/bundling requirement:** Because `@codelatch/adapter-opencode` imports workspace packages (`@codelatch/core`, `@codelatch/schemas`, `@codelatch/workflow-contracts`, `@codelatch/adapter-base`), a build step is required for production distribution. The bundler (esbuild recommended) must collapse all workspace `workspace:*` dependencies into a single module. For local development, Bun's native TypeScript support allows running the plugin directly from source without bundling.

Commands are registered programmatically inside the plugin's `config` hook rather than as `.md` files in `.opencode/commands/`. The `opencode.json` `command` key is the mechanism used by the `config` hook to register each CodeLatch command with `{ template, description, subtask }` entries. The plugin intercepts execution via `command.execute.before`. CodeLatch **chooses** programmatic registration; `.opencode/commands/` remains a valid OpenCode surface for file-based commands used by other plugins.

OpenCode skill discovery uses the glob pattern `{skill,skills}/**/SKILL.md`, where each skill is a folder containing a `SKILL.md` file with YAML frontmatter (`name` and `description` required). Cross-host discovery also scans `.claude/skills/*/SKILL.md` and `.agents/skills/*/SKILL.md`. The `config.instructions` key supports remote instruction URLs as an additional instruction surface.

OpenCode plugin hooks available for CodeLatch integration:
- **Lifecycle**: `config()` — init-time config mutation, used for command registration
- **Interceptor**: `chat.message`, `chat.system.transform`, `chat.params`, `chat.headers` — runtime message and system-prompt transformation
- **Provider**: `auth`, `provider.models` — authentication and model configuration
- **Tool definition**: `tool` map — register custom tools
- **Event**: `command.execute.before` — command interception (used by CodeLatch for delegating to shared core)
- **Fire-and-forget events** — lightweight event subscriptions

#### Claude Code

> **Distribution format:** Declarative directory package (`.claude-plugin/plugin.json` + skills, hooks, agents, MCP). No TypeScript compilation needed for core format; hook scripts are the only executable code.

```text
CLAUDE.md

.claude/
  CLAUDE.md
  commands/
    codelatch-bootstrap.md
    codelatch-sync.md
    codelatch-pack-create.md
    codelatch-learn.md
    codelatch-clean.md
    codelatch-audit.md
    codelatch-promote.md
  skills/
  agents/
  codelatch/
    adapter.json
    distribution-manifest.json

.claude-plugin/
  plugin.json              # Manifest (only `name` field required; `userConfig` for enable-time prompts)

skills/                     # Skills as <name>/SKILL.md directories (namespaced /plugin-name:skill-name)
agents/                     # Custom agent definitions (.md files)
hooks/
  hooks.json               # Hook definitions supporting 4 types: command, http, prompt, agent
.mcp.json                  # MCP server definitions
.lsp.json                  # LSP server configurations
monitors/
  monitors.json            # Background monitors
bin/                        # Executables added to PATH
settings.json               # Default settings applied when enabled
output-styles/              # Output style definitions
```

**Claude Code plugin details (verified from official docs):**

- **Hook types**: `command` (shell scripts), `http` (POST to URL), `prompt` (LLM evaluation), `agent` (agentic verifier)
- **Hook events**: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, PostToolUseFailure, Notification, Stop, FileChanged, ConfigChange, and more (18+ events)
- **User config**: `userConfig` in `plugin.json` declares values prompted at enable time, with `${user_config.KEY}` substitution in other fields
- **Environment variables**: `${CLAUDE_PLUGIN_ROOT}` (plugin install directory), `${CLAUDE_PLUGIN_DATA}` (persistent data directory surviving updates)
- **Installation scopes**: `user` (~/.claude/settings.json), `project` (.claude/settings.json), `local` (.claude/settings.local.json), `managed`
- **Plugin cache**: Installed plugins cached at `~/.claude/plugins/cache/`. Files outside plugin dir are NOT accessible. Symlinks are preserved.
- **Skills vs commands**: `commands/` is the legacy format; `skills/` is the new format. Both work; CodeLatch should prefer `skills/`.
- **Local dev**: `claude --plugin-dir ./my-plugin`
- **Dependencies**: `dependencies` array in `plugin.json` declares required plugins

#### Codex

> **Distribution format:** Declarative directory package (`.codex-plugin/plugin.json` + skills, apps, MCP). No TypeScript compilation needed; skills are `.md` files only.

```text
AGENTS.md

.agents/
  skills/
  plugins/
    marketplace.json

.codex/
  agents/
  hooks.json              # optional experimental surface when enabled
  config.toml
  codelatch/
    adapter.json
    distribution-manifest.json

.codex-plugin/
  plugin.json              # Manifest with required fields + optional `interface` for marketplace

skills/                     # Skills as <name>/SKILL.md directories
.mcp.json                  # MCP server configuration
.app.json                  # App or connector mappings
assets/                     # Icons, logos, screenshots
```

**Codex plugin details (verified from official docs):**

- **Manifest `interface` field**: Rich metadata for marketplace presentation — `displayName`, `shortDescription`, `longDescription`, `developerName`, `category`, `capabilities`, `websiteURL`, `privacyPolicyURL`, `termsOfServiceURL`, `defaultPrompt` (array), `brandColor`, `composerIcon`, `logo`, `screenshots`
- **Marketplace catalogs**: JSON files at `$REPO_ROOT/.agents/plugins/marketplace.json` or `~/.agents/plugins/marketplace.json`; also reads Claude-style `$REPO_ROOT/.claude-plugin/marketplace.json`
- **Plugin cache**: `~/.codex/plugins/cache/$MARKETPLACE_NAME/$PLUGIN_NAME/$VERSION/`
- **Scaffolding**: Built-in `$plugin-creator` skill generates plugin structure
- **CLI commands**: `codex plugin marketplace add/remove/upgrade`
- **Config**: Stored in `~/.codex/config.toml`
- **No hooks, no agents, no LSP**: Codex plugins are purely skills + apps + MCP; lifecycle hooks are separate and experimental

#### Kilo Code

> **Distribution format:** Bundled TypeScript module (same as OpenCode; shared bundling pipeline).

```text
AGENTS.md
opencode.json            # documented OpenCode-compatible config surface when used
kilo.jsonc

.opencode/               # documented OpenCode-compatible project surface when used
  ...

.kilo/
  kilo.jsonc
  skills/
  agents/
  codelatch/
    adapter.json
    distribution-manifest.json
```

Optional compatibility or fallback surfaces such as `CLAUDE.md`, `CONTEXT.md`, `.agents/`, or `AGENT.md` may be added only when multi-host support, migration compatibility, or explicit user policy requires them.

### 8.4.1 Adapter Distribution Format

Adapters fall into two distribution-format categories:

**Bundled module adapters** (OpenCode, Kilo Code):
- Distributed as a single bundled JavaScript/TypeScript module
- Must export the host's Plugin interface (e.g., OpenCode's `Plugin = async (ctx) => { ... }`)
- Require a build/bundling step (e.g., esbuild) to collapse workspace `workspace:*` dependencies into a single consumable artifact
- Local development can run unbundled via Bun's native TypeScript support (OpenCode) or equivalent runtime
- Installed into host plugin directory with `package.json` for dependency resolution
- Host auto-installs dependencies for local plugins (OpenCode runs `bun install`)

**Declarative directory adapters** (Claude Code, Codex):
- Distributed as a directory with a manifest file (`.claude-plugin/plugin.json` or `.codex-plugin/plugin.json`)
- Skills are `.md` files; no TypeScript compilation needed for core plugin format
- Only hook scripts (Claude Code) or MCP server definitions need executable code
- Installed from marketplace catalogs or git repositories
- Host caches installed plugins (`~/.claude/plugins/cache/` or `~/.codex/plugins/cache/`)

This distinction means `@codelatch/adapter-opencode` and `@codelatch/adapter-kilo` need a build pipeline to produce bundled output, while `@codelatch/adapter-claude` and `@codelatch/adapter-codex` primarily render declarative file structures.

### 8.5 Kilo Code Design Choice

Kilo Code shares some markdown-driven instruction and agent concepts with other hosts, but still gets its own adapter package and native project surfaces so that:
- MVP can reuse documented OpenCode-compatible config/runtime behavior where the docs truly overlap,
- discovery follows documented Kilo roots such as `kilo.jsonc`, `.kilo/skills/`, and `.kilo/agents/`,
- `AGENTS.md` stays the native repo-facing instruction anchor while optional compatibility or fallback surfaces such as `CLAUDE.md`, `CONTEXT.md`, `.agents/`, and `AGENT.md` remain explicit and supplemental,
- repo-facing instruction anchors stay thin, with optional compatibility files treated as supplemental context rather than higher-authority overrides,
- Kilo does not need to pretend it has a dedicated packaged-plugin manifest equivalent to Claude Code or Codex unless future docs explicitly add one,
- future divergence is isolated,
- and project state does not depend on OpenCode or Claude-specific naming conventions.

### 8.6 Canonical Role Model

CodeLatch defines canonical core roles for the product flow, including:
- brainstorm support,
- truth-doc sync,
- exact planning,
- scoped execution,
- test execution,
- review,
- and merge safety review.

Adapters may add CLI-native extra roles, but must preserve the behavior of these core roles.

### 8.7 Procedural Asset Governance

Upstream skills, agents, or other host-native role assets may be:
- vendored as-is,
- wrapped with CodeLatch guardrails,
- or rewritten into CodeLatch-native assets.

Only CodeLatch-reviewed assets may ship as official defaults.

### 8.8 Layered Source Model

Procedural assets use a layered source model:
- canonical workflow and role contracts live in CodeLatch,
- canonical reviewed asset sources live in `@codelatch/procedural-assets`,
- and adapters render or map those assets into CLI-native form.

---

## 9. Command Wrapper Implementation

### 9.1 Wrapper Design Rule

Wrapper files must stay thin.

Each wrapper does only three things:
1. identify the command,
2. identify the adapter,
3. delegate to the shared core runner.

### 9.1.1 OpenCode: Plugin-Registered Commands

OpenCode does not use `.md` command wrapper files. Commands are registered programmatically inside the plugin's `config` hook, following the OpenCode Plugin SDK interface (`Plugin = async (ctx) => { config, tool, event, ... }`):

```ts
// Plugin entry exports the Plugin interface
export const CodeLatchPlugin: Plugin = async (ctx) => {
  return {
    config: async (opencodeConfig) => {
      // Register each CodeLatch command
      opencodeConfig.command.codelatch_sync = {
        template: "",
        description: "Sync truth docs and detect drift",
        subtask: true,
      };
      // ... more commands
    },
    event: {
      "command.execute.before": async (data) => {
        // Intercept CodeLatch command execution
        // Delegate to shared core dispatcher
      }
    }
  }
}
```

Execution is intercepted via the `command.execute.before` hook, which delegates to the shared core runner. This approach **chooses programmatic registration** via the plugin `config` hook rather than file-based `.md` commands; `.opencode/commands/` remains a valid OpenCode surface for other plugins.

### 9.2 Wrapper Execution Contract

Each native wrapper resolves to the same core call shape:

```text
codelatch adapter invoke --cli <adapter-id> --command <command-name>
```

### 9.3 Wrapper Template

The generated wrapper content follows this model:

```md
# codelatch-sync

Run the CodeLatch sync flow for this repository.

Delegate to:
`codelatch adapter invoke --cli opencode --command codelatch-sync`
```

The adapter package may change the wrapper syntax to match host CLI conventions, but the semantic payload must remain the same.

### 9.4 Core Command Handler Interface

```ts
interface CommandHandler {
  command: CodelatchCommand;
  run(input: CommandInput): Promise<CommandResult>;
}
```

`CommandResult` includes:
- human summary,
- machine report path(s),
- approval requirements,
- drift verdict,
- and next suggested action.

---

## 10. Persistent State Model

### 10.1 Canonical State Files

MVP persistent state is stored in `.tmp/codelatch/` using a hybrid model:
- `.tmp/codelatch/index.db` stores high-churn operational metadata and indexes,
- Markdown artifacts are created only when durable human review is useful,
- and several namespaces are lazy-created rather than populated on every command.

Required files and folders:
- `.tmp/codelatch/index.db`
- `.tmp/codelatch/project-manifest.json`
- `.tmp/codelatch/version-governor.json`
- `.tmp/codelatch/truth-doc-registry.json`
- `.tmp/codelatch/review-index.json` only while at least one pending review exists
- `.tmp/codelatch/plans/` for active approved plans or user-kept plans
- `.tmp/codelatch/runs/` for on-demand rendered run summaries only
- `.tmp/codelatch/sync/` for readable sync reports that still require review, plus any resolved reports the user explicitly keeps
- `.tmp/codelatch/incidents/` for durable incident review artifacts named `<signature>.md`
- `.tmp/codelatch/proposals/review/` for saved or pending-review proposals only
- `.tmp/codelatch/audits/` for readable audit reports that still require review, plus any resolved reports the user explicitly keeps
- `.tmp/codelatch/cleanup/` for readable cleanup reports from explicit `codelatch-clean` runs
- `.tmp/codelatch/cache/`
- `.tmp/codelatch/workspaces/`

Schema examples in this section may show this repository's current adopted truth-doc paths for illustration. Implementations must resolve active truth-doc locations from the truth-doc registry and related manifest state rather than assuming canonical filenames in every repository.

### 10.1.1 Retention Lifecycle Terms

- **active**: the artifact still governs or informs ongoing work.
- **pending review**: the artifact supports an unresolved approval, merge, or manual decision.
- **resolved**: the underlying sync, audit, or review issue no longer needs rereading because a fix was applied or a decision was recorded.
- **closed**: a terminal workflow outcome was reached by merge, discard, or explicit user close.
- **kept**: the user explicitly overrides the default auto-delete rule for that artifact.
- **lifecycle auto-delete**: automatic removal that happens when an artifact reaches its terminal retention state and is not marked kept; this is separate from `codelatch-clean`.

### 10.2 Project Manifest Schema

```json
{
  "$schema": "https://codelatch.dev/schema/project-manifest.v1.json",
  "project_id": "code-latch",
  "framework_version": "0.1.0",
  "runtime_root": ".tmp/codelatch",
  "profile": "coding-development",
  "adapters": ["opencode", "claude-code", "codex", "kilocode"],
  "instruction_surface_policy": {
    "native_surfaces": ["AGENTS.md", "CLAUDE.md", ".claude/CLAUDE.md"],
    "compatibility_surfaces": [],
    "mirror_policy": "explicit-only"
  },
  "installed_procedural_bundles": {
    "skills": ["official/core"],
    "agents": ["official/core"],
    "instructions": ["official/core"],
    "host_integrations": ["official/core"]
  },
  "truth_docs": {
    "prd": "product-docs/codelatch-prd.md",
    "technical_design": "product-docs/technical-design.md",
    "implementation_plan": "product-docs/implementation-plan.md"
  },
  "installed_packs": [
    {
      "name": "core/base",
      "version": "0.1.0",
      "scope": "global"
    }
  ],
  "created_at": "2026-04-03T00:00:00Z",
  "updated_at": "2026-04-03T00:00:00Z"
}
```

`project-manifest.json` is the repo-level desired-state record for enabled adapters and instruction-surface policy. Bootstrap writes it before anchor emission, and sync/audit compare actual instruction files against it rather than inferring intent from whichever files happen to exist.

### 10.3 Version Governor Schema

```json
{
  "$schema": "https://codelatch.dev/schema/version-governor.v1.json",
  "catalog_version": "2026.04.03",
  "policy": "pinned",
  "core": "0.1.0",
  "adapters": {
    "opencode": "0.1.0",
    "claude-code": "0.1.0",
    "codex": "0.1.0",
    "kilocode": "0.1.0"
  },
  "profiles": {
    "coding-development": "0.1.0"
  },
  "procedural_assets": {
    "skills": "2026.04.03",
    "agents": "2026.04.03",
    "instructions": "2026.04.03",
    "host_integrations": "2026.04.03"
  },
  "packs": {
    "core/base": "0.1.0"
  }
}
```

### 10.3.1 Truth-Doc Registry Schema

`truth-doc-registry.json` is the operational anchor for logical truth-doc roles. It stores the latest approved path, version, and content hash for each truth doc.

```json
{
  "$schema": "https://codelatch.dev/schema/truth-doc-registry.v1.json",
    "truth_docs": {
      "prd": {
        "path": "product-docs/codelatch-prd.md",
        "version": "0.2.8",
        "hash": "sha256:abc123"
      },
      "technical_design": {
        "path": "product-docs/technical-design.md",
        "version": "0.2.12",
        "hash": "sha256:def456"
      },
    "implementation_plan": {
      "path": "product-docs/implementation-plan.md",
      "version": "0.1.0",
      "hash": "sha256:ghi789"
    }
  },
  "updated_at": "2026-04-19T20:00:00Z"
}
```

### 10.3.2 Adapter Metadata Schema

Each project-local CLI root keeps adapter metadata so the shared core can reason about discovery and wrapper shape without hardcoding host-specific assumptions.

```json
{
  "$schema": "https://codelatch.dev/schema/adapter-metadata.v1.json",
  "adapter_id": "claude-code",
  "project_root": ".",
  "metadata_dir": ".claude/codelatch",
  "discovery_surfaces": {
    "instructions": ["CLAUDE.md", ".claude/CLAUDE.md"],
    "commands": [".claude/commands"],
    "skills": [".claude/skills"],
    "agents": [".claude/agents"],
    "plugin_manifest": [".claude-plugin/plugin.json"],
    "plugin_hooks": ["hooks/hooks.json"]
  },
  "instruction_precedence": [".claude/CLAUDE.md", "CLAUDE.md"],
  "workflow_bindings": [
    {
      "event": "brainstorm.start",
      "host_surface": "plugin-hook",
      "binding_ref": "hooks/hooks.json#brainstormStart",
      "injection_policy": "truth-docs-plus-brainstorm-pack",
      "fallback": "wrapper-checkpoint"
    },
    {
      "event": "approval.checkpoint",
      "host_surface": "plugin-hook",
      "binding_ref": "hooks/hooks.json#approvalCheckpoint",
      "injection_policy": "approval-anchor-plus-scope",
      "fallback": "core-gate"
    }
  ],
  "install_mode": "global-host-integration",
  "wrapper_mode": "delegate-to-core"
}
```

`instruction_precedence` and `workflow_bindings` make host-specific instruction order and event realization explicit so sync, audit, and install validation can reason about them deterministically.

### 10.3.3 Distribution Manifest Schema

Each adapter persists the actual resolved install roots that were used for distribution so later validation, audit, and debugging can compare intent against reality.

```json
{
  "$schema": "https://codelatch.dev/schema/distribution-manifest.v1.json",
  "adapter_id": "codex",
  "framework_version": "0.1.0",
  "resolved_global_surfaces": {
    "instructions": ["<codex-home>/AGENTS.md"],
    "skills": ["<user-home>/.agents/skills"],
    "agents": ["<codex-home>/agents"],
    "config": ["<codex-home>/config.toml"],
    "hooks": [],
    "plugin_marketplaces": ["<user-home>/.agents/plugins/marketplace.json"],
    "plugin_cache": ["<codex-home>/plugins/cache"]
  },
  "project_metadata_dir": ".codex/codelatch",
  "validated_at": "2026-04-03T20:00:00Z"
}
```

For Codex, the `hooks` array remains empty unless experimental hooks are explicitly enabled and validated for that installation.

### 10.4 Approval Record Schema

Approval history is stored as metadata rows in `.tmp/codelatch/index.db`.

The database must keep metadata history only, not full proposal text, full plan text, or long reasoning transcripts. When a related Markdown artifact exists, readable approval notes may be appended there instead of creating standalone approval files.

```json
{
  "$schema": "https://codelatch.dev/schema/approval-record.v1.json",
  "approval_id": "approval_20260403_exact_plan_01",
  "target_type": "plan",
  "target_id": "plan_20260403_01",
  "phase": "exact-plan",
  "decision": "approved",
  "approved_scope": {
    "summary": "Implement scoped sync update for pack conflict reporting",
    "allow_destructive": false
  },
  "approval_scope_hash": "sha256:scope123",
  "truth_doc_versions": {
    "prd": "<approved-prd-version>",
    "technical_design": "<approved-technical-design-version>",
    "implementation_plan": "<approved-implementation-plan-version>"
  },
  "truth_doc_hashes": {
    "prd": "sha256:abc123",
    "technical_design": "sha256:def456",
    "implementation_plan": "sha256:ghi789"
  },
  "resolved_pack_bundle_ref": ".tmp/codelatch/cache/refs/bundle_exact_plan_01.json",
  "adapter_set_ref": ".tmp/codelatch/version-governor.json",
  "workspace_ref": null,
  "repo_state": {
    "git_head": null,
    "tree_status": "clean-or-not-applicable"
  },
  "related_doc_ref": ".tmp/codelatch/plans/plan_20260403_01.md",
  "approved_at": "2026-04-03T20:00:00Z"
}
```

### 10.4.1 Approval Anchoring Rule

An approval is reusable only when its full anchor set still matches the active execution state.

That anchor set is:
- `truth_doc_hashes`, not just doc version labels,
- `approval_scope_hash`,
- `resolved_pack_bundle_ref` or its equivalent bundle hash,
- `adapter_set_ref`,
- `workspace_ref` when the approval was granted against an isolated workspace,
- and repo state markers such as `git_head` when git is available.

If any anchor changes, the prior approval is stale and CodeLatch must stop for re-approval instead of silently continuing.

### 10.5 Approved Plan Artifact Schema

Approved plans are stored as readable Markdown under `.tmp/codelatch/plans/`, but the artifact must expose a machine-validated logical shape so execution and re-approval checks can reason about task boundaries and TDD requirements.

```json
{
  "$schema": "https://codelatch.dev/schema/approved-plan.v1.json",
  "plan_id": "plan_20260403_01",
  "status": "approved",
  "truth_docs": {
    "prd": {
      "path": "product-docs/codelatch-prd.md",
      "version": "<approved-prd-version>",
      "hash": "sha256:abc123"
    },
    "technical_design": {
      "path": "product-docs/technical-design.md",
      "version": "<approved-technical-design-version>",
      "hash": "sha256:def456"
    },
    "implementation_plan": {
      "path": "product-docs/implementation-plan.md",
      "version": "<approved-implementation-plan-version>",
      "hash": "sha256:ghi789"
    }
  },
  "resolved_pack_bundle_ref": ".tmp/codelatch/cache/refs/bundle_exact_plan_01.json",
  "approval_anchor_hash": "sha256:anchor123",
  "scope": {
    "summary": "Implement scoped sync update for pack conflict reporting",
    "allowed_paths": ["packages/core/**"],
    "allow_destructive": false
  },
  "tasks": [
    {
      "task_id": "task_sync_conflict_report",
      "summary": "Add conflict-report output to sync flow",
      "depends_on": [],
      "behavior_target": "Sync surfaces pack contradictions as actionable findings.",
      "test_target": "Sync drift fixtures fail before implementation and pass after.",
      "red_check_command": "pnpm test --filter sync-conflict",
      "expected_failing_condition": "Missing pack-conflict report output",
      "green_check_command": "pnpm test --filter sync-conflict",
      "refactor_allowance": "Internal sync formatting only; no scope expansion.",
      "final_verification_command": "pnpm test --filter sync-conflict && pnpm lint",
      "dependency_support_only": false
    }
  ],
  "stop_conditions": ["drift", "scope-expansion", "missing-dependency", "destructive-action"]
}
```

### 10.6 Run Contract Schema

Active run state is stored in `.tmp/codelatch/index.db`.

Detailed task-level TDD contracts live in the approved plan artifact. Readable run summaries are rendered on demand into `.tmp/codelatch/runs/` rather than being persisted for every run by default.

```json
{
  "$schema": "https://codelatch.dev/schema/run-contract.v1.json",
  "run_id": "run_20260403_200500",
  "session_id": "session_20260403_01",
  "plan_ref": ".tmp/codelatch/plans/plan_20260403_01.md",
  "approval_refs": ["approval_20260403_exact_plan_01"],
  "mode": "free-run",
  "status": "active",
  "current_task_id": "task_sync_conflict_report",
  "workspace_ref": null,
  "truth_doc_hashes": {
    "prd": "sha256:abc123",
    "technical_design": "sha256:def456",
    "implementation_plan": "sha256:ghi789"
  },
  "resolved_pack_bundle_ref": ".tmp/codelatch/cache/refs/bundle_exact_plan_01.json",
  "adapter_set_ref": ".tmp/codelatch/version-governor.json",
  "repo_state": {
    "git_head": null,
    "tree_status": "clean-or-not-applicable"
  },
  "stop_conditions": ["drift", "scope-expansion", "missing-dependency", "destructive-action"],
  "rendered_summary_ref": null
}
```

### 10.7 Concurrency and Locking Model

Because all supported CLIs share one `.tmp/codelatch/` runtime root, MVP must define a single concurrency contract instead of letting each adapter invent its own behavior.

Rules:
- `index.db` uses SQLite WAL mode so routine reads stay multi-reader.
- All mutating operations write through transactions and carry both `run_id` and `session_id`.
- Truth-doc writes, approval writes, merge-back, cleanup, and schema migrations acquire an exclusive operation lease before mutating shared state.
- Merge-back into the parent workspace is serialized per repository, even if isolated workspaces were created in parallel.
- Expired leases may be marked stale only after the owning session is no longer active; destructive stale-lock recovery still requires explicit user approval.

Logical lease shape:

```json
{
  "$schema": "https://codelatch.dev/schema/operation-lock.v1.json",
  "lock_id": "lock_merge_back_parent_workspace",
  "scope": "merge-back",
  "owner_run_id": "run_20260403_200500",
  "owner_session_id": "session_20260403_01",
  "mode": "exclusive",
  "workspace_ref": ".tmp/codelatch/workspaces/ws_01",
  "acquired_at": "2026-04-03T20:05:00Z",
  "expires_at": "2026-04-03T20:15:00Z"
}
```

### 10.8 Incident Record Schema

Each normalized incident signature gets one logical record, indexed for lookup and surfaced through a readable incident review artifact at `.tmp/codelatch/incidents/<signature>.md`. These incident artifacts are durable by default and are removed only through explicit cleanup or explicit user deletion.

```json
{
  "$schema": "https://codelatch.dev/schema/incident.v1.json",
  "signature": "missing-dependency-in-approved-plan",
  "count": 2,
  "first_seen": "2026-04-03T10:00:00Z",
  "last_seen": "2026-04-03T18:30:00Z",
  "summary": "Approved execution plan omitted a required dependency task.",
  "examples": [
    {
      "run_id": "run_20260403_100000",
      "command": "codelatch-sync",
      "note": "Plan omitted migration prereq."
    }
  ],
  "status": "candidate",
  "candidate_reason": [
    "recurred",
    "caused-rework"
  ],
  "suggested_pack_target": "project/planning-guardrails",
  "review_doc_ref": ".tmp/codelatch/incidents/missing-dependency-in-approved-plan.md"
}
```

### 10.9 Proposal Schema

Proposal metadata lives in `.tmp/codelatch/index.db` by default.

Readable proposal Markdown is materialized only when the user explicitly saves the proposal or when it becomes pending-review material.

```json
{
  "$schema": "https://codelatch.dev/schema/proposal.v1.json",
  "proposal_id": "proposal_20260403_missing_dependency_guardrail",
  "source_incidents": ["missing-dependency-in-approved-plan"],
  "proposal_type": "pack-patch",
  "target": "project/planning-guardrails",
  "status": "draft",
  "summary": "Add plan validation guidance for dependency-support work.",
  "review_doc_ref": null,
  "created_at": "2026-04-03T19:00:00Z"
}
```

### 10.10 Audit Report Schema

Audit results always enter machine state. A readable audit Markdown report is emitted only when the audit finds actionable findings, risks, or failures, or when the user explicitly asks for one. Once the underlying issue is resolved, that report auto-deletes by default unless the user explicitly keeps it.

```json
{
  "$schema": "https://codelatch.dev/schema/audit-report.v1.json",
  "run_id": "run_20260403_190500",
  "command": "codelatch-audit",
  "issues": [
    {
      "kind": "pack-conflict",
      "severity": "high",
      "message": "Project pack overrides global pack with contradictory approval rule.",
      "pointers": [
        ".tmp/codelatch/packs/project/approval-delta/index.md",
        "packs/global/core/base/index.md"
      ]
    }
  ],
  "report_doc_ref": ".tmp/codelatch/audits/audit_20260403_190500.md",
  "generated_at": "2026-04-03T19:05:00Z"
}
```

### 10.11 Sync Report Schema

Readable sync reports are emitted only when drift, conflict, or a manual decision needs review.

```json
{
  "$schema": "https://codelatch.dev/schema/sync-report.v1.json",
  "run_id": "run_20260403_190000",
  "command": "codelatch-sync",
  "highest_drift_class": 1,
  "findings": [
    {
      "kind": "missing-implementation-plan-dependency",
      "severity": "high",
      "message": "Approved scope omits required migration prereq.",
      "pointers": ["product-docs/implementation-plan.md"]
    }
  ],
  "proposed_writes": [],
  "report_doc_ref": ".tmp/codelatch/sync/sync_20260403_190000.md",
  "generated_at": "2026-04-03T19:00:00Z"
}
```

### 10.12 Cleanup Report Schema

Cleanup reports remain human-readable until a later explicit cleanup removes them.

```json
{
  "$schema": "https://codelatch.dev/schema/cleanup-report.v1.json",
  "cleanup_id": "cleanup_20260403_210000",
  "approval_ref": "approval_20260403_cleanup_01",
  "deleted_targets": [".tmp/codelatch/sync/sync_20260402_180000.md"],
  "retained_targets": [".tmp/codelatch/incidents/missing-dependency-in-approved-plan.md"],
  "report_doc_ref": ".tmp/codelatch/cleanup/cleanup_20260403_210000.md",
  "generated_at": "2026-04-03T21:00:00Z"
}
```

### 10.13 Context Bundle Manifest Schema

Subtasks and command runs consume a runtime bundle manifest that points to the exact context anchor set used for that run.

```json
{
  "$schema": "https://codelatch.dev/schema/context-bundle.v1.json",
  "bundle_id": "bundle_exact_plan_01",
  "truth_docs": [
    "product-docs/codelatch-prd.md",
    "product-docs/technical-design.md",
    "product-docs/implementation-plan.md"
  ],
  "packs": [
    ".tmp/codelatch/packs/cache/resolved-bundles/global/core-base@0.1.0/index.md"
  ],
  "incidents": [],
  "hot_snippets": [],
  "bundle_hash": "sha256:bundle123",
  "created_at": "2026-04-03T20:00:00Z"
}
```

### 10.14 Review Index Schema

`review-index.json` exists only while at least one pending review remains unresolved.

```json
{
  "$schema": "https://codelatch.dev/schema/review-index.v1.json",
  "pending_reviews": [
    {
      "review_id": "review_ws_01",
      "workspace_id": "ws_01",
      "kind": "merge-back",
      "risk_flags": ["shared-boundary-change"],
      "merge_summary_ref": ".tmp/codelatch/workspaces/ws_01/merge-summary.md"
    }
  ],
  "updated_at": "2026-04-03T20:10:00Z"
}
```

### 10.15 Workspace Record Schema

Each isolated write workspace keeps a record in machine state so review, cleanup, and merge-back operate against a stable identifier rather than ad hoc paths.

```json
{
  "$schema": "https://codelatch.dev/schema/workspace-record.v1.json",
  "workspace_id": "ws_01",
  "origin_run_id": "run_20260403_200500",
  "isolation_mode": "git-worktree",
  "path": ".tmp/codelatch/workspaces/ws_01",
  "status": "pending-review",
  "scope_summary": "Add conflict-report output to sync flow",
  "changed_files": ["packages/core/src/sync.ts"],
  "merge_summary_ref": ".tmp/codelatch/workspaces/ws_01/merge-summary.md",
  "created_at": "2026-04-03T20:05:00Z"
}
```

### 10.16 Merge Summary and Conflict Resolution Schemas

Pending-review merge material must be reviewable in both machine and human forms.

Merge summary logical shape:

```json
{
  "$schema": "https://codelatch.dev/schema/merge-summary.v1.json",
  "summary_id": "merge_summary_ws_01",
  "workspace_id": "ws_01",
  "changed_files": ["packages/core/src/sync.ts"],
  "high_level_summary": "Adds actionable pack-conflict reporting to sync output.",
  "risk_flags": ["shared-boundary-change"],
  "status": "pending-review"
}
```

Conflict-resolution proposal logical shape:

```json
{
  "$schema": "https://codelatch.dev/schema/conflict-resolution.v1.json",
  "proposal_id": "conflict_ws_01",
  "workspace_id": "ws_01",
  "conflicts": [
    {
      "file": "packages/core/src/sync.ts",
      "kind": "text-conflict"
    }
  ],
  "proposed_resolution": "Keep parent validation changes and reapply conflict-report block.",
  "status": "awaiting-approval"
}
```

---

## 11. Pack Model and Discovery Logic

### 11.1 Pack Storage Layout

```text
.tmp/codelatch/packs/
  project/
    <pack-name>/
      index.md
  cache/
    resolved-bundles/
      global/
        <pack-name>@<version>/
          index.md
          provenance.json
```

Global packs installed by profiles or installer are materialized into the project as version-pinned resolved snapshots under `.tmp/codelatch/packs/cache/resolved-bundles/global/` so that runs remain reproducible even if upstream packages change later. Project-authored packs remain under `.tmp/codelatch/packs/project/`.

### 11.2 Pack Frontmatter

Required fields remain:

```yaml
name:
purpose:
applies_to:
priority:
extends:
tags: []
```

MVP also allows these optional fields:

```yaml
version:
status:
owner:
conflicts_with: []
references: []
```

### 11.3 Resolution Order

Pack precedence for MVP is:

1. explicit session-approved override
2. approved project-local delta packs
3. project packs
4. selected profile packs
5. global packs
6. built-in defaults

### 11.4 Discovery Inputs

Pack resolution uses only these inputs:
- command name,
- current truth-doc phase,
- explicit task scope,
- referenced domains from truth docs,
- recurring incident hints,
- and installed pack metadata.

It does **not** use broad repository crawling as the default.

### 11.5 MVP Pack Selection Algorithm

For every command run:

1. Load base context references:
   - truth-doc registry
   - project manifest
   - active profile definition
   - adapter metadata
2. Resolve semantic scopes from:
   - command name
   - user prompt/task scope
   - currently active truth-doc section if available
3. Rank candidate packs by:
   - precedence layer,
   - exact `applies_to` match,
   - explicit references,
   - and incident relevance.
4. Load at most:
   - 1 base framework pack,
   - 1 profile pack,
   - 3 scope-matched packs,
   - 1 incident-derived pack.
5. If more than 6 packs are still required, stop and request a narrower scope or explicit approval.

### 11.6 Conflict Resolution Mechanics

Pack collisions are classified into three types:

#### Type A: Duplicate Guidance
If two packs say the same thing, keep the higher-precedence source and record a dedup note in the audit output.

#### Type B: Compatible Extension
If one pack extends another without contradiction, merge them in precedence order and keep the combined result.

#### Type C: Normative Contradiction
If two packs give incompatible instructions that change behavior, approval flow, scope, or safety policy:
- stop execution,
- produce a pack conflict report,
- require user review,
- and block automatic merge until the contradiction is resolved.

Project packs may override global packs only with explicit approval and a recorded audit trail.

---

## 12. Context Loading and Cache Model

### 12.1 Two-Layer Cache Design

MVP uses two cache layers.

#### Layer 1: Reference Cache
Stores:
- file hashes,
- paths,
- semantic tags,
- and previously resolved pack bundles.

Location:
- `.tmp/codelatch/cache/refs/`

#### Layer 2: Hot Snippet Cache
Stores only approved or repeated high-value snippets for hot paths.

Location:
- `.tmp/codelatch/cache/snippets/`

### 12.2 Cache Rules

- References are preferred over embedded snippets.
- Snippets are cached only for repeated or approved-scope flows.
- Cached content is invalidated when source hashes change.
- Cache entries never become source of truth.

### 12.2.1 Silent Scouting Rule

Safe read-only internal scouting should not create approval spam.

Rules:
- metadata reads, focused file reads, cache lookups, and internal index checks may happen silently,
- read-only scout lanes remain silent unless they discover drift, contradiction, risk, or a user-facing decision,
- the framework should surface findings rather than raw exploration logs by default,
- and read-only scouting must never silently mutate truth docs, runtime state that requires approval, or project behavior.

### 12.3 Context Bundle Rule

Subtasks and command runs receive a generated bundle manifest that points to:
- truth docs,
- selected packs,
- relevant incidents,
- and any hot snippets.

The bundle is a runtime convenience artifact, not a canonical document.

### 12A. Context Authority and Injection Contract

#### 12A.1 Purpose

CodeLatch must control context in a way that improves alignment, reproducibility, and token efficiency without overwhelming the model.

The framework therefore distinguishes between:
- **authoring source context**,
- **installed discoverable context**,
- **runtime-resolved context**,
- and **actively injected model context**.

These layers are related, but they are not interchangeable.

#### 12A.2 Context Authority Layers

##### Layer 1: Authoring Source Context

Author-owned reusable framework context lives in the CodeLatch source repository.

Canonical locations include:
- `packages/procedural-assets/context/`,
- `packs/global/`,
- and profile-owned pack definitions or related source templates.

This layer is the only canonical authoring source for framework-owned reusable context.

##### Layer 2: Installed Discoverable Context

Adapters install reviewed context assets into each host tool's **documented instruction, configuration, and extension surfaces**, rather than assuming a universal `context/` directory.

Examples include:
- **OpenCode**: `AGENTS.md`, `opencode.json` (with `plugin` and `command` keys), `.opencode/skills/*/SKILL.md` (YAML frontmatter: `name`, `description`), `.opencode/agents/`, `.opencode/plugins/`, `.opencode/instructions.md`, plugin `config` hook for command registration, `~/.config/opencode/...` (global default), cross-host skill discovery from `.claude/skills/*/SKILL.md` and `.agents/skills/*/SKILL.md`, and remote instructions via `config.instructions` URLs
- **Claude Code**: `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/skills/`, `.claude/agents/`, `.claude/commands/`, and `.claude-plugin/plugin.json`
- **Codex**: `AGENTS.md`, `.agents/skills/`, `.agents/plugins/marketplace.json`, `.codex/agents/`, `.codex/config.toml`, optional experimental `.codex/hooks.json`, and `.codex-plugin/plugin.json`
- **Kilo Code**: `AGENTS.md`, documented OpenCode-compatible `opencode.json` / `.opencode/...` surfaces when used, optional compatibility `CLAUDE.md`, optional `CONTEXT.md`, `kilo.jsonc`, `.kilo/kilo.jsonc`, `.kilo/skills/`, `.kilo/agents/`, and `~/.config/kilo/...`

Installed discoverable context is a distributed artifact layer, not the canonical authoring source.

##### Layer 3: Runtime-Resolved Context

For each command or workflow phase, CodeLatch resolves the relevant truth docs, packs, incidents, and procedural references into runtime state under `.tmp/codelatch/...`.

Examples include:
- resolved pack bundles,
- context bundle manifests,
- cache references,
- hot snippets when explicitly justified,
- and approval-aware run context.

This layer is the operational context-selection layer used by the framework for reproducible execution.

##### Layer 4: Injected Model Context

Injected model context is the exact subset of information surfaced to the model during a specific command phase, approval boundary, or execution step.

It is not equal to all installed context and not equal to the full runtime bundle.

For MVP, Layer 4 is operationalized as an **injected-context envelope** with this shape:

```json
{
  "event": "execution.step",
  "phase": "free-run",
  "command": "codelatch-sync",
  "scope_ref": "run-contract:task-04",
  "approval_ref": "approval:2026-04-17T11:30:00Z",
  "truth_doc_refs": [
    "prd@0.2.8#sha256:...",
    "technical_design@0.2.12#sha256:..."
  ],
  "pack_refs": ["project:payments#sha256:..."],
  "incident_refs": ["incident:txn-timeout#sha256:..."],
  "snippets": [
    {
      "source": "product-docs/implementation-plan.md",
      "reason": "approved-task-scope",
      "hash": "sha256:...",
      "lines": "120-144"
    }
  ],
  "stop_conditions": ["scope-expansion", "drift", "missing-dependency"],
  "provenance": {
    "bundle_manifest": ".tmp/codelatch/context/bundles/run-004.json",
    "generated_at": "2026-04-17T11:31:00Z"
  }
}
```

Rules:
- references are preferred over copied text,
- snippets are included only when a reference alone would be insufficient for correct execution,
- every snippet carries source, reason, and hash metadata,
- and the envelope is stored by reference in runtime state rather than becoming a new source of truth.

#### 12A.3 Authority Rules

Authority order for behavior and execution is:

1. approved truth docs,
2. approved execution-plan and run-contract state,
3. approved runtime-resolved context bundles,
4. installed tool-native discoverable assets,
5. source templates and authoring assets used for packaging or installation.

If two layers disagree, the higher layer wins.

Truth docs always outrank packs. Approved runtime context always outranks passive installed copies. Installed tool-native assets must never silently override approved truth, approved scope, or runtime stop conditions.

#### 12A.4 Installation Rule

CodeLatch uses a strict derived-install model.

Rules:
- framework-owned reusable context is authored in the CodeLatch source repository,
- installer selects only approved profile, pack, and procedural assets,
- adapters render, map, or copy those assets into the host tool's documented discovery surfaces,
- install results are recorded in adapter metadata and distribution manifests,
- and installed copies are derived artifacts rather than co-equal authoring sources.

Direct manual edits to installed tool-native context are not part of the normal authority model for MVP.

#### 12A.5 Runtime Consumption Rule

CodeLatch must not treat all installed context as active context.

Instead, each command run follows this sequence:

1. determine current command, workflow phase, scope, and approval state,
2. resolve relevant truth docs and runtime anchors,
3. resolve only the packs and incidents justified by scope,
4. build a runtime bundle manifest,
5. inject only the minimum viable information required for the current model step.

This ensures that installed availability does not imply active prompt inclusion.

#### 12A.6 MVI Rule

CodeLatch uses **MVI (Minimum Viable Information)** as the governing rule for model-context injection.

Definition:

> For any command phase or execution step, CodeLatch should inject only the minimum sufficient information required for correct, safe, and aligned behavior at that moment.

MVI does not mean loading as little as possible regardless of risk. It means loading no more than is needed while still preserving correctness, safety, reproducibility, and workflow discipline.

This rule exists to:
- reduce token waste,
- reduce prompt noise,
- improve model focus,
- preserve vibe-coding speed,
- and prevent unnecessary context sprawl.

#### 12A.7 Install Many, Select Few, Inject Minimal

The framework context model follows this operational principle:

- **install many** approved assets so they are available when needed,
- **select few** assets into the runtime bundle based on current scope and workflow phase,
- **inject minimal** information into the model according to MVI.

#### 12A.8 Event-Driven Injection Rule

CodeLatch is a plugin framework and should not rely only on user wording to decide context injection.

Adapters and core command flows may inject context at defined workflow events such as:
- bootstrap start,
- brainstorming start,
- truth-doc sync,
- exact-plan generation,
- approval boundaries,
- free-run task execution,
- drift stop events,
- merge or review checkpoints,
- learning review,
- and promotion review.

Operational event map for MVP:

| Shared event | Minimum active context | Preferred host binding | Fallback when unavailable |
| --- | --- | --- | --- |
| `bootstrap.start` | adoption rules, truth-doc registry seed, repo-detection facts | wrapper entry or plugin start hook | bootstrap wrapper prelude |
| `brainstorm.start` | PRD, relevant domain pack refs, brainstorming procedure | plugin hook or event subscription | wrapper checkpoint |
| `sync.start` | truth docs, registry, repo-change summary, drift rules | command wrapper plus plugin event | core preflight |
| `exact-plan.generate` | implementation plan scope, TDD planning rules, scoped pack refs | planner hook or wrapper checkpoint | core planner gate |
| `approval.checkpoint` | current proposal/approved plan, approval anchors, stop conditions | approval hook | core gate |
| `execution.step` | approved task, run contract, scoped bundle refs, justified incident hints | execution hook or event subscription | executor checkpoint |
| `drift.stop` | drift evidence, conflicting refs, impacted truth docs | stop hook or event | core stop handler |
| `review.checkpoint` | changed-files summary, risk flags, merge guardrails | review hook or event | core review gate |
| `learn.review` | incidents, worthy-threshold refs, proposal state | review hook or command checkpoint | core learn gate |
| `promote.review` | proposal comparison refs, promotion policy, approval anchors | review hook or command checkpoint | core promote gate |

Adapter realization may differ by host. Claude Code uses plugin hooks, OpenCode uses runtime plugin modules and event subscriptions, Codex uses packaged plugins plus marketplace wiring with optional separate experimental hooks, and Kilo Code uses documented OpenCode-compatible config/runtime surfaces plus Kilo-native config-triggered or wrapper-level checkpoints.

If a host lacks a rich native lifecycle hook for an event, the adapter must bind the same shared event at the closest deterministic wrapper or shared-core checkpoint and record that fallback in adapter metadata.

#### 12A.9 Phase-Based Injection Expectations

Expected MVI-oriented injection by phase:

- **bootstrap**: setup rules, adoption rules, truth-doc initialization templates, minimal repo-detection context
- **brainstorm**: PRD, relevant product or domain packs, brainstorming procedure
- **sync**: truth docs, truth-doc registry, drift rules, relevant repo-change signals
- **exact planning**: implementation-plan scope, task-contract requirements, TDD planning rules, relevant scoped packs
- **free-run execution**: current approved task, stop conditions, scoped context bundle, relevant incident hints only when justified
- **review and merge**: merge summary, changed-files summary, risk flags, merge guardrails
- **learn and promote**: relevant incidents, proposal state, comparison targets, promotion policy

The framework should avoid carrying earlier-phase context forward unless it remains necessary for the current step.

#### 12A.10 Reproducibility Rule

When runtime context affects approval or execution behavior, CodeLatch must preserve a reproducible reference to that context selection.

This includes:
- truth-doc hashes,
- resolved pack bundle references or hashes,
- run-contract references,
- approval anchors,
- and relevant workspace references when applicable.

The goal is that a later run can explain not only what was installed, but what context was actually active for the approved execution.

#### 12A.11 Failure and Escalation Rule

If CodeLatch cannot reduce context to an MVI-sized bundle without losing required safety or correctness, it must not silently over-expand and continue.

It must instead:
- narrow scope,
- ask for clarification,
- request approval for broader context,
- or stop at the appropriate workflow checkpoint.

If installed context, runtime bundle selection, and truth-doc direction cannot be reconciled cleanly, CodeLatch must surface that as a drift, pack-conflict, or approval-staleness event rather than silently choosing one.

---

## 13. Truth Docs, Drift, and Sync Design

### 13.1 Truth Hierarchy

The logical truth hierarchy remains:

1. PRD
2. technical design
3. implementation plan
4. code and routine execution views

### 13.2 Controlled Execution Flow

The operational flow for MVP is:

1. brainstorm,
2. approval on direction,
3. refresh and check the truth docs,
4. approval on updated truth docs,
5. derive the exact execution plan from the implementation plan,
6. approval on the exact plan,
7. free-run inside approved scope,
8. stop only on drift, conflict, missing dependency, destructive action, or scope expansion.

For code and behavior changes inside free-run, execution mode is strict TDD:
- RED,
- verify RED,
- GREEN,
- verify GREEN,
- REFACTOR,
- re-verify.

Docs-only, metadata-only, wrapper-text-only, and cleanup-only work may use non-TDD execution mode.

### 13.2.1 Brainstorm Interaction Rule

Brainstorming is interactive by default.

Rules:
- default interaction is one question at a time,
- small related question batches are allowed when they reduce needless back-and-forth,
- once enough clarity exists, CodeLatch presents direction or options before execution,
- and brainstorming must not silently collapse into implementation without an approval checkpoint.

### 13.3 Drift Classification

MVP uses three drift classes.

#### Class 0: Metadata Drift
Examples:
- stale version number,
- outdated date,
- missing changelog entry,
- registry path mismatch.

Handling:
- may be proposed automatically,
- requires approval before write,
- does not require re-brainstorming.

#### Class 1: Structural Drift
Examples:
- new module or command added without technical-design coverage,
- changed folder boundary,
- new adapter behavior,
- missing implementation-plan dependency.

Handling:
- hard stop,
- update technical design and/or implementation plan,
- re-approve before execution continues.

#### Class 2: Semantic Drift
Examples:
- changed product behavior,
- changed approval philosophy,
- changed pack precedence model,
- changed scope expectations.

Handling:
- hard stop,
- trigger re-brainstorming,
- update all affected truth docs,
- re-approve before continuing.

### 13.3.1 Drift Detection Inputs

Drift classification is computed from a bounded input set rather than open-ended repository interpretation.

Inputs are:
- current truth-doc registry paths, versions, and hashes,
- approved plan scope and task contracts,
- current run contract and approval anchors,
- changed files or workspace diff summary,
- adapter metadata and distribution manifest state,
- resolved pack bundle manifest,
- and pending workspace/review state.

If a signal cannot be tied to one of these inputs, it is not enough by itself to classify drift.

### 13.3.2 Drift Decision Rules

Classification rules for MVP:
- **Class 0** when the mismatch changes metadata only and does not alter behavior, scope, architecture, or approval semantics.
- **Class 1** when the mismatch changes structure, dependency shape, adapter behavior, folder boundaries, or task sequencing without changing intended product meaning.
- **Class 2** when the mismatch changes product behavior, approval policy, safety policy, scope meaning, or pack behavior that can affect execution outcome.
- If a finding can reasonably fit both Class 1 and Class 2, default to **Class 2**.
- If the finding conflicts with an approval anchor, CodeLatch must treat the approval as stale even if no file write has happened yet.

### 13.3.3 False-Positive Control

To avoid noisy stop conditions:
- timestamps, formatting-only changes, and regenerated metadata are ignored unless they alter approval anchors,
- each drift finding must include at least one concrete pointer,
- low-confidence findings may produce a review warning but must not trigger automatic writes,
- and workspace-local experiments that stay outside approved merge-back must not be treated as project drift until merge is proposed.

### 13.4 Approval and Run State

Before free-run continues, CodeLatch persists:
- approval history metadata in `.tmp/codelatch/index.db`,
- exact approved plan artifacts in `.tmp/codelatch/plans/` while they remain active or pending review,
- active run/workspace state in `.tmp/codelatch/index.db`,
- and the approval anchor set that ties the run to truth-doc hashes, resolved pack bundle state, adapter set, and repository/workspace state.

Approved plans auto-delete after merge or close unless the user explicitly chooses to keep them.

This is how later steps determine what is approved, for which scope, and against which truth-doc state without forcing routine operational churn into human-facing files.

### 13.5 `codelatch-sync` Pipeline

`codelatch-sync` executes the following pipeline:

1. load truth-doc registry and project manifest,
2. read current truth docs,
3. inspect project files, maintained root docs, actual instruction anchors, project-manifest instruction-surface policy, and adapter metadata,
4. classify drift findings against approval anchors, plan scope, adapter state, persisted instruction-surface policy, and resolved pack bundle state,
5. record sync result metadata in `.tmp/codelatch/index.db`,
6. materialize a readable sync report under `.tmp/codelatch/sync/` only when drift, conflict, or a manual decision must be reviewed, then auto-delete it by default once resolved unless the user explicitly keeps it,
7. present low-risk proposed changes,
8. require approval before any write,
9. trigger re-brainstorm flow for Class 1 or Class 2 drift.

### 13.6 Why Sync Is Separated from Audit

`codelatch-sync` is corrective and document-oriented.

It must also flag missing, extra, or semantically divergent instruction anchors relative to the enabled adapter set and any explicit compatibility-mirror policy recorded for the repository.

`codelatch-audit` is diagnostic and broader. It looks at contradictions, pack overlap, risks, and state health even when no doc update is applied.

---

## 14. Command Pipelines

### 14.1 `codelatch-bootstrap`

Pipeline:
1. detect repo state,
2. detect existing truth docs and root files,
3. ask adopt/migrate/fresh decision,
4. confirm the enabled adapter set for the repository and any explicit compatibility-mirror policy,
5. initialize `.tmp/codelatch/` runtime root,
6. create or adopt truth docs and non-anchor root files,
7. create truth-doc registry and project manifest with the selected adapter and instruction-surface policy,
8. create the thin root instruction anchor or anchors required by the enabled adapter set (`CLAUDE.md` for Claude Code; `AGENTS.md` for Codex, OpenCode, and Kilo Code), plus any explicitly requested compatibility mirrors,
9. link the repository to the globally installed plugin distribution,
10. run initial audit,
11. present summary for approval of resulting setup artifacts.

### 14.2 `codelatch-pack-create`

Pipeline:
1. identify scope,
2. identify purpose,
3. choose project vs domain pack,
4. generate pack frontmatter,
5. create `index.md`,
6. register pack in project manifest,
7. run overlap/conflict scan,
8. present pack summary.

### 14.2.1 Pack Creation Modes

`codelatch-pack-create` supports two MVP modes:
- **interview-guided** by default, so scope and purpose are clarified before the pack is written,
- **bare template** for advanced users who already know the target scope and content shape.

Both modes must converge on the same validated frontmatter requirements, overlap scan, and approval-visible summary.

### 14.3 `codelatch-learn`

Pipeline:
1. scan incident records,
2. score worthy candidates,
3. compare against existing project packs,
4. compare against prior proposals,
5. record proposal metadata in `.tmp/codelatch/index.db`,
6. materialize proposal review markdown only if the user saves it or it becomes pending-review material,
7. auto-draft a proposed global-context patch when incident patterns reveal reusable knowledge,
8. trigger brainstorming when the learning path is ambiguous,
9. require approval for any pack mutation, promotion suggestion, or global-context write.

### 14.4 `codelatch-clean`

Pipeline:
1. enumerate `.tmp/codelatch/` reconstructible artifacts,
2. filter to done + superseded + reconstructible entries,
3. present deletion list,
4. require approval,
5. delete selected items,
6. write cleanup report to `.tmp/codelatch/cleanup/cleanup_<timestamp>.md`.

`codelatch-clean` never runs silently. Cleanup remains an explicit user-confirmed action.

This manual cleanup flow is separate from lifecycle auto-deletion. Plans, sync reports, audit reports, and pending-review merge artifacts may be removed automatically when they reach their documented terminal state and are not marked kept.

Cleanup reports are not lifecycle auto-deleted. Older cleanup reports may be proposed for deletion only by a later explicit `codelatch-clean` run.

### 14.5 `codelatch-audit`

Pipeline:
1. inspect truth docs and maintained root docs,
2. inspect pack overlap,
3. inspect state schema health,
4. inspect adapter metadata alignment,
5. inspect unresolved incidents and saved or pending-review proposals,
6. record audit result metadata in `.tmp/codelatch/index.db`,
7. write audit Markdown only when actionable findings, risks, or failures exist, or when the user explicitly requests it, then auto-delete it by default once resolved unless the user explicitly keeps it,
8. surface contradictions and risk conditions.

### 14.6 `codelatch-promote`

Pipeline:
1. load approved project-level lessons,
2. compare with global pack catalog,
3. compare with previously promoted lessons,
4. generate promotion candidates,
5. create promotion proposal draft metadata and optional review material,
6. require explicit approval before publishing or promoting.

---

## 15. Parallel Work and Merge Safety

### 15.1 Isolation Strategy

Parallel write work must never write directly into the shared workspace first.

MVP supports three isolation modes:
- isolated patch directory,
- git worktree,
- or temp branch equivalent managed by local tooling.

Default choice:
- **git worktree when git is available**, otherwise
- **isolated patch directory under `.tmp/codelatch/workspaces/`**.

### 15.2 Scoped Subtask Contract

Every subtask receives:
- goal,
- allowed scope,
- required context references,
- allowed tools/actions,
- expected result contract,
- stop conditions,
- and must-not-do exclusions.

### 15.3 Scout Lane Design

Default scout lanes are:
- docs,
- code,
- optional tests,
- optional context/policy,
- optional history,
- optional external.

Scout lanes are read-only by default.

### 15.4 Subtask Return Contract

```json
{
  "kind": "docs|code|tests|context|history|external",
  "scope": "string",
  "verdict": "ok|warning|stop",
  "summary": [],
  "pointers": []
}
```

### 15.5 Merge Guardrails

Before merge-back, CodeLatch must run these checks:

1. **Workspace overlap check**
   - reject overlapping writes unless explicitly sequenced.
2. **Truth-doc drift check**
   - reject if changes create Class 1 or Class 2 drift.
3. **Shared-boundary check**
   - reject if a supposedly isolated task changed shared modules outside its contract.
4. **Schema validity check**
   - reject invalid JSON/Markdown frontmatter structures.
5. **Configured quality checks**
   - run lint/test/build only if part of approved scope or configured profile add-ons.

Merge-back may proceed only after the isolated parallel flow is fully complete.

Even when no conflict exists, CodeLatch must:
- prepare a short merge summary,
- present it to the user,
- and require explicit approval before merging back to the parent workspace.

The default short merge summary contract includes:
- changed files,
- a high-level summary of the merged outcome,
- and risk flags.

### 15.6 Conflict Resolution Approval Flow

If merge-back detects conflicts, CodeLatch must:
- stop before applying any merge fix,
- show the user the proposed conflict-resolution plan,
- require approval for that plan,
- apply the approved conflict fix,
- and only then complete merge-back.

If the user rejects merge-back, CodeLatch must:
- keep the isolated workspace or worktree intact,
- mark the workspace record as `pending-review`,
- and avoid auto-discarding or auto-converting the isolated work.

Pending-review state is indexed at `.tmp/codelatch/review-index.json`.

Lifecycle rule:
- create `review-index.json` only when at least one pending review exists,
- and remove it when no pending reviews remain.

The default pre-prompt pending-review reminder includes:
- count,
- workspace or review IDs,
- and risk flags.

Any pending-review merge summary Markdown exists only while unresolved and must auto-delete once the review item is merged, discarded, or explicitly closed.

### 15.7 Auto-Repair Limit

Auto-repair is allowed only for low-risk mechanical issues such as:
- formatting,
- import ordering,
- trailing whitespace,
- or regenerated metadata files.

Inside merge-back, those low-risk fixes still require user approval when they are part of conflict resolution.

Auto-repair is not allowed for:
- behavior changes,
- architecture changes,
- truth-doc contradictions,
- or shared-module scope violations.

---

## 16. Learning and Promotion Design

### 16.1 Incident Lifecycle

Incident status values are:
- `open`
- `candidate`
- `approved`
- `rejected`
- `promoted`

### 16.2 Candidate Scoring Rule

An incident becomes a learning candidate when at least 2 of these are true:
- repeated,
- caused rework,
- indicates missing guidance,
- generalizable into a pack or rule.

The learning engine computes the reasons, but approval still belongs to the user.

### 16.3 Reviewable Outputs

Every learning proposal produces machine-readable metadata in `.tmp/codelatch/index.db`.

A matching markdown review doc for humans is created only when:
- the user explicitly saves the proposal,
- or the proposal becomes pending-review material.

Suggested markdown review location:

```text
.tmp/codelatch/proposals/review/<proposal-id>.md
```

### 16.4 Promotion Gate

Global promotion requires all of the following:
- project-level lesson approved,
- no unresolved conflict with existing global packs,
- explicit promotion review,
- and explicit user approval.

There is no silent promotion path.

If incident review suggests a reusable global context update, CodeLatch may prepare the draft automatically, but it must not write global context until the user approves that patch.

---

## 17. Install and Upgrade Design

### 17.1 Installer Responsibility

The installer distributes the CodeLatch host-native integration layer to supported CLIs.

It installs:
- command wrappers (or programmatic command registration for hosts like OpenCode that use plugin config hooks),
- skills,
- agents,
- host-native instruction assets,
- hook or plugin packaging files when supported,
- and other documented adapter-specific integration assets.

into CLI-native global locations by default.

`codelatch-bootstrap` is not the installer. It only scaffolds and wires a repository after the host-native integration layer is available.

### 17.2 Install Pipeline

The installer runs this sequence:

1. load embedded catalog,
2. detect supported CLI adapters to offer,
3. ask user for profile selection,
4. ask for stack bundle/add-ons,
5. compute reviewed procedural bundle plan,
6. materialize selected packages, packs, and procedural assets into documented host-tool global locations,
7. pin versions and asset provenance in `version-governor.json`,
8. write adapter distribution manifests,
9. validate CLI-native discovery,
10. emit installation report.

### 17.3 Upgrade Policy

There are no silent upgrades.

Upgrade happens only when the user explicitly requests it.

### 17.4 Catalog Verification Mechanism

MVP uses a signed catalog model:

- installer ships with an embedded default catalog,
- optional updated catalog is fetched only on explicit upgrade,
- updated catalog must include an **Ed25519 signature**,
- installer verifies signature against embedded trusted public keys,
- unsigned or invalid catalogs are rejected.

### 17.5 Version Compatibility Rule

The version governor pins a compatible set for:
- core,
- adapters,
- profiles,
- packs,
- capability bundles,
- skills,
- agents,
- hook packages,
- plugin packaging assets,
- and distributed instruction assets.

If a requested upgrade would create an incompatible set, the installer must stop and produce a compatibility report instead of partially upgrading.

---

## 18. Security, Reliability, and Failure Handling

### 18.1 Security Principles

MVP security posture is local-first and conservative.

Rules:
- never trust external catalogs without signature verification,
- never mutate project behavior silently,
- never merge contradictory pack behavior automatically,
- never promote unreviewed procedural assets to official defaults,
- never treat cache as source of truth,
- and never continue through Class 1 or Class 2 drift.

### 18.1.1 Procedural Asset Trust Policy

Procedural assets fall into three trust classes:
- **official reviewed assets**: may be installed by default when pinned in the signed catalog,
- **wrapped upstream assets**: must retain provenance metadata for source, upstream version, wrapper version, and review status before they can ship,
- **project-local or unreviewed assets**: may exist for local experimentation, but must not become official defaults, silent upgrades, or global promotion candidates without explicit review and approval.

Any asset that can alter approvals, drift classification, scope control, merge guardrails, or safety policy is normative. Normative asset changes must follow explicit install or upgrade approval and must be represented in the version governor and distribution manifest.

### 18.2 Failure Philosophy

If CodeLatch cannot confidently preserve truth alignment, it must stop with:
- a clear verdict,
- concrete pointers,
- and the next required approval or doc update.

### 18.3 Auditability Rule

Every meaningful corrective or promotive action must leave either:
- queryable machine state in `.tmp/codelatch/index.db`,
- or a reviewable Markdown artifact when durable human rereading is useful.

Human-readable artifacts are required for incidents, active approved plans, unresolved pending-review merge material, saved proposals, actionable unresolved sync or audit outputs, and explicit cleanup reports. Resolved sync or audit reports persist only when the user explicitly keeps them. Routine success-state bookkeeping should remain plugin-owned.

---

## 19. Non-Functional Design Targets

### 19.1 Performance

The design targets interactive CLI usage, so MVP should:
- prefer metadata and references before file bodies,
- avoid broad repository scans as default,
- keep wrapper logic thin,
- and keep command startup overhead low.

### 19.2 Token Efficiency

The resolver should load:
- the truth-doc references needed for the current phase,
- only a small bounded set of packs,
- and cached snippets only when repeated use justifies them.

### 19.3 Reproducibility

Reproducibility comes from:
- version pinning,
- project-local runtime state under `.tmp/codelatch/`,
- logical truth-doc mapping,
- reviewable learning proposals rather than silent self-mutation,
- and reviewed global procedural asset distribution.

### 19.4 Reproducibility Contract

A run is reproducible only when CodeLatch can recover the full execution anchor set:
- truth-doc paths, versions, and hashes from `truth-doc-registry.json`,
- the approved plan artifact,
- approval record anchors,
- the active run contract,
- the resolved pack bundle manifest,
- the version governor state,
- adapter metadata plus distribution manifest state,
- workspace record state when isolation was used,
- and optional repo commit references such as `git_head` when available.

If any of those anchors are missing, CodeLatch may still continue interactively, but it must not claim full reproducibility for that run.

### 19.5 Verification Strategy

The MVP verification strategy must cover the framework contract, not just individual packages.

Minimum required suites:
- adapter conformance tests for each Tier-1 CLI,
- schema validation and migration tests for all persistent logical records,
- drift-classification fixtures that prove Class 0, 1, and 2 boundaries,
- merge-guardrail tests for overlap, shared-boundary, and conflict-resolution flows,
- reproducibility anchor tests that detect stale approval reuse,
- instruction-precedence resolution tests that prove root and host-local anchors stay deterministic across supported CLIs,
- adapter-detection and instruction-emission tests that prove each supported host gets its native instruction surface and that unnecessary compatibility mirrors are not generated by default,
- workflow-binding fallback tests that prove shared events still land on the correct checkpoint when rich host hooks are unavailable,
- injection-policy and injected-envelope tests that prove the resolved truth-doc refs, pack refs, incident refs, and snippet provenance remain reproducible,
- MVI budget and escalation tests that prove overflow turns into explicit fallback or stop behavior rather than silent prompt bloat,
- and install/upgrade verification tests for signed catalogs and distribution manifests.

Where practical, these should use golden fixtures or replayable scenarios so cross-CLI behavior can be compared against the same expected outcomes.

---

## 20. Open Risks and Technical Mitigations

### Risk 1: Adapter drift as host CLIs evolve
**Mitigation:** thin adapters, shared core, separate adapter packages, signed version-governed releases.

### Risk 2: Cross-CLI project state divergence
**Mitigation:** shared `.tmp/codelatch/` runtime root plus CLI-native discovery and distribution metadata only.

### Risk 3: Unreviewed upstream procedural assets changing behavior
**Mitigation:** hybrid vendor/wrap/rewrite policy, reviewed defaults only, version-governed asset catalogs.

### Risk 4: Pack explosion or noisy context
**Mitigation:** hard cap on loaded packs, references-before-snippets, semantic resolution only.

### Risk 5: Unsafe parallel merge-back
**Mitigation:** isolated workspaces, overlap detection, truth-doc drift gate, shared-boundary checks.

### Risk 6: Overwriting adopted repository conventions
**Mitigation:** truth-doc registry maps logical doc roles to actual file paths instead of forcing renames.

---

## 21. MVP Delivery Notes

### 21.1 What This Design Locks Now

This document locks the following MVP decisions:
- shared-core TypeScript monorepo,
- project-local runtime state under `.tmp/codelatch/`,
- steady-state maintenance rules for root repository docs and host-native thin instruction-anchor contracts,
- hybrid DB-backed indexes plus selective Markdown review artifacts,
- global installer/plugin distribution into supported CLIs by default,
- distributed reviewed skills, agents, instruction assets, and host-integration assets,
- canonical core workflow roles with adapter-native extra roles allowed,
- thin CLI-native adapters,
- adapter-specific command registration (file-based wrappers or plugin config hook, per host),
- explicit install selection that excludes unselected packs and bundles,
- schema-validated persistent state,
- approval anchoring by truth-doc hashes, scope hash, resolved pack bundle, and adapter/runtime state,
- approval history and run-contract persistence,
- concurrency-safe shared runtime state with serialized destructive operations,
- installer/bootstrap responsibility split,
- silent read-only scouting with surfaced findings only when meaningful,
- interactive brainstorming with one-question default and bounded batching,
- plan-driven strict TDD for code and behavior changes,
- signed catalog verification,
- the `12A` context authority contract with MVI-based injection,
- bounded semantic pack loading,
- dual pack-creation modes with the same validation contract,
- three-class drift model,
- explicit review/workspace/report schemas for pending-review and cleanup flows,
- and framework-level verification for parity, drift, and merge safety,
- and isolated parallel write strategy with guarded merge-back.

### 21.2 What Stays Flexible

The following may evolve without changing the core architecture:
- exact wrapper syntax inside each CLI (or plugin config hook registration syntax for OpenCode),
- exact optional project-local install mode behavior per adapter,
- default add-on profile composition,
- optional extra pack metadata fields,
- and future richer routing heuristics.

---

## 22. PRD Open Items Resolution

This technical design resolves the PRD open items and newly locked workflow decisions as follows:

1. **exact adapter package architecture** → defined in Sections 6 and 8.
2. **exact folder layouts per supported CLI** → defined in Sections 7 and 8.
3. **exact command registration per CLI** → file-based wrappers defined in Section 9, OpenCode plugin config hook defined in Section 9.1.1.
4. **exact persistent file formats and schemas** → defined in Section 10.
5. **exact proposal/review folder layouts** → defined in Sections 10 and 16.
6. **exact upgrade/catalog verification mechanism** → defined in Section 17.
7. **exact install and sync pipelines** → defined in Sections 13, 14, and 17.
8. **exact conflict resolution mechanics between packs** → defined in Section 11.
9. **exact pack discovery logic per CLI** → defined in Sections 8 and 11.
10. **exact merge/review safety checks** → defined in Section 15.
11. **exact procedural asset distribution model** → defined in Sections 8 and 17.
12. **exact approval history and run-contract schemas** → defined in Sections 10 and 13.
13. **exact installer vs bootstrap responsibility split** → defined in Sections 14 and 17.
14. **exact `.tmp/codelatch/` runtime layout and cleanup safety rules** → defined in Sections 7, 10, and 14.

---

## 23. Technical Design Summary

CodeLatch MVP is designed as a shared-core, adapter-thin, local-first framework.

Its technical shape is:
- one shared framework core,
- one project-local runtime state root under `.tmp/codelatch/`,
- one global plugin distribution layer per supported CLI by default,
- distributed reviewed procedural assets rendered into native CLI locations,
- thin native adapters per supported CLI,
- logical truth-doc mapping for adopted repositories,
- approval and run contracts anchored to truth-doc hashes, pack bundle state, and adapter/runtime state,
- plan-driven strict TDD for behavioral execution,
- semantic pack resolution with bounded loading,
- persistent incident and proposal state,
- concurrency-safe shared runtime state with explicit pending-review and merge artifacts,
- explicit signed upgrade control,
- framework-level verification for cross-CLI parity and drift/merge guardrails,
- and isolated parallel execution with strict merge guardrails.

This design preserves the PRD’s core promise: keep AI coding fast and CLI-native, while making execution more reproducible, auditable, and aligned to approved project truth.
