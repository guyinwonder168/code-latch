/**
 * Bounded drift inputs for sync.
 *
 * Section 13.3.1: Drift classification is computed from a bounded
 * input set rather than open-ended repository interpretation.
 *
 * If a signal cannot be tied to one of these inputs, it is not
 * enough by itself to classify drift.
 */

import type { ProjectManifest, TruthDocRegistry, RepoState } from '@codelatch/schemas';
import type { InstructionSurfacePolicy } from '@codelatch/workflow-contracts';

export type DriftInputs = {
  truthDocRegistry: TruthDocRegistry['truth_docs'];
  manifestTruthDocPaths: { prd: string; technical_design: string; implementation_plan: string };
  currentTruthDocHashes: { prd: string; technical_design: string; implementation_plan: string };
  anchors: {
    truth_doc_hashes: { prd: string; technical_design: string; implementation_plan: string };
    adapter_set: string[];
    repo_state: RepoState;
    instruction_surface_hash: string;
    computed_at: string;
  };
  instructionSurfacePolicy: InstructionSurfacePolicy;
  adapterSet: string[];
  actualInstructionSurfaces: string[];
  changedFiles?: string[];
  diffSummary?: string;
};

export type BuildDriftInputsInput = {
  manifest: ProjectManifest;
  registry: TruthDocRegistry;
  anchors: DriftInputs['anchors'];
  currentTruthDocHashes: { prd: string; technical_design: string; implementation_plan: string };
  currentAdapterSet: string[];
  actualInstructionSurfaces: string[];
  changedFiles?: string[];
  diffSummary?: string;
};

/**
 * Build the bounded drift input set from manifest, registry,
 * anchors, and current observed state.
 * Pure function — no side effects.
 */
export const buildDriftInputs = (input: BuildDriftInputsInput): DriftInputs => ({
  truthDocRegistry: input.registry.truth_docs,
  manifestTruthDocPaths: input.manifest.truth_docs,
  currentTruthDocHashes: input.currentTruthDocHashes,
  anchors: input.anchors,
  instructionSurfacePolicy: input.manifest.instruction_surface_policy,
  adapterSet: [...input.currentAdapterSet],
  actualInstructionSurfaces: input.actualInstructionSurfaces,
  changedFiles: input.changedFiles,
  diffSummary: input.diffSummary
});
