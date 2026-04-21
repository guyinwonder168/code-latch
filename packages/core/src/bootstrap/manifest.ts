/**
 * Project-manifest creation for bootstrap.
 *
 * Pure function that builds a validated ProjectManifest
 * from bootstrap inputs. Schema validation is the caller's
 * responsibility — this module produces the correct shape.
 */

import type {
  ProjectManifest,
  AdapterId
} from '@codelatch/schemas';
import { CODELATCH_VERSION } from '../index.js';
import type { InstructionSurfacePolicy } from '@codelatch/workflow-contracts';

export type CreateManifestInput = {
  projectId: string;
  adapters: AdapterId[];
  profile: string;
  truthDocPaths: { prd: string; technical_design: string; implementation_plan: string };
  instructionSurfacePolicy: InstructionSurfacePolicy;
  proceduralBundles?: {
    skills?: string[];
    agents?: string[];
    instructions?: string[];
    host_integrations?: string[];
  };
  installedPacks?: Array<{ name: string; version: string; scope: 'global' | 'project' }>;
};

const DEFAULT_BUNDLES = {
  skills: ['official/core'],
  agents: ['official/core'],
  instructions: ['official/core'],
  host_integrations: ['official/core']
};

/**
 * Create a ProjectManifest from bootstrap inputs.
 * Pure function — no side effects.
 */
export const createProjectManifest = (input: CreateManifestInput): ProjectManifest => {
  const now = new Date().toISOString();
  const bundles = input.proceduralBundles
    ? { ...DEFAULT_BUNDLES, ...input.proceduralBundles }
    : DEFAULT_BUNDLES;

  return {
    project_id: input.projectId,
    framework_version: CODELATCH_VERSION,
    runtime_root: '.tmp/codelatch',
    profile: input.profile,
    adapters: input.adapters,
    instruction_surface_policy: {
      native_surfaces: input.instructionSurfacePolicy.native_surfaces,
      compatibility_surfaces: input.instructionSurfacePolicy.compatibility_surfaces,
      mirror_policy: input.instructionSurfacePolicy.mirror_policy
    },
    installed_procedural_bundles: bundles,
    truth_docs: input.truthDocPaths,
    installed_packs: input.installedPacks ?? [],
    created_at: now,
    updated_at: now
  };
};
