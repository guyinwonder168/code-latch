/**
 * Approval-anchor primitives for bootstrap state creation.
 *
 * Computes the initial anchor set that ties the bootstrap
 * result to truth-doc content, adapter configuration, and
 * repository state. Pure function — no side effects.
 */

import type { RepoState } from '@codelatch/schemas';

export type BootstrapAnchors = {
  truth_doc_hashes: {
    prd: string;
    technical_design: string;
    implementation_plan: string;
  };
  adapter_set: string[];
  repo_state: RepoState;
  instruction_surface_hash: string;
  computed_at: string;
};

export type ComputeBootstrapAnchorsInput = {
  truthDocHashes: { prd: string; technical_design: string; implementation_plan: string };
  adapterSet: string[];
  repoState: RepoState;
  instructionSurfacePolicy: {
    native_surfaces: string[];
    compatibility_surfaces: string[];
    mirror_policy: string;
  };
};

/**
 * Compute the approval-anchor set for a bootstrap result.
 * Pure function — no side effects.
 */
export const computeBootstrapAnchors = (
  input: ComputeBootstrapAnchorsInput
): BootstrapAnchors => ({
  truth_doc_hashes: input.truthDocHashes,
  adapter_set: input.adapterSet,
  repo_state: input.repoState,
  instruction_surface_hash: hashInstructionSurfacePolicy(input.instructionSurfacePolicy),
  computed_at: new Date().toISOString()
});

/**
 * Deterministic hash-like fingerprint of the instruction-surface policy.
 * Not cryptographic — used for anchor staleness detection.
 */
const hashInstructionSurfacePolicy = (
  policy: { native_surfaces: string[]; compatibility_surfaces: string[]; mirror_policy: string }
): string => {
  const parts = [
    ...policy.native_surfaces.sort(),
    ...policy.compatibility_surfaces.sort(),
    policy.mirror_policy
  ];
  return `isp:${parts.join('|')}`;
};
