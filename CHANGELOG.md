# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-04-21

### Added

- `@codelatch/adapter-opencode` package skeleton with TypeScript ESM exports
- OpenCode adapter metadata generation (`createOpenCodeAdapterMetadata`)
- OpenCode plugin entry module (`createOpenCodePluginEntry`)
- `renderOpenCodeConfig` — minimal `opencode.json` renderer emitting only `plugin` key
- `mergePluginIntoConfig` — merge helper for adding plugin entry into existing config
- `renderOpenCodeCommandConfig` — command registration entries for plugin `config` hook
- `renderOpenCodeAgentsMd` — `AGENTS.md` renderer for OpenCode instruction anchor
- Integration test suite (9 tests) covering adapter shell, config rendering, command config, and plugin invocation
- Unit test suites for adapter-base, workflow-contracts, core-exports, workspace-foundation, and schemas (23 tests)

### Changed

- OpenCode commands are registered programmatically via the plugin `config` hook instead of `.md` files in `.opencode/commands/`
- `opencode.json` renderer emits only `plugin` key (no `command` key); commands are handled by the plugin
- Updated product truth docs to reflect plugin-registered command design

### Removed

- `renderOpenCodeCommandWrappers` (replaced by `renderOpenCodeCommandConfig`)
- `.opencode/commands/*.md` approach for OpenCode (replaced by programmatic registration)
