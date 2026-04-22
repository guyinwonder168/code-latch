/**
 * Approval-anchor staleness checks.
 *
 * Section 10.4.1: An approval is reusable only when its full
 * anchor set still matches the active execution state.
 *
 * The anchor set is:
 * - truth_doc_hashes (not just doc version labels)
 * - adapter_set_ref
 * - repo_state (git_head when available)
 * - instruction_surface_hash
 *
 * If any anchor changes, the prior approval is stale and
 * CodeLatch must stop for re-approval instead of silently continuing.
 *
 * Pure function — no side effects.
 */

import type { RepoState } from '@codelatch/schemas';

export type ApprovalAnchors = {
  truth_doc_hashes: { prd: string; technical_design: string; implementation_plan: string };
  adapter_set: string[];
  repo_state: RepoState;
  instruction_surface_hash: string;
  computed_at: string;
};

export type CheckAnchorStalenessInput = {
  anchors: ApprovalAnchors;
  currentTruthDocHashes: { prd: string; technical_design: string; implementation_plan: string };
  currentAdapterSet: string[];
  currentRepoState: RepoState;
  currentInstructionSurfaceHash: string;
};

export type AnchorStalenessResult = {
  isStale: boolean;
  staleFields: string[];
};

/**
 * Check whether approval anchors are stale against current state.
 *
 * Section 10.4.1: If any anchor changes, the prior approval is stale.
 * Section 13.3.2: If the finding conflicts with an approval anchor,
 * CodeLatch must treat the approval as stale even if no file write
 * has happened yet.
 *
 * Pure function — no side effects.
 */
export const checkAnchorStaleness = (input: CheckAnchorStalenessInput): AnchorStalenessResult => {
  const staleFields: string[] = [];

  // Check truth-doc hashes
  const anchorHashes = input.anchors.truth_doc_hashes;
  const currentHashes = input.currentTruthDocHashes;
  if (anchorHashes.prd !== currentHashes.prd ||
      anchorHashes.technical_design !== currentHashes.technical_design ||
      anchorHashes.implementation_plan !== currentHashes.implementation_plan) {
    staleFields.push('truth_doc_hashes');
  }

  // Check adapter set
  const anchorAdapters = [...input.anchors.adapter_set].sort();
  const currentAdapters = [...input.currentAdapterSet].sort();
  if (anchorAdapters.length !== currentAdapters.length ||
      !anchorAdapters.every((v, i) => v === currentAdapters[i])) {
    staleFields.push('adapter_set');
  }

  // Check repo state
  const anchorRepo = input.anchors.repo_state;
  const currentRepo = input.currentRepoState;
  if (anchorRepo.git_head !== currentRepo.git_head ||
      anchorRepo.tree_status !== currentRepo.tree_status) {
    staleFields.push('repo_state');
  }

  // Check instruction-surface hash
  if (input.anchors.instruction_surface_hash !== input.currentInstructionSurfaceHash) {
    staleFields.push('instruction_surface_hash');
  }

  return {
    isStale: staleFields.length > 0,
    staleFields
  };
};
