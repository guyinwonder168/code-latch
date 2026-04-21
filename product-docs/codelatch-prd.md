# CodeLatch Product Requirements Document (PRD)

- **Document Version:** 0.2.11
- **Document Status:** Draft
- **Product Name:** CodeLatch
- **Document Owner:** guyinwonder168
- **Last Updated:** 2026-04-21
- **Source of Truth Location:** `product-docs/codelatch-prd.md`

---

## Changelog

### v0.2.11 - 2026-04-21
- Section 11.3: Added OpenCode global config directory `~/.config/opencode/` as default install target; clarified `.opencode/` is project-level opt-in only; clarified OpenCode uses programmatic command registration via plugin `config` hook and `opencode.json` `command` key; noted `.opencode/commands/` remains valid for other plugins.
- Section 12.4.1: Added `.opencode/instructions.md` and `~/.config/opencode/instructions.md` as OpenCode instruction surfaces.
- Section 12.5: Clarified `.opencode/codelatch/...` is project-level opt-in; added `~/.config/opencode/` as global install path for OpenCode.

### v0.2.10 - 2026-04-20
- Removed lingering wording drift that could imply a build sequence different from the implementation plan.
- Replaced remaining active "plugin layer" phrasing with host-native integration wording where the product intent is broader than packaged plugins.
- Aligned MVP acceptance and command-distribution wording with the host-native integration model.

### v0.2.9 - 2026-04-20
- Reconciled the PRD with the implementation plan and current host documentation for Kilo Code and Codex.
- Clarified that CodeLatch is distributed through host-native plugin/config integration layers rather than one uniform external plugin package shape.
- Clarified that Kilo Code remains a separate adapter target while reusing documented OpenCode-compatible config/runtime surfaces where verified.
- Clarified that MVP does not assume a dedicated Kilo packaged-plugin manifest equivalent to Claude Code or Codex.
- Clarified that Codex hooks are separate experimental extensibility, not a baseline dependency of the Codex adapter.

### v0.2.8 - 2026-04-19
- Clarified that repositories may intentionally emit multiple host-native instruction anchors when multiple adapters are enabled, and updated root-file wording accordingly.
- Extended the command model so `codelatch-bootstrap` selects and persists enabled-adapter / instruction-surface policy before emitting anchors.
- Clarified that `codelatch-sync` validates actual instruction anchors against the enabled adapter set and explicit compatibility-mirror policy.

### v0.2.7 - 2026-04-18
- Clarified that instruction-anchor creation is adapter-detected and host-native by default rather than creating every possible anchor in every repository.
- Defined the default native instruction mapping: `CLAUDE.md` for Claude Code and `AGENTS.md` for Codex, OpenCode, and Kilo Code.
- Limited compatibility mirrors to explicit multi-host, migration, or user-policy cases.

### v0.2.6 - 2026-04-18
- Clarified that thin root instruction anchors include both `AGENTS.md` and `CLAUDE.md`, with host-local mirrors staying aligned rather than becoming competing sources of truth.
- Generalized the product-level instruction anchor model so adopted repositories are not forced into an `AGENTS.md`-only framing.
- Fixed the MVP acceptance criteria so new repositories use canonical truth-doc defaults while adopted repositories may map the same logical trio through the truth-doc registry.

### v0.2.5 - 2026-04-17
- Aligned the PRD terminology with the current adapter model: skills, workflow roles, instruction assets, host-integration assets, and packs.
- Added the product-level context authority and MVI rules so installed availability, runtime selection, and injected model context are explicitly distinguished.
- Clarified Kilo Code as a first-class adapter target and refreshed stale acceptance/open-items language to match the current technical design.

### v0.2.4 - 2026-04-03
- Clarified where reproducibility snapshots of selected global packs are materialized inside project runtime state.
- Defined the readable incident artifact path and its durable retention behavior.
- Defined cleanup report location and clarified that old cleanup reports are removed only through later explicit cleanup.

### v0.2.3 - 2026-04-03
- Clarified that truth docs are logical roles first, with canonical default filenames for new repositories and registry-based path mapping for adopted repositories.
- Defined lifecycle retention terms and distinguished lifecycle auto-deletion from explicit user-invoked cleanup.

### v0.2.2 - 2026-04-03
- Locked lifecycle for actionable sync and audit Markdown: auto-delete by default once resolved unless the user explicitly keeps it.

### v0.2.1 - 2026-04-03
- Reworked runtime-state storage into a hybrid model: plugin-managed index/state for high-churn bookkeeping plus selective Markdown artifacts for durable human review.
- Locked retention rules to avoid proposal, plan, audit, sync, and run-summary file spam.
- Clarified that routine operational bookkeeping should stay on the plugin side and only semantic decisions or review-worthy summaries should involve the model.

### v0.2.0 - 2026-04-03
- Clarified that CodeLatch is distributed as a plugin layer across supported CLIs.
- Split installer/plugin distribution from `codelatch-bootstrap` project scaffolding responsibilities.
- Locked project-local runtime memory under `.tmp/codelatch/` while CLI-native roots remain for discovery, wiring, and native-facing assets.
- Locked the plan-driven approval flow and strict TDD execution contract for code and behavior changes.
- Added procedural asset governance for distributed skills, agents, and workflow roles, including reviewed defaults and canonical core roles.
- Clarified that installer/plugin distribution is global per user by default for each supported CLI, with optional project-local add-on installation when needed.

### v0.1.0 - 2026-04-03
- Initial PRD draft created from product brainstorming.
- Locked the product direction for CodeLatch as a context-and-control framework for AI coding CLIs.
- Defined MVP scope, command set, context model, pack model, learning model, approval model, and adapter strategy.

---

## 1. Executive Summary

CodeLatch is a cross-CLI context-and-control framework for AI coding workflows.

Its purpose is to make AI coding in terminal-native tools more reliable, reproducible, and production-friendly without killing the speed and feel of vibe coding. CodeLatch combines structured brainstorming, controlled execution, project truth documents, strict drift handling, sparse but meaningful approvals, and pack-based context management into a unified framework that works across multiple AI coding CLIs.

CodeLatch is not just a prompt pack, not just a plugin, and not just a documentation method. It is a framework layer that is distributed through host-native plugin and configuration integration surfaces across supported AI coding CLIs and coordinates:

- project truth documents,
- context and capability packs,
- workflow rules,
- distributed procedural assets,
- drift detection,
- TDD-oriented execution,
- delegated subtask execution and safe parallel work,
- project learning from recurring mistakes,
- and CLI-native command surfaces.

The first release of CodeLatch will include Tier-1 support for:
- OpenCode
- Claude Code
- Codex
- Kilo Code

Implementation sequencing and delivery order are defined by the technical design and implementation plan rather than by the list order above.

CodeLatch is designed to preserve the speed benefits of AI coding while preventing uncontrolled drift between code, plans, design, and product intent.

---

## 2. Problem Statement

Current AI coding workflows often break down in one or more of these ways:

1. **Context is too heavy or too noisy.**  
   Frameworks can become slow, token-expensive, and hard to follow when too much context is loaded all the time.

2. **Execution drifts away from intent.**  
   Code changes can slowly move away from product requirements, technical design, and implementation plan without being noticed early enough.

3. **Workflow discipline is inconsistent.**  
   Brainstorming, planning, test-first thinking, review, and approval are often partially applied or skipped depending on model behavior.

4. **Agent behavior is not reproducible enough.**  
   The same request in a later iteration can produce a different result because rules, context, or task boundaries are not stable enough.

5. **Approvals become annoying.**  
   Some frameworks over-ask for approval, which kills the speed and flow that makes AI coding useful in the first place.

6. **Project-specific learning is not captured well.**  
   The same recurring mistakes can happen in different sessions because the framework has no reliable project-level memory of repeated incidents.

7. **Cross-CLI portability is weak.**  
   Teams increasingly use multiple AI coding CLIs. A framework that only feels native in one CLI becomes harder to adopt across real teams.

CodeLatch exists to solve these problems by introducing a controlled, pack-based, CLI-native framework model that keeps project truth, execution, and learning aligned.

---

## 3. Product Vision

CodeLatch should become the framework layer that lets teams use AI coding CLIs with:

- the speed of vibe coding,
- the discipline of structured engineering,
- the alignment of source-of-truth documentation,
- and the stability of controlled, reviewable execution.

CodeLatch should feel native inside each supported CLI while keeping the core product behavior consistent.

---

## 4. Product Principles

CodeLatch is built on the following principles:

1. **Brainstorm before execution.**
2. **The 3 project truth docs lead code.**
3. **Drift must be surfaced early, not discovered late.**
4. **Approvals should be sparse, meaningful, and high value.**
5. **Context must stay small, focused, and lazy-loaded.**
6. **The framework should be strict on truth, light on routine execution.**
7. **The framework may learn, but must not silently mutate itself.**
8. **Project-specific behavior must stay project-local unless explicitly promoted.**
9. **Skills handle procedures; packs handle knowledge and context.**
10. **CLI-native integration matters.**
11. **The same request should be more reproducible over time, not less.**
12. **Newcomers must be able to understand the framework without learning a giant internal system.**
13. **Distributed procedural assets must stay controllable, reviewable, and aligned to the CodeLatch product flow.**

---

## 5. Goals

### 5.1 Primary Goals

CodeLatch must:

- provide a structured AI coding workflow that starts with brainstorming,
- keep code aligned with product requirements, technical design, and implementation plan,
- support strict drift handling and re-brainstorming when needed,
- support sparse but meaningful approval points,
- support pack-based context and capability management,
- keep active context efficient and small,
- work across multiple AI coding CLIs,
- support delegated subtask execution and safe parallelism,
- maintain project-level recurring incident learning,
- and remain usable for both advanced users and newcomers.

### 5.2 MVP Goals

For MVP, CodeLatch must support:

- Tier-1 adapters for:
  - OpenCode
  - Claude Code
  - Codex
  - Kilo Code
- canonical project truth docs under `product-docs/` for new repositories, or equivalent mapped truth docs in adopted repositories
- host-native thin instruction anchors such as `AGENTS.md` or `CLAUDE.md`, depending on enabled adapters
- branded command set
- install-time profile and pack selection
- project-specific custom pack creation
- drift detection and controlled re-brainstorm flow
- incident tracking and project learning review flow
- global promotion suggestion flow
- CLI-native command wrappers with shared framework behavior (or plugin config hook registration for hosts that support programmatic commands)

---

## 6. Non-Goals

CodeLatch MVP will not try to:

- replace the underlying CLI itself,
- become a general-purpose project management platform,
- fully automate product decisions without user approval,
- auto-promote project lessons to global packs without approval,
- maintain one giant always-loaded context system,
- support every AI coding CLI in the first release,
- or infer all project-local rules automatically without user confirmation.

CodeLatch also will not treat generated runtime state as source of truth. Source of truth remains in project documents and approved framework context.

---

## 7. Target Users

### 7.1 Primary User
A technical lead, software manager, or senior developer who uses AI coding CLIs heavily and wants more control, reproducibility, and alignment without losing workflow speed.

### 7.2 Secondary Users
- Engineers working within a team framework
- Power users who want CLI-native structured automation
- Teams that mix multiple coding CLIs
- Projects that require design discipline, scoped execution, and learning from repeated AI mistakes

### 7.3 Anti-Persona
Users looking for a pure hands-off autonomous coding agent with no planning, no approvals, and no source-of-truth discipline.

---

## 8. Source of Truth Model

CodeLatch uses three canonical logical truth-doc roles:

- `prd`
- `technical_design`
- `implementation_plan`

For newly bootstrapped repositories, those roles should default to these filenames:

- `product-docs/prd.md`
- `product-docs/technical-design.md`
- `product-docs/implementation-plan.md`

Adopted repositories may map the same logical roles to different paths through the truth-doc registry. In this repository, the logical `prd` role currently maps to `product-docs/codelatch-prd.md`.

These three logical truth docs are the project truth set.

### 8.1 Responsibilities of the 3 Truth Docs

#### `prd` truth doc (canonically `product-docs/prd.md`)
Defines:
- product intent
- scope
- goals
- requirements
- business/user-facing behavior
- major constraints
- success criteria

#### `technical_design` truth doc (canonically `product-docs/technical-design.md`)
Defines:
- architecture
- technical approach
- stack choices
- system boundaries
- integration design
- module relationships
- technical constraints

#### `implementation_plan` truth doc (canonically `product-docs/implementation-plan.md`)
Defines:
- execution plan
- tasks
- sequence
- dependency handling
- delivery plan
- work breakdown for actual implementation

### 8.2 Truth Hierarchy

- The three truth docs are the canonical project truth.
- Code must follow them.
- If code work may shift behavior, design, scope, or plan away from them, CodeLatch must stop and trigger re-brainstorming and document synchronization before continuing.

### 8.3 Root Project Files

At project initialization, CodeLatch must also support or maintain:

- `README.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- the host-native thin instruction anchor or anchors required by enabled adapters, such as `AGENTS.md` and/or `CLAUDE.md`

These are project-facing repository documents, but they are not part of the truth-doc trio.

---

## 9. Thin Instruction Anchor Model

CodeLatch uses thin root instruction anchors, but it must emit them adapter-natively rather than assuming every repository needs every anchor.

### 9.1 Purpose
Thin instruction anchors exist to:
- tell the model that the project uses CodeLatch,
- point to the truth docs,
- point to local project context,
- and provide a very small amount of critical repo-facing guidance.

### 9.2 What Thin Instruction Anchors Must Not Become
Thin instruction anchors must not become:
- a second copy of the framework engine,
- a full pack registry,
- a machine lockfile,
- a full workflow manual,
- or a dumping ground for all project rules.

### 9.3 Practical Shape
Thin root instruction anchors should remain thin and contain only:
- framework identity
- truth-doc locations
- local context location
- a very small set of non-negotiable reminders

By default, CodeLatch should create only the instruction anchor required by the enabled adapter set:
- **Claude Code** → `CLAUDE.md`
- **Codex** → `AGENTS.md`
- **OpenCode** → `AGENTS.md`
- **Kilo Code** → `AGENTS.md`

Host-local mirrors or compatibility files such as `.claude/CLAUDE.md` may exist when multi-host support, migration compatibility, or explicit user policy requires them, but they must stay semantically aligned on truth-doc pointers, stop conditions, and non-negotiable reminders.

---

## 10. Context and Capability Pack Model

### 10.1 Pack Purpose
Packs are the framework’s reusable context and capability units.

Packs may represent:
- language knowledge
- framework knowledge
- project patterns
- project-specific context
- local behavior deltas
- domain knowledge
- policy/context specializations

### 10.2 Procedural Assets vs Packs

**Skills** define procedures, such as:
- brainstorming
- TDD
- drift scan
- doc sync
- code review
- merge flow
- learning review

**Agents and workflow roles** define controllable execution responsibilities, such as:
- brainstorming support
- truth-doc sync
- exact planning
- scoped execution
- test execution
- review
- merge safety review

**Instruction assets** define thin host-native instruction anchors and adapter-facing instruction files, such as:
- `AGENTS.md`
- `CLAUDE.md`
- host-local instruction mirrors such as `.claude/CLAUDE.md`
- adapter-rendered instruction snippets or templates tied to supported hosts

**Host-integration assets** define host-native wrapper, config, plugin, manifest, hook, and event-binding surfaces, such as:
- command wrappers (file-based or plugin-registered, per host)
- plugin manifests
- hook or event registration files
- host config entries
- MCP or marketplace wiring when a host requires it

**Packs** define knowledge and context, such as:
- Go best practices
- Angular UI patterns
- project-specific payment rules
- local design constraints
- domain knowledge

CodeLatch distributes reviewed procedural, instruction, and host-integration assets only into each host CLI's documented native surfaces, but those assets must still execute through each host CLI's own mechanics.

### 10.3 Pack Shape
Pack structure is the same for both global and project packs.

Default structure:
- one pack = one folder
- one mandatory `index.md`
- optional extra files only if justified

### 10.4 Pack Content Style
`index.md` uses frontmatter and keeps the main content together:
- patterns
- short examples
- references
- notes

Separate category files are not required by default.

### 10.5 Pack Frontmatter
Minimum frontmatter fields for `index.md`:

```yaml
name:
purpose:
applies_to:
priority:
extends:
tags: []
```

### 10.6 applies_to
`applies_to` is a semantic scope label, not a filesystem path matcher.

Examples:
- `project`
- `payments`
- `auth`
- `frontend`
- `reporting`
- `docs`

For MVP, CodeLatch does not require mandatory path mapping from `applies_to` to source code folders. Pack selection is driven by scoped workflow reasoning and task scope.

### 10.7 Global vs Project Packs
CodeLatch uses the same pack structure for:
- global packs
- project packs

The difference is scope and location, not schema.

When reproducibility requires freezing selected global pack content for a project run, CodeLatch may materialize version-pinned snapshots under `.tmp/codelatch/packs/cache/resolved-bundles/`. That snapshot cache is runtime state, not author-owned project pack content.

### 10.8 Overlap Rule
When project context overlaps with global context:
- default behavior is reference + small delta
- full override requires brainstorming + approval
- duplication should be detected and discouraged

---

## 11. Installation and Distribution Model

### 11.1 Distribution Strategy
CodeLatch will be distributed through a monorepo with many published packages.

It is not a single monolithic package.

### 11.2 Package Categories
CodeLatch packaging will include:
- shared core package
- CLI adapter packages
- profile packages
- pack/capability packages
- reviewed procedural asset bundles for skills and workflow roles
- reviewed instruction and host-integration asset bundles

### 11.3 Installation Strategy
CodeLatch is distributed as a host-native integration layer for each supported CLI.

The installer-managed host integration distribution is global per user by default for each supported CLI, while project repositories keep project-local truth docs, wiring, and runtime memory.

For **OpenCode**, the global config directory `~/.config/opencode/` is the default install target. Project-level `.opencode/` configuration is opt-in only, used when a team explicitly requests project-level customization.

For all other hosts, global installation remains the default distribution mode.

If a team needs project-local installation for special cases, adapters may support that as an explicit opt-in path.

Installation is adapter-native per CLI, but package source remains shared.

Host realization differs by adapter:
- **Claude Code** and **Codex** use dedicated packaged-plugin distribution surfaces.
- **OpenCode** uses runtime plugin-module and configuration surfaces, with `~/.config/opencode/` as the global default and `.opencode/` as project-level opt-in. Commands are registered programmatically via the plugin `config` hook using the `opencode.json` `command` key rather than file-based `.md` wrappers; `.opencode/commands/` remains a valid OpenCode surface for other plugins.
- **Kilo Code** is treated as a separate adapter target, but MVP reuses documented OpenCode-compatible config/runtime surfaces where verified and layers Kilo-native surfaces on top where needed.

Installation targets only documented host-native discovery and integration surfaces. CodeLatch does not assume a universal cross-CLI folder layout for instructions, workflow roles, plugins, or hooks.

For **Codex**, hooks are a separate experimental extensibility mechanism and are not part of the baseline installation contract for the Codex adapter.

The framework may also provide a shared helper installer where it does not fight the host CLI.

### 11.4 Selection Model
At install/setup time:
- the required core procedural bundle is installed,
- the user chooses a profile bundle
- then chooses stack bundles where relevant
- optionally customizes bundle composition
- only selected packs are installed
- unselected packs are not installed, even globally

### 11.5 Profiles
Profiles are selected by purpose, such as:
- coding development
- marketing campaign
- and future profiles

### 11.6 Coding Development Profile
For coding development:
- user chooses stack/language bundles
- preset stack bundles exist for simplicity
- advanced users may customize them further

### 11.7 Stack Bundle Model
Each stack bundle uses a layered preset:
- core stack pack(s)
- optional add-ons
- default engineering add-ons may include:
  - code review
  - linting
  - build
  - security
  - QA
  - CI/CD / DevOps

### 11.8 Procedural Asset Governance
CodeLatch may vendor, wrap, or rewrite external skills, workflow roles, instruction assets, or host-integration assets when useful.

Patterns from systems such as Superpowers, OpenAgentsControl, or supported CLI ecosystems may be studied and reused, but only CodeLatch-reviewed assets may become official defaults.

### 11.9 Role Model
CodeLatch defines canonical core workflow roles for the product flow.

Adapters may add CLI-native extra roles, but the core flow roles must remain behaviorally consistent across supported CLIs.

### 11.10 Source Model
The source model is layered:
- CodeLatch owns canonical workflow and role contracts,
- adapters own native mappings and templates per CLI,
- and upstream procedural assets may be wrapped or rewritten into that system.

---

## 12. CLI Support Model

### 12.1 Tier-1 Support
MVP Tier-1 support:
- OpenCode
- Claude Code
- Codex
- Kilo Code

### 12.2 Native Integration Rule
CodeLatch must feel native in each supported CLI.

### 12.3 Shared vs Native
- behavior remains framework-shared
- commands are exposed through adapter-native surfaces (file-based wrappers or plugin config hook registration, per host)
- command wrappers remain thin (or are replaced by programmatic registration where the host supports it)
- logic lives in the framework core

### 12.4 CLI-Native Discovery
Items that a CLI must discover natively, such as:
- skills
- commands/workflows
- agents/workflow roles
must live where that CLI expects them.

### 12.4.1 Native Instruction Surface Detection
CodeLatch must determine the target host from the enabled adapter or install target and emit the native instruction surface for that host by default.

Default mapping:
- **Claude Code** → `CLAUDE.md` (and `.claude/CLAUDE.md` when the adapter uses the host-local form)
- **Codex** → `AGENTS.md`
- **OpenCode** → `AGENTS.md` (plus `.opencode/instructions.md` as an additional project-level instruction surface, and `~/.config/opencode/instructions.md` as a global instruction surface)
- **Kilo Code** → `AGENTS.md` plus documented OpenCode-compatible config/runtime surfaces and Kilo-native additions where needed

CodeLatch must not create non-native instruction anchors by default only for symmetry. If multiple hosts are intentionally enabled in one repository, CodeLatch may create multiple host-native anchors, but they must stay semantically aligned.

### 12.5 Framework Namespace
Framework-owned discovery and wiring files for a project can live under CLI-native project roots such as:
- `.opencode/codelatch/...` (project-level opt-in only; default install target is `~/.config/opencode/`)
- `.claude/codelatch/...`
- `.codex/codelatch/...`
- `.kilo/codelatch/...`

The global install path for OpenCode is `~/.config/opencode/`, which is the default location for CodeLatch adapter metadata and plugin wiring when project-level customization is not requested.

These CLI-native roots are for discovery, wiring, thin adapter metadata, and native-facing asset pointers. They are not the canonical storage for project memory.

### 12.6 Project Runtime Memory
Project-local runtime memory and review artifacts live under `.tmp/codelatch/...`.

CodeLatch must use a hybrid storage model inside that runtime root:
- plugin-managed index/state for high-churn operational bookkeeping,
- human-readable Markdown only for durable or currently reviewable records,
- and lazy materialization for reports or summaries that a user may need to inspect.

This includes items such as:
- incidents and their review records,
- approval history metadata,
- active run and workspace state,
- active approved plans,
- sync and audit metadata,
- proposal metadata and saved review material,
- and isolated workspaces.

The plugin should own routine bookkeeping, indexing, and retention so that operational state churn does not have to pass through the model on every command. The model should mainly be used for semantic decisions, approval framing, drift reasoning, and user-facing summaries.

User-invoked cleanup of runtime artifacts must remain explicit and confirmed. That rule applies to commands such as `codelatch-clean`; it does not block lifecycle-driven auto-deletion when an artifact reaches the end of its documented retention window.

### 12.6.1 Human-Readable Artifact Retention
To avoid artifact spam, CodeLatch must persist readable Markdown only when it has durable review value.

Default rules:
- proposals are not written to files by default,
- approved plans remain readable while active or pending review, then auto-delete after merge or close unless the user explicitly keeps them,
- audit reports are written only when there are actionable findings, risks, or failures,
- sync reports are written only when drift, conflict, or a manual decision must be reviewed,
- resolved audit or sync reports auto-delete by default unless the user explicitly keeps them,
- cleanup reports are written only for explicit `codelatch-clean` runs and remain reviewable until a later explicit cleanup removes them,
- run summaries are rendered on demand rather than persisted by default,
- and pending-review merge summaries exist only while unresolved.

Lifecycle terms used by these rules:
- **active**: the artifact still governs or informs ongoing work,
- **pending review**: the artifact supports an unresolved approval, merge, or manual decision,
- **resolved**: the underlying sync, audit, or review issue no longer needs rereading because a fix was applied or a decision was recorded,
- **closed**: a terminal outcome was reached by merge, discard, or explicit user close,
- and **kept**: the user explicitly overrides the default auto-delete rule for that artifact.

### 12.6.2 Approval Storage Rule
Approval history should be retained as metadata in plugin-managed runtime state rather than as standalone approval documents.

When a related readable artifact already exists, such as an active approved plan, an incident review doc, or a pending-review merge summary, important approval notes may be appended there for human review.

### 12.7 Kilo Code Rule
Kilo Code is a first-class Tier-1 adapter target.

It may share some instruction and configuration concepts with other hosts, but CodeLatch still treats Kilo Code as having its own native discovery roots, config handling, and adapter contract rather than reducing it to an OpenCode alias.

For MVP, CodeLatch should reuse documented OpenCode-compatible config and runtime surfaces where verified, but that reuse happens inside a dedicated Kilo adapter boundary rather than through a shared external plugin format.

Unless Kilo documentation later defines a dedicated packaged-plugin manifest, CodeLatch must not assume one equivalent to Claude Code's `.claude-plugin/plugin.json` or Codex's `.codex-plugin/plugin.json`.

### 12.8 Codex Hook Rule
Codex is a first-class Tier-1 adapter target, but Codex hooks are separate from Codex plugin packaging.

For MVP:
- core Codex support must work through documented instruction, plugin, marketplace, config, and cache surfaces,
- hook-based lifecycle interception is optional and additive only when explicitly enabled,
- and the Codex adapter must not depend on hooks being available in order to provide baseline framework behavior.

---

## 13. Command Model

### 13.1 Command Surface
CodeLatch commands must be adapter-native per CLI.

### 13.2 Shared Semantics
Command semantics remain shared in the framework.

### 13.3 MVP Branded Commands
MVP command set:

- `codelatch-bootstrap`
- `codelatch-sync`
- `codelatch-pack-create`
- `codelatch-learn`
- `codelatch-clean`
- `codelatch-audit`
- `codelatch-promote`

Final CLI-specific invocation style may vary by adapter, but the branded semantics remain consistent.

Installer-managed host integration distribution is separate from this branded project command set.

The installer lays down the global CLI integration layer, while the branded commands operate inside a specific repository.

### 13.4 Command Responsibilities

#### `codelatch-bootstrap`
- project interview/setup
- detect existing docs
- allow migration/reuse/start fresh
- confirm the enabled adapter set for the repository and whether it is intentionally single-host or multi-host
- decide the native instruction surface(s) and any explicit compatibility mirrors required by that adapter policy
- persist the adapter-selection and instruction-surface policy so later sync/audit flows can validate it
- create or adopt the truth-doc registry so logical truth-doc roles resolve to the repository's actual file paths before later sync and execution flows depend on them
- initialize truth docs and supporting root files
- initialize project-local wiring and runtime folders needed by the repository

#### `codelatch-sync`
- re-scan repo and truth docs
- load the truth-doc registry so adopted-repository mappings, not assumed canonical filenames, define the active truth-doc locations
- detect drift
- validate actual instruction anchors against the enabled adapter set and any explicit compatibility-mirror policy
- show detected updates
- show proposed changes
- write readable sync output only when drift, conflict, or a manual decision requires review
- auto-delete resolved sync reports by default unless the user explicitly keeps them
- require approval before applying low-risk updates
- trigger brainstorming when meaning-level drift exists

#### `codelatch-pack-create`
- create project or domain pack
- scope first, then purpose
- default to interview-guided
- allow bare template for advanced users

#### `codelatch-learn`
- scan persistent project incidents
- determine worthy candidates
- produce review summary + draft proposal metadata
- materialize a readable proposal doc only if the user saves it or it becomes pending-review material
- decide whether to patch an existing pack or propose a new pack
- trigger brainstorming if ambiguous

#### `codelatch-clean`
- clean `.tmp/codelatch/...`
- delete only done + superseded + reconstructible artifacts
- write a readable cleanup report under `.tmp/codelatch/cleanup/`
- remove older cleanup reports only through the same explicit approval flow

#### `codelatch-audit`
- detect contradictions
- detect duplication
- inspect pack conflicts
- write readable audit output only for actionable findings, risks, or failures
- auto-delete resolved audit reports by default unless the user explicitly keeps them
- surface drift and risk conditions

#### `codelatch-promote`
- review reusable approved project lessons
- compare against existing global packs and promoted lessons
- suggest global promotion candidates
- require approval for promotion

---

## 14. Workflow Model

### 14.1 High-Level Flow
Default controlled flow:

1. brainstorm
2. approval on direction
3. refresh/check the 3 truth docs
4. approval on updated docs
5. generate or update execution plan from implementation plan
6. approval on exact planned work
7. free-run inside approved scope
8. stop only on drift, conflict, missing dependency, destructive action, or scope expansion

### 14.2 Brainstorming
CodeLatch must support adaptive brainstorming:
- default is one question at a time
- small related batches are allowed when appropriate

### 14.3 Drift Handling
If code or planned work may shift away from:
- PRD
- technical design
- implementation plan

then CodeLatch must:
- stop
- trigger brainstorming
- sync the 3 truth docs
- re-approve
- then continue

### 14.4 Approval Philosophy
Approvals must be sparse and meaningful.

CodeLatch must avoid approval fatigue.

Meaningful approval points include:
- brainstorm direction approval
- updated truth-doc approval
- exact execution plan approval
- scope expansion approval
- promotion approval
- risky/destructive actions

### 14.5 Free-Run Inside Approved Scope
Once the exact plan is approved:
- CodeLatch should run freely inside the approved scope
- it should not keep asking for routine confirmation
- it should stop only when one of the defined stop conditions is hit

### 14.6 TDD Rule Inside Free-Run
For code or behavior changes, free-run execution must use strict TDD:
- RED
- verify RED
- GREEN
- verify GREEN
- REFACTOR
- re-verify

Docs-only, metadata-only, wrapper-text-only, cleanup-only, and similar non-behavioral work do not require TDD.

Mixed work must be split so behavioral code changes stay under the TDD contract.

### 14.7 Approval Memory
CodeLatch must retain project-local approval history so the framework can determine:
- what was approved,
- against which truth-doc state,
- for which scope,
- and when execution must stop versus continue.

---

## 15. Execution Planning Model

### 15.1 Source of Truth
`product-docs/implementation-plan.md` is the source of truth for execution planning.

CLI todo systems are execution views, not the canonical source.

### 15.2 Scope Rule
Requested scope is hard-locked by default.

### 15.3 Dependency Exception Rule
Extra work outside requested scope is allowed only as dependency-support work if it is strictly required for the approved change.

If a dependency was missing from the approved plan:
- that is a planning failure
- CodeLatch must hard-stop
- re-brainstorm
- update the truth docs
- re-approve
- then continue

### 15.4 Execution Plan Detail
- normal work uses a detailed plan
- large or risky work escalates to a fuller production contract

For code or behavior work, the exact approved plan must include a TDD contract per task, including:
- behavior target,
- test target,
- red check command,
- expected failing condition,
- green check command,
- refactor allowance,
- and final verification command.

### 15.5 Parallelism
Parallel work is allowed only with strict guardrails.

Parallelization is safe only when tasks are proven independent.

Implementation subtasks must write in isolation first, not directly into the shared workspace.

---

## 16. Subtask and Parallel Work Model

### 16.1 Delegation Model
CodeLatch supports delegated subtasks and workflow-role execution across supported CLIs.

### 16.2 Assignment Contract
Subtasks must receive a scoped contract packet, including:
- goal
- exact scope boundaries
- allowed actions/tools
- required context references
- expected result contract
- stop conditions
- must-not-do exclusions

### 16.3 Parallel Scout Lanes
Default scout pattern:
- always spawn core lanes:
  - docs
  - code
- optionally add:
  - context/policy
  - tests
  - history
  - external

### 16.4 Subtask Return Format
Internal subtask return format is minimal JSON.

Required fields:

```json
{
  "kind": "",
  "scope": "",
  "verdict": "",
  "summary": [],
  "pointers": []
}
```

User-facing summaries are generated only when needed.

### 16.5 Parallel Write Strategy
Parallel implementation writes must happen in isolation, such as:
- isolated patch
- worktree
- temp branch equivalent

Merge-back is never silent.

When an isolated parallel flow is fully done, CodeLatch must:
- show a short merge summary,
- ask the user for approval,
- and only then merge the worktree or isolated branch back to the parent.

The default short merge summary must include:
- changed files,
- a high-level summary,
- and risk flags.

### 16.6 Merge Guardrails
If merge-back has conflicts:
- CodeLatch must stop,
- show the user the proposed conflict fix,
- require approval before applying that fix,
- and only then complete the merge-back.

If merge-back has no conflict:
- CodeLatch must still show the short merge summary,
- require approval,
- and only then merge.

If the user rejects merge-back:
- CodeLatch must keep the isolated workspace or worktree intact,
- mark it as `pending-review`,
- and must not auto-discard or auto-convert that isolated work.

Pending-review state must be indexed at:
- `.tmp/codelatch/review-index.json`

Lifecycle rule:
- create `review-index.json` only when at least one pending review exists,
- and if no pending reviews remain, `review-index.json` must not exist.

The default pre-prompt pending-review reminder must show:
- count,
- workspace or review IDs,
- and risk flags.

Behavior/architecture/shared-module/doc-drift issues must still stop and surface for user attention.

---

## 17. Context Loading Model

### 17.1 Design Goal
Context loading must be:
- fast
- token-efficient
- file-efficient
- model-efficient
- selective

### 17.2 Loading Philosophy
CodeLatch must avoid broad discovery-first loading as a default behavior.

It must prefer:
- focused project truth docs when planning/syncing
- relevant packs only
- lazy loading
- few files at a time
- semantic task-based pack selection
- and plugin-side operational bookkeeping unless a semantic decision or readable summary is needed

### 17.3 Scouting
Read-only internal scouting should not require approval spam.

Scouting should be silent for safe internal reads and only surface when findings matter.

### 17.4 Caching
Caching uses:
- file efficiency
- token efficiency
- two-layer model
- Markdown as canonical source

Resolved task bundles should prefer references first and only cache snippets for hot/repeated tasks or approved scopes where helpful.

### 17.5 Context Authority
CodeLatch distinguishes between four related but non-interchangeable context layers:
- authoring source context,
- installed discoverable context,
- runtime-resolved context,
- and injected model context.

Authority order for behavior is:
1. approved truth docs,
2. approved execution-plan and run-contract state,
3. approved runtime-resolved context bundles,
4. installed host-discoverable assets,
5. source templates used for packaging or installation.

Installed copies are derived artifacts, not co-equal truth sources.

### 17.6 Runtime Injection and MVI
Installed availability does not mean active prompt inclusion.

For each command phase, CodeLatch should:
1. determine command, phase, scope, and approval state,
2. resolve the relevant truth docs and runtime anchors,
3. select only the packs and incidents justified by scope,
4. build a runtime bundle,
5. inject only the minimum viable information required for the current step.

**MVI (Minimum Viable Information)** means loading the minimum sufficient information required for correct, safe, reproducible behavior at that moment.

Operationally, the model is: **install many, select few, inject minimal**.

---

## 18. Learning Model

### 18.1 Learning Philosophy
CodeLatch must learn from recurring mistakes without silently mutating active behavior.

### 18.2 Incident Recording
Incidents are recorded at the project level.

A new session must still be able to recognize recurring mistakes by reading persistent incident state.

### 18.3 Automatic Incident Creation
CodeLatch must automatically record incidents for:
- hard-stop events
- meaningful correction events

Examples:
- doc re-brainstorm
- missing dependency in approved plan
- merge guardrail failure
- pack/context conflict
- drift-triggered correction

### 18.4 Incident Storage
Project incident records live in `.tmp/codelatch/incidents/`.

Readable incident review artifacts use one file per normalized signature, at paths such as `.tmp/codelatch/incidents/<signature>.md`.

They remain project-local, survive across sessions until explicitly cleaned, and are not stored as canonical memory inside CLI-native discovery roots.

### 18.5 Incident Record Shape
Incidents must remain human-reviewable.

CodeLatch may index incident metadata in plugin-managed runtime state, but it must maintain a readable review artifact for each durable incident so users can inspect recurring failures and decide whether to patch existing context or propose new global context.

One readable file exists per normalized incident signature, and it is durable by default rather than lifecycle auto-deleted.

Minimum record contents:
- `signature`
- `count`
- `first_seen`
- `last_seen`
- `summary`
- `examples`
- `status`
- `candidate_reason`
- `suggested_pack_target`

### 18.6 Incident Status Lifecycle
Statuses:
- `open`
- `candidate`
- `approved`
- `rejected`
- `promoted`

### 18.7 Worthy Threshold
An incident becomes a learning candidate when it satisfies at least 2 of 4:
- it recurs more than once
- it causes drift, contradiction, or rework
- it points to missing/weak context or planning guidance
- it is general enough that a pack/rule could prevent it next time

### 18.8 Learning Review Flow
When `codelatch-learn` is triggered:
- incidents are scanned
- recurring worthy candidates are evaluated
- the framework decides whether an existing pack should be patched or a new pack should be proposed
- if ambiguous, brainstorming with the user is required

### 18.9 Proposal Persistence
Proposal metadata may be retained in plugin-managed runtime state.

Readable proposal files are not created by default. They are materialized only when:
- the user explicitly asks to save the proposal,
- or the proposal becomes pending-review material.

### 18.10 Project First, Global Later
Lessons are project-local first.

Only approved reusable lessons may be suggested for global promotion.

When an incident reveals reusable knowledge, CodeLatch may auto-draft a proposed global-context patch, but it must require user approval before writing or updating any global context.

---

## 19. Global Promotion Model

### 19.1 Promotion Style
Global promotion is suggested, never silent.

### 19.2 Promotion Preconditions
A project-level lesson must first be approved before it can be considered for global promotion.

### 19.3 Promotion Comparison
Before suggesting global promotion, CodeLatch compares against:
- existing global packs
- previously promoted lessons

### 19.4 Promotion Trigger
The user reviews promotion candidates through the branded promotion command flow.

---

## 20. Docs and Repository Maintenance

### 20.1 Root Files
CodeLatch should help initialize and maintain:
- `README.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- the host-native thin instruction anchor or anchors required by enabled adapters, such as `AGENTS.md` and/or `CLAUDE.md`

### 20.2 README Update Behavior
The framework should support detecting stale root docs and proposing updates over time, not only at bootstrap.

### 20.3 Badges
README badge policy should stay conservative and useful.

It should support:
- evidence-based badges
- a small header set
- update detection through sync flows

### 20.4 Truth-Doc Versioning
Each truth doc must support inline versioning and inline changelog sections.

The root `CHANGELOG.md` remains application/repository level.

---

## 21. Versioning and Compatibility

### 21.1 Version Governor
The installer/catalog must govern exact approved versions for:
- core
- adapters
- profiles
- packs
- capability bundles
- skills
- workflow roles
- instruction assets
- host-integration assets

### 21.2 Catalog Strategy
Installer uses:
- embedded default manifest
- optional newer signed catalog only on explicit upgrade

### 21.3 Upgrade Policy
No silent version drift should occur in active project behavior.

---

## 22. Non-Functional Requirements

### 22.1 Performance
CodeLatch must keep context loading and command workflows reasonably fast for interactive CLI use.

### 22.2 Token Efficiency
The system must avoid unnecessary context loading and avoid inflating prompts with unused packs or duplicated rules.

### 22.3 Reproducibility
The same approved workflow and installed pack set should improve repeatability over time.

### 22.4 Auditability
Important changes and learning proposals must be reviewable.

### 22.5 Newcomer Friendliness
The framework should not require users to understand a giant internal architecture to use it correctly.

### 22.6 CLI-Native Feel
Each supported CLI should feel like a native home for CodeLatch, not like a forced cross-tool abstraction.

---

## 23. Risks and Mitigations

### Risk 1: Context sprawl
**Mitigation:** small pack model, selective loading, user-triggered project packs, no default pack explosion.

### Risk 2: Approval fatigue
**Mitigation:** sparse meaningful approval points, free-run inside approved scope.

### Risk 3: Silent drift between code and docs
**Mitigation:** strict drift handling, truth-doc sync, re-brainstorm requirement.

### Risk 4: Plugin/package version drift
**Mitigation:** installer-governed version set with embedded manifest and explicit upgrade flow.

### Risk 5: Cross-session learning loss
**Mitigation:** persistent project incident ledger by normalized signature.

### Risk 6: Cross-CLI inconsistency
**Mitigation:** shared framework semantics, adapter-native command surfaces, shared core package.

### Risk 7: Newcomer confusion
**Mitigation:** thin root instruction anchors, controlled pack model, small number of concepts, guided commands.

---

## 24. MVP Acceptance Criteria

CodeLatch MVP is successful if it can:

1. install a reviewed global host-native integration distribution into at least the Tier-1 CLI set with native-feeling adapters,
2. initialize the canonical truth-doc trio for new repositories or adopt equivalent logical truth docs through the truth-doc registry in existing repositories,
3. keep host-native thin instruction anchors useful, minimal, and aligned, emitting only the surfaces required by enabled adapters by default and generating compatibility mirrors only when explicitly needed,
4. support branded bootstrap/sync/audit/pack-create/learn/clean/promote commands,
5. enforce brainstorm-before-execution flow,
6. enforce strict TDD for code and behavior changes inside approved free-run scope,
7. keep project-local runtime memory and review artifacts under `.tmp/codelatch/` with explicit cleanup confirmation,
8. distribute reviewed skills, workflow roles, instruction assets, and host-integration assets into documented CLI-native locations while keeping behavior aligned to the CodeLatch flow,
9. distinguish installer-managed host integration distribution from `codelatch-bootstrap` project scaffolding,
10. stop on meaningful drift and require document re-alignment,
11. maintain pack-based context with lazy selection, layered authority, and minimum-viable injection,
12. support project-specific custom pack creation,
13. record and review recurring project incidents across sessions,
14. produce project-level learning candidates without silent mutation,
15. suggest global promotion only after project approval,
16. support safe isolated parallel work with guarded merge-back,
17. and remain usable without approval spam during routine execution inside approved scope.

---

## 25. Future Considerations (Post-MVP)

Potential later extensions include:
- optional advanced routing maps
- stronger benchmark/replay suite
- richer global promotion workflow
- optional signed lesson catalogs
- optional path-aware scope routing for very large repositories
- optional central policy dashboards
- more CLI adapters
- richer adapter-specific UX
- stronger regression benchmarking for framework evolution

---

## 26. Remaining Follow-Ups After Technical Design

The current technical design resolves the main MVP architecture questions that were open in the first PRD draft.

Remaining follow-up work now belongs primarily to implementation planning and prototype validation, including:

- live adapter conformance checks against supported host discovery and integration surfaces,
- installer validation for global-plugin versus explicit project-local install modes,
- end-to-end verification of workflow-event bindings and MVI-sized context injection,
- generated-file commit/ignore defaults per install mode,
- and schema/test-fixture finalization for runtime manifests and validation tooling.

---

## 27. PRD Summary

CodeLatch is a cross-CLI context-and-control framework for AI coding that keeps project truth, execution, learning, and pack-based context aligned without turning the workflow into a slow approval-heavy process.

Its defining traits are:
- brainstorm-first,
- truth-doc-led execution,
- sparse approvals,
- pack-based context with minimal injection,
- strict drift handling,
- safe parallel execution,
- project-first learning,
- and native-feeling multi-CLI support.

This PRD defines the product direction for MVP and provides the product baseline for the next documents:
- `product-docs/technical-design.md`
- `product-docs/implementation-plan.md`
