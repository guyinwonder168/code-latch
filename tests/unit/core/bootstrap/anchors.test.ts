import { describe, expect, it } from 'vitest';
import { computeBootstrapAnchors } from '@codelatch/core';

describe('approval-anchor primitives', () => {
  const baseInput = {
    truthDocHashes: {
      prd: 'sha256:abc123',
      technical_design: 'sha256:def456',
      implementation_plan: 'sha256:ghi789'
    },
    adapterSet: ['opencode'],
    repoState: {
      git_head: null,
      tree_status: 'clean-or-not-applicable'
    },
    instructionSurfacePolicy: {
      native_surfaces: ['AGENTS.md'],
      compatibility_surfaces: [],
      mirror_policy: 'explicit-only'
    }
  };

  it('computes anchors that capture truth-doc hashes', () => {
    const anchors = computeBootstrapAnchors(baseInput);

    expect(anchors.truth_doc_hashes.prd).toBe('sha256:abc123');
    expect(anchors.truth_doc_hashes.technical_design).toBe('sha256:def456');
    expect(anchors.truth_doc_hashes.implementation_plan).toBe('sha256:ghi789');
  });

  it('captures the adapter set', () => {
    const anchors = computeBootstrapAnchors(baseInput);

    expect(anchors.adapter_set).toEqual(['opencode']);
  });

  it('captures the repo state', () => {
    const anchors = computeBootstrapAnchors(baseInput);

    expect(anchors.repo_state.git_head).toBeNull();
    expect(anchors.repo_state.tree_status).toBe('clean-or-not-applicable');
  });

  it('captures repo state with a git head when provided', () => {
    const anchors = computeBootstrapAnchors({
      ...baseInput,
      repoState: { git_head: 'abc123def', tree_status: 'dirty' }
    });

    expect(anchors.repo_state.git_head).toBe('abc123def');
    expect(anchors.repo_state.tree_status).toBe('dirty');
  });

  it('produces a deterministic instruction-surface hash', () => {
    const anchors1 = computeBootstrapAnchors(baseInput);
    const anchors2 = computeBootstrapAnchors(baseInput);

    expect(anchors1.instruction_surface_hash).toBe(anchors2.instruction_surface_hash);
  });

  it('changes the hash when the policy changes', () => {
    const anchors1 = computeBootstrapAnchors(baseInput);
    const anchors2 = computeBootstrapAnchors({
      ...baseInput,
      instructionSurfacePolicy: {
        native_surfaces: ['AGENTS.md', 'CLAUDE.md'],
        compatibility_surfaces: [],
        mirror_policy: 'explicit-only'
      }
    });

    expect(anchors1.instruction_surface_hash).not.toBe(anchors2.instruction_surface_hash);
  });

  it('includes an ISO computed_at timestamp', () => {
    const anchors = computeBootstrapAnchors(baseInput);

    expect(anchors.computed_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
