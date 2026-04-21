/**
 * Bootstrap decision logic — adopt / migrate / fresh.
 *
 * Given repo detection results, determines which bootstrap
 * strategy to use. Pure function — no side effects.
 */

import type { RepoDetectionResult } from './detection.js';

export type BootstrapMode = 'fresh' | 'adopt' | 'migrate';

export type BootstrapDecision = {
  mode: BootstrapMode;
  hasExistingTruthDocs: boolean;
  hasExistingCodelatch: boolean;
  detectedAdapters: string[];
  reason: string;
};

/**
 * Decide the bootstrap mode from repo detection results.
 * Pure function — no side effects.
 */
export const decideBootstrapMode = (
  detection: RepoDetectionResult
): BootstrapDecision => {
  const hasExistingTruthDocs = detection.existingTruthDocs.length > 0;
  const detectedAdapters = detection.existingHostDirs.map((d) => d.hostId);

  if (detection.hasExistingCodelatch) {
    return {
      mode: 'migrate',
      hasExistingTruthDocs,
      hasExistingCodelatch: true,
      detectedAdapters,
      reason: 'Existing .tmp/codelatch/ runtime root found — migration needed'
    };
  }

  if (hasExistingTruthDocs) {
    const allCanonical = detection.existingTruthDocs.every((d) => d.isCanonical);

    if (allCanonical) {
      return {
        mode: 'migrate',
        hasExistingTruthDocs,
        hasExistingCodelatch: false,
        detectedAdapters,
        reason: 'Existing truth docs with canonical names found — migrate into CodeLatch'
      };
    }

    return {
      mode: 'adopt',
      hasExistingTruthDocs,
      hasExistingCodelatch: false,
      detectedAdapters,
      reason: 'Existing truth docs with non-canonical names found — adopt into registry'
    };
  }

  return {
    mode: 'fresh',
    hasExistingTruthDocs: false,
    hasExistingCodelatch: false,
    detectedAdapters,
    reason: 'No existing truth docs or CodeLatch state — fresh bootstrap'
  };
};
