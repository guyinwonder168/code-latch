/**
 * OpenCode adapter.json renderer — produces the adapter metadata file
 * for `.opencode/codelatch/adapter.json`.
 *
 * Follows the AdapterMetadataSchema from @codelatch/schemas.
 */

import type { AdapterMetadata } from '@codelatch/schemas';

export type AdapterJsonInput = {
  projectRoot: string;
  metadataDir: string;
  discoverySurfaces: {
    instructions: string[];
    commands: string[];
    skills: string[];
    agents: string[];
    plugin_manifest: string[];
    plugin_hooks: string[];
  };
  instructionPrecedence: string[];
  workflowBindings: Array<{
    event: string;
    host_surface: string;
    binding_ref: string;
    injection_policy: string;
    fallback: string;
  }>;
};

/**
 * Render adapter.json content following AdapterMetadataSchema.
 * Pure function — no side effects.
 */
export const renderAdapterJson = (input: AdapterJsonInput): AdapterMetadata => ({
  adapter_id: 'opencode',
  project_root: input.projectRoot,
  metadata_dir: input.metadataDir,
  discovery_surfaces: input.discoverySurfaces,
  instruction_precedence: input.instructionPrecedence,
  workflow_bindings: input.workflowBindings,
  install_mode: 'global-host-integration',
  wrapper_mode: 'delegate-to-core'
});

/**
 * Default OpenCode discovery surfaces.
 */
export const OPEN_CODE_DISCOVERY_SURFACES = {
  instructions: ['AGENTS.md', '.opencode/instructions.md'],
  commands: ['opencode.json#command'],
  skills: ['.opencode/skills/*/SKILL.md', '.claude/skills/*/SKILL.md', '.agents/skills/*/SKILL.md'],
  agents: ['.opencode/agents'],
  plugin_manifest: ['opencode.json#plugin'],
  plugin_hooks: ['config', 'command.execute.before']
};

/**
 * Default OpenCode instruction precedence.
 */
export const OPEN_CODE_INSTRUCTION_PRECEDENCE = [
  'AGENTS.md',
  '.opencode/instructions.md'
];
