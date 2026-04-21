/**
 * Adapter selection for bootstrap.
 *
 * Suggests which adapters to enable based on repo detection
 * results and user preferences. Pure function — no side effects.
 */

import type { AdapterId } from '@codelatch/schemas';
import type { RepoDetectionResult } from './detection.js';

export type AdapterSelectionSuggestion = {
  suggestedAdapters: AdapterId[];
  detectedAdapters: AdapterId[];
  reasoning: string;
};

const DEFAULT_ADAPTER: AdapterId = 'opencode';

const HOST_DIR_TO_ADAPTER: Record<string, AdapterId> = {
  opencode: 'opencode',
  'claude-code': 'claude-code',
  codex: 'codex',
  kilocode: 'kilocode'
};

/**
 * Suggest adapter selection based on detection results.
 * If explicit adapters are requested, use those. Otherwise,
 * suggest based on detected host directories, defaulting to OpenCode.
 * Pure function — no side effects.
 */
export const suggestAdapterSelection = (
  detection: RepoDetectionResult,
  requestedAdapters?: AdapterId[]
): AdapterSelectionSuggestion => {
  if (requestedAdapters && requestedAdapters.length > 0) {
    return {
      suggestedAdapters: requestedAdapters,
      detectedAdapters: detection.existingHostDirs
        .map((d) => HOST_DIR_TO_ADAPTER[d.hostId])
        .filter((a): a is AdapterId => a !== undefined),
      reasoning: `User requested adapters: ${requestedAdapters.join(', ')}`
    };
  }

  const detectedAdapters = detection.existingHostDirs
    .map((d) => HOST_DIR_TO_ADAPTER[d.hostId])
    .filter((a): a is AdapterId => a !== undefined);

  if (detectedAdapters.length > 0) {
    return {
      suggestedAdapters: detectedAdapters,
      detectedAdapters,
      reasoning: `Detected host directories: ${detectedAdapters.join(', ')}`
    };
  }

  return {
    suggestedAdapters: [DEFAULT_ADAPTER],
    detectedAdapters: [],
    reasoning: 'No host directories detected — defaulting to OpenCode'
  };
};
