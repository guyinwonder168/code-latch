/**
 * Core command dispatcher.
 *
 * Routes a canonical CodeLatch command to the appropriate
 * handler. For Phase 3, only BOOTSTRAP has a real handler;
 * other commands return a "not yet implemented" result.
 */

import { CanonicalCommand, type CommandContext, type CommandResult, type BootstrapResult } from '@codelatch/workflow-contracts';
import type { AdapterId } from '@codelatch/schemas';
import {
  createRuntimeRootPaths,
  initializeRuntimeRoot,
  createProjectManifest,
  createTruthDocRegistry,
  resolveInstructionSurfacePolicy,
  createBootstrapEnvelope,
  computeBootstrapAnchors,
  type FsOps
} from './bootstrap/index.js';
import { ProjectManifestSchema, TruthDocRegistrySchema } from '@codelatch/schemas';

type BootstrapInput = {
  projectId: string;
  adapters: AdapterId[];
  profile: string;
  truthDocPaths: { prd: string; technical_design: string; implementation_plan: string };
  truthDocHashes: { prd: string; technical_design: string; implementation_plan: string };
  truthDocVersions: { prd: string; technical_design: string; implementation_plan: string };
  repoState: { git_head: string | null; tree_status: string };
};

/**
 * Execute the bootstrap command.
 * Creates runtime root, manifest, registry, and returns the bootstrap result.
 */
const executeBootstrap = async (
  projectRoot: string,
  input: BootstrapInput,
  fs: FsOps
): Promise<CommandResult<BootstrapResult>> => {
  const paths = createRuntimeRootPaths(projectRoot);
  const policy = resolveInstructionSurfacePolicy(input.adapters);
  const manifest = createProjectManifest({
    projectId: input.projectId,
    adapters: input.adapters,
    profile: input.profile,
    truthDocPaths: input.truthDocPaths,
    instructionSurfacePolicy: policy
  });
  const registry = createTruthDocRegistry({
    prd: { path: input.truthDocPaths.prd, version: input.truthDocVersions.prd, hash: input.truthDocHashes.prd },
    technical_design: { path: input.truthDocPaths.technical_design, version: input.truthDocVersions.technical_design, hash: input.truthDocHashes.technical_design },
    implementation_plan: { path: input.truthDocPaths.implementation_plan, version: input.truthDocVersions.implementation_plan, hash: input.truthDocHashes.implementation_plan }
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

  // Initialize filesystem
  await initializeRuntimeRoot(paths, fs);
  await fs.writeFile(paths.manifest, JSON.stringify(manifest, null, 2));
  await fs.writeFile(paths.registry, JSON.stringify(registry, null, 2));

  // Create envelope and anchors for provenance
  void createBootstrapEnvelope({
    adapterId: 'opencode',
    truthDocPaths: input.truthDocPaths,
    instructionSurfacePolicy: policy
  });
  void computeBootstrapAnchors({
    truthDocHashes: input.truthDocHashes,
    adapterSet: input.adapters,
    repoState: input.repoState,
    instructionSurfacePolicy: policy
  });

  return {
    success: true,
    data: {
      runtimeRoot: paths.root,
      manifestPath: paths.manifest,
      registryPath: paths.registry,
      versionGovernorPath: paths.versionGovernor,
      instructionSurfaces: policy.native_surfaces,
      adapterSet: input.adapters
    }
  };
};

/**
 * Dispatch a canonical CodeLatch command to the appropriate handler.
 * Returns a CommandResult with the outcome.
 */
export const dispatchCommand = async (
  context: CommandContext,
  fs: FsOps,
  bootstrapInput?: BootstrapInput
): Promise<CommandResult<BootstrapResult>> => {
  switch (context.command) {
    case CanonicalCommand.BOOTSTRAP: {
      if (!bootstrapInput) {
        return { success: false, error: 'Bootstrap requires input parameters' };
      }
      return executeBootstrap(context.projectRoot, bootstrapInput, fs);
    }
    default:
      return { success: false, error: `Command ${context.command} is not yet implemented` };
  }
};

export type { BootstrapInput };
