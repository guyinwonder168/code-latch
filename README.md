# CodeLatch

CodeLatch is a cross-CLI context-and-control framework for AI coding workflows.

This repository holds the product, technical, and implementation planning documents for the MVP, plus working implementation code for the core packages and OpenCode adapter. The implementation direction is host-native: one shared internal core model, with separate adapters and installers per supported CLI.

## Status

- **Stage:** implementation (Phase 6 complete; Phase 7 next)
- **Current focus:** OpenCode adapter — all 7 canonical command pipelines implemented, plugin entry module needs refactoring to match OpenCode Plugin SDK interface
- **Delivery order:** OpenCode → Kilo Code → Claude Code → Codex

## What CodeLatch Is Aiming To Do

CodeLatch is being designed to help teams and individuals manage AI coding workflows with:

- shared project truth docs and execution rules
- host-native integration per supported CLI
- reusable internal contracts instead of one forced external plugin format
- controlled workflow behavior around planning, approval, execution, and validation

## Repository Contents

### `product-docs/`

Core planning documents (source of truth):

- `codelatch-prd.md` — product requirements and product scope (v0.2.12)
- `technical-design.md` — architecture, integration model, and system design (v0.2.16)
- `implementation-plan.md` — phased execution plan derived from the truth docs (v0.1.3)

### `packages/`

Implementation packages:

- `@codelatch/core` — shared command dispatcher and pipeline implementations (all 7 canonical commands)
- `@codelatch/workflow-contracts` — canonical enums, result types, and event contracts
- `@codelatch/schemas` — Zod schemas for project manifest, truth-doc registry, etc.
- `@codelatch/adapter-base` — adapter metadata interface and capability definitions
- `@codelatch/adapter-opencode` — OpenCode adapter: AGENTS.md, opencode.json, command-config, adapter metadata renderers, and plugin entry module
- `@codelatch/shared-utils` — shared utilities

### `tests/`

- `tests/unit/` — 175 unit tests covering core dispatcher, pipelines, schemas, and adapter renderers
- `tests/integration/` — 32 integration tests

## Architecture

The project is intentionally shaped around:

- **one shared internal canonical/core model**
- **separate host adapters per CLI**
- **separate host-native renderers/installers**
- **host-specific external integration surfaces where required**

CodeLatch does **not** assume a single universal external plugin package format across all supported AI coding hosts. Instead, each adapter produces the right distribution format for its host:

| Host | Distribution Format | Build Required |
|------|-------------------|----------------|
| OpenCode | Bundled TypeScript module (Plugin SDK `async (ctx) => { ... }`) | Yes (esbuild to collapse workspace deps) |
| Kilo Code | Bundled TypeScript module (OpenCode-compatible) | Yes (shared bundling pipeline) |
| Claude Code | Declarative directory (`.claude-plugin/plugin.json` + skills, hooks, MCP) | No (skills are `.md` files) |
| Codex | Declarative directory (`.codex-plugin/plugin.json` + skills, apps, MCP) | No (skills are `.md` files) |

## Planned Host Order

1. **OpenCode** — runtime plugin module, Bun runtime, programmatic command registration via `config` hook
2. **Kilo Code** — OpenCode-compatible config/runtime surfaces + Kilo-native layers
3. **Claude Code** — declarative plugin package with hooks (command/http/prompt/agent) and MCP
4. **Codex** — declarative plugin package with marketplace distribution and `.app.json` integrations

## Getting Started

The OpenCode adapter (`@codelatch/adapter-opencode`) is the first runnable component, with all 7 canonical command pipelines implemented in the shared core.

To understand the project:

1. Read `product-docs/codelatch-prd.md`
2. Read `product-docs/technical-design.md`
3. Read `product-docs/implementation-plan.md`

To run tests:

```bash
pnpm test
```

## Contributing

The project is in active implementation. The main contribution paths are:

- reviewing and refining the truth docs (PRD, technical design, implementation plan)
- implementing adapter packages (Kilo Code, Claude Code, Codex)
- building the OpenCode plugin bundling pipeline for production distribution

If you open an issue or propose changes, keeping terminology aligned across the PRD, technical design, and implementation plan is especially helpful.

## License

MIT