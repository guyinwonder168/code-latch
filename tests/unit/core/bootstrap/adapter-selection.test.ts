import { describe, expect, it } from 'vitest';
import { suggestAdapterSelection } from '@codelatch/core';
import type { RepoDetectionResult } from '@codelatch/core';

const emptyDetection: RepoDetectionResult = {
  isGitRepo: false,
  existingTruthDocs: [],
  existingRootFiles: [],
  existingHostDirs: [],
  hasExistingCodelatch: false
};

describe('adapter selection', () => {
  it('defaults to OpenCode when no host dirs detected', () => {
    const suggestion = suggestAdapterSelection(emptyDetection);

    expect(suggestion.suggestedAdapters).toEqual(['opencode']);
    expect(suggestion.reasoning).toContain('defaulting to OpenCode');
  });

  it('suggests detected adapters when host dirs found', () => {
    const suggestion = suggestAdapterSelection({
      ...emptyDetection,
      existingHostDirs: [
        { hostId: 'opencode', path: '.opencode' },
        { hostId: 'claude-code', path: '.claude' }
      ]
    });

    expect(suggestion.suggestedAdapters).toEqual(['opencode', 'claude-code']);
    expect(suggestion.detectedAdapters).toEqual(['opencode', 'claude-code']);
  });

  it('uses user-requested adapters when provided', () => {
    const suggestion = suggestAdapterSelection(
      emptyDetection,
      ['codex', 'kilocode']
    );

    expect(suggestion.suggestedAdapters).toEqual(['codex', 'kilocode']);
    expect(suggestion.reasoning).toContain('User requested');
  });

  it('reports detected adapters even when user overrides selection', () => {
    const suggestion = suggestAdapterSelection(
      {
        ...emptyDetection,
        existingHostDirs: [{ hostId: 'opencode', path: '.opencode' }]
      },
      ['codex']
    );

    expect(suggestion.suggestedAdapters).toEqual(['codex']);
    expect(suggestion.detectedAdapters).toEqual(['opencode']);
  });
});
