# CodeLatch

CodeLatch is a cross-CLI context-and-control framework for AI coding workflows.

This repository currently holds the product, technical, and implementation planning documents for the MVP. The implementation direction is host-native: one shared internal core model, with separate adapters and installers per supported CLI.

## Status

- **Stage:** early implementation (Phase 2)
- **Current focus:** OpenCode adapter shell with plugin-based command registration
- **Initial delivery order:** OpenCode, Kilo Code, Claude Code, then Codex

## What CodeLatch Is Aiming To Do

CodeLatch is being designed to help teams and individuals manage AI coding workflows with:

- shared project truth docs and execution rules
- host-native integration per supported CLI
- reusable internal contracts instead of one forced external plugin format
- controlled workflow behavior around planning, approval, execution, and validation

## Repository Contents

### `product-docs/`

Core planning documents for the project:

- `codelatch-prd.md` — product requirements and product scope
- `technical-design.md` — architecture, integration model, and system design
- `implementation-plan.md` — phased execution plan derived from the truth docs

## Current Architecture Direction

The project is intentionally being shaped around:

- **one shared internal canonical/core model**
- **separate host adapters per CLI**
- **separate host-native renderers/installers**
- **host-specific external integration surfaces where required**

That means CodeLatch does **not** assume a single universal external plugin package format across all supported AI coding hosts.

## Planned Host Order

1. OpenCode
2. Kilo Code
3. Claude Code
4. Codex

## Getting Started

The project is in early implementation. The OpenCode adapter package (`@codelatch/adapter-opencode`) is the first runnable component.

If you want to understand the project quickly, start here:

1. Read `product-docs/codelatch-prd.md`
2. Read `product-docs/technical-design.md`
3. Read `product-docs/implementation-plan.md`

## Contributing

This repo is still in its planning phase, so the main contribution path right now is reviewing and refining the product and technical direction.

If you open an issue or propose changes, keeping terminology aligned across the PRD, technical design, and implementation plan is especially helpful.

## License

MIT
