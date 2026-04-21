import { describe, expect, it } from 'vitest';
import { decideBootstrapMode } from '@codelatch/core';
import type { RepoDetectionResult } from '@codelatch/core';

describe('bootstrap decision logic', () => {
  const emptyDetection: RepoDetectionResult = {
    isGitRepo: false,
    existingTruthDocs: [],
    existingRootFiles: [],
    existingHostDirs: [],
    hasExistingCodelatch: false
  };

  it('decides fresh for empty repo', () => {
    const decision = decideBootstrapMode(emptyDetection);

    expect(decision.mode).toBe('fresh');
    expect(decision.hasExistingTruthDocs).toBe(false);
  });

  it('decides adopt for non-canonical truth docs', () => {
    const decision = decideBootstrapMode({
      ...emptyDetection,
      existingTruthDocs: [
        { role: 'prd', path: 'product-docs/codelatch-prd.md', isCanonical: false }
      ]
    });

    expect(decision.mode).toBe('adopt');
    expect(decision.hasExistingTruthDocs).toBe(true);
  });

  it('decides migrate for canonical truth docs', () => {
    const decision = decideBootstrapMode({
      ...emptyDetection,
      existingTruthDocs: [
        { role: 'prd', path: 'product-docs/prd.md', isCanonical: true },
        { role: 'technical_design', path: 'product-docs/technical-design.md', isCanonical: true }
      ]
    });

    expect(decision.mode).toBe('migrate');
    expect(decision.hasExistingTruthDocs).toBe(true);
  });

  it('decides migrate when existing codelatch runtime exists', () => {
    const decision = decideBootstrapMode({
      ...emptyDetection,
      hasExistingCodelatch: true
    });

    expect(decision.mode).toBe('migrate');
    expect(decision.hasExistingCodelatch).toBe(true);
  });

  it('includes detected adapters in the decision', () => {
    const decision = decideBootstrapMode({
      ...emptyDetection,
      existingHostDirs: [
        { hostId: 'opencode', path: '.opencode' },
        { hostId: 'claude-code', path: '.claude' }
      ]
    });

    expect(decision.detectedAdapters).toEqual(['opencode', 'claude-code']);
  });

  it('provides a human-readable reason', () => {
    const decision = decideBootstrapMode(emptyDetection);

    expect(decision.reason).toContain('fresh bootstrap');
  });
});
