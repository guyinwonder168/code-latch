/**
 * Core command dispatcher.
 *
 * Routes a canonical CodeLatch command to the appropriate
 * handler. For Phase 4, BOOTSTRAP has a full end-to-end
 * pipeline; other commands return a "not yet implemented" result.
 */

import {
  CanonicalCommand,
  type CommandContext,
  type CommandResult,
  type BootstrapResult
} from '@codelatch/workflow-contracts';
import type { AdapterId } from '@codelatch/schemas';
import {
  createRuntimeRootPaths,
  initializeRuntimeRoot,
  createProjectManifest,
  createTruthDocRegistry,
  resolveInstructionSurfacePolicy,
  createBootstrapEnvelope,
  computeBootstrapAnchors,
  detectRepoState,
  decideBootstrapMode,
  suggestAdapterSelection,
  resolveTruthDocPaths,
  buildTruthDocRegistryInput,
  createBootstrapSummary,
  type FsOps,
  type FsReadOps
} from './bootstrap/index.js';
import { ProjectManifestSchema, TruthDocRegistrySchema } from '@codelatch/schemas';

export type BootstrapInput = {
  projectId: string;
  adapters?: AdapterId[];
  profile: string;
  truthDocPaths?: { prd: string; technical_design: string; implementation_plan: string };
  truthDocHashes?: { prd: string; technical_design: string; implementation_plan: string };
  truthDocVersions?: { prd: string; technical_design: string; implementation_plan: string };
  repoState?: { git_head: string | null; tree_status: string };
  localContextPath?: string;
};

/**
 * Execute the full bootstrap pipeline.
 * 1. Detect repo state
 * 2. Decide bootstrap mode (fresh/adopt/migrate)
 * 3. Suggest adapter selection
 * 4. Resolve truth-doc paths
 * 5. Initialize runtime root
 * 6. Create manifest and registry
 * 7. Render instruction surfaces (AGENTS.md for OpenCode)
 * 8. Write adapter metadata
 * 9. Return bootstrap summary
 */
const executeBootstrap = async (
  projectRoot: string,
  input: BootstrapInput,
  fs: FsOps,
  fsRead: FsReadOps
): Promise<CommandResult<BootstrapResult>> => {
  // Step 1: Detect repo state
  const detection = await detectRepoState(projectRoot, fsRead);

  // Step 2: Decide bootstrap mode
  const decision = decideBootstrapMode(detection);

  // Step 3: Select adapters
  const adapterSuggestion = suggestAdapterSelection(detection, input.adapters);
  const adapters = adapterSuggestion.suggestedAdapters;

  // Step 4: Resolve truth-doc paths
  const resolvedPaths = input.truthDocPaths ?? resolveTruthDocPaths(decision.mode, detection.existingTruthDocs);

  // Step 5: Initialize runtime root
  const paths = createRuntimeRootPaths(projectRoot);
  const policy = resolveInstructionSurfacePolicy(adapters);

  // Step 6: Build manifest and registry
  const registryInput = buildTruthDocRegistryInput(
    resolvedPaths,
    input.truthDocVersions
  );
  const registry = createTruthDocRegistry(registryInput);

  const manifest = createProjectManifest({
    projectId: input.projectId,
    adapters,
    profile: input.profile,
    truthDocPaths: resolvedPaths,
    instructionSurfacePolicy: policy
  });

  // Validate against schemas before writing
  const manifestValidation = ProjectManifestSchema.safeParse(manifest);
  if (!manifestValidation.success) {
    return { success: false, error: `Invalid manifest: ${manifestValidation.error.message}` };
  }

  const registryValidation = TruthDocRegistrySchema.safeParse(registry);
  if (!registryValidation.success) {
    return { success: false, error: `Invalid registry: ${registryValidation.error.message}` };
  }

  // Step 7: Write runtime files
  await initializeRuntimeRoot(paths, fs);
  await fs.writeFile(paths.manifest, JSON.stringify(manifest, null, 2));
  await fs.writeFile(paths.registry, JSON.stringify(registry, null, 2));

  // Step 8: Render instruction surfaces
  const instructionSurfaces = policy.native_surfaces;
  const createdPaths = [paths.manifest, paths.registry];
  const adoptedPaths = decision.mode !== 'fresh'
    ? detection.existingTruthDocs.map((d) => d.path)
    : [];

  // Render AGENTS.md if OpenCode-family adapter is enabled
  if (adapters.includes('opencode') || adapters.includes('kilocode') || adapters.includes('codex')) {
    const agentsMdPath = `${projectRoot}/AGENTS.md`;
    const agentsContent = renderAgentsMdContent(resolvedPaths, input.localContextPath);
    await fs.writeFile(agentsMdPath, agentsContent);
    createdPaths.push(agentsMdPath);
  }

  // Render .opencode/codelatch/adapter.json if OpenCode adapter is enabled
  if (adapters.includes('opencode')) {
    const adapterJsonPath = `${projectRoot}/.opencode/codelatch/adapter.json`;
    const adapterJson = renderOpenCodeAdapterJson(projectRoot);
    await fs.mkdir(`${projectRoot}/.opencode/codelatch`, { recursive: true });
    await fs.writeFile(adapterJsonPath, JSON.stringify(adapterJson, null, 2));
    createdPaths.push(adapterJsonPath);
  }

  // Step 9: Create envelope and anchors for provenance
  const repoState = input.repoState ?? { git_head: null, tree_status: 'clean-or-not-applicable' };
  const truthDocHashes = input.truthDocHashes ?? {
    prd: 'sha256:pending',
    technical_design: 'sha256:pending',
    implementation_plan: 'sha256:pending'
  };

  void createBootstrapEnvelope({
    adapterId: adapters[0] ?? 'opencode',
    truthDocPaths: resolvedPaths,
    instructionSurfacePolicy: policy
  });
  void computeBootstrapAnchors({
    truthDocHashes,
    adapterSet: adapters,
    repoState,
    instructionSurfacePolicy: policy
  });

  // Build summary (stored for future use by summary renderer)
  void createBootstrapSummary({
    mode: decision.mode,
    adapters,
    createdPaths,
    adoptedPaths,
    instructionSurfaces,
    runtimeRoot: paths.root,
    truthDocPaths: resolvedPaths
  });

  return {
    success: true,
    data: {
      runtimeRoot: paths.root,
      manifestPath: paths.manifest,
      registryPath: paths.registry,
      versionGovernorPath: paths.versionGovernor,
      instructionSurfaces,
      adapterSet: adapters
    }
  };
};

/**
 * Render AGENTS.md content for OpenCode-family adapters.
 * Follows Section 7.5 contract.
 */
const renderAgentsMdContent = (
  truthDocPaths: { prd: string; technical_design: string; implementation_plan: string },
  localContextPath?: string
): string => {
  const lines = [
    '# AGENTS.md',
    '',
    'This repository uses CodeLatch.',
    '',
    '## Source of Truth',
    `- PRD: \`${truthDocPaths.prd}\``,
    `- Technical Design: \`${truthDocPaths.technical_design}\``,
    `- Implementation Plan: \`${truthDocPaths.implementation_plan}\``
  ];

  if (localContextPath) {
    lines.push('', '## Local Context', `- Project context: \`${localContextPath}\``);
  }

  lines.push(
    '',
    '## Non-Negotiable Reminders',
    '- Keep work aligned to the truth docs.',
    '- Keep changes scoped to approved work.',
    '- Use CodeLatch flows for sync, planning, execution, and review.'
  );

  return lines.join('\n');
};

/**
 * Render adapter.json for OpenCode.
 */
const renderOpenCodeAdapterJson = (projectRoot: string) => ({
  adapter_id: 'opencode',
  project_root: projectRoot,
  metadata_dir: '.opencode/codelatch',
  discovery_surfaces: {
    instructions: ['AGENTS.md', '.opencode/instructions.md'],
    commands: ['opencode.json#command'],
    skills: ['.opencode/skills/*/SKILL.md', '.claude/skills/*/SKILL.md', '.agents/skills/*/SKILL.md'],
    agents: ['.opencode/agents'],
    plugin_manifest: ['opencode.json#plugin'],
    plugin_hooks: ['config', 'command.execute.before']
  },
  instruction_precedence: ['AGENTS.md', '.opencode/instructions.md'],
  workflow_bindings: [
    {
      event: 'bootstrap.start',
      host_surface: 'config',
      binding_ref: 'opencode.json#plugin',
      injection_policy: 'opencode-bootstrap-shell',
      fallback: 'wrapper-prelude'
    },
    {
      event: 'execution.step',
      host_surface: 'command.execute.before',
      binding_ref: 'plugin#command.execute.before',
      injection_policy: 'opencode-wrapper-checkpoint',
      fallback: 'core-gate'
    }
  ],
  install_mode: 'global-host-integration',
  wrapper_mode: 'delegate-to-core'
});

/**
 * Dispatch a canonical CodeLatch command to the appropriate handler.
 * Returns a CommandResult with the outcome.
 */
export const dispatchCommand = async (
  context: CommandContext,
  fs: FsOps,
  bootstrapInput?: BootstrapInput,
  fsRead?: FsReadOps
): Promise<CommandResult<BootstrapResult>> => {
  switch (context.command) {
    case CanonicalCommand.BOOTSTRAP: {
      if (!bootstrapInput) {
        return { success: false, error: 'Bootstrap requires input parameters' };
      }
      const readOps: FsReadOps = fsRead ?? {
        exists: async () => false,
        readdir: async () => []
      };
      return executeBootstrap(context.projectRoot, bootstrapInput, fs, readOps);
    }
    default:
      return { success: false, error: `Command ${context.command} is not yet implemented` };
  }
};
