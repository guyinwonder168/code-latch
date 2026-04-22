import { describe, expect, it } from 'vitest';
import { checkAnchorStaleness } from '@codelatch/core';

describe('approval-anchor staleness checks', () => {
  const baseAnchors = {
    truth_doc_hashes: {
      prd: 'sha256:abc123',
      technical_design: 'sha256:def456',
      implementation_plan: 'sha256:ghi789'
    },
    adapter_set: ['opencode'],
    repo_state: { git_head: null, tree_status: 'clean-or-not-applicable' },
    instruction_surface_hash: 'isp:AGENTS.md|explicit-only',
    computed_at: '2026-04-21T00:00:00Z'
  };

  it('returns not stale when all anchors match', () => {
    const result = checkAnchorStaleness({
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      currentAdapterSet: ['opencode'],
      currentRepoState: { git_head: null, tree_status: 'clean-or-not-applicable' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|explicit-only'
    });

    expect(result.isStale).toBe(false);
    expect(result.staleFields).toEqual([]);
  });

  it('detects stale truth-doc hash', () => {
    const result = checkAnchorStaleness({
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:changed',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      currentAdapterSet: ['opencode'],
      currentRepoState: { git_head: null, tree_status: 'clean-or-not-applicable' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|explicit-only'
    });

    expect(result.isStale).toBe(true);
    expect(result.staleFields).toContain('truth_doc_hashes');
  });

  it('detects stale adapter set', () => {
    const result = checkAnchorStaleness({
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      currentAdapterSet: ['opencode', 'claude-code'],
      currentRepoState: { git_head: null, tree_status: 'clean-or-not-applicable' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|explicit-only'
    });

    expect(result.isStale).toBe(true);
    expect(result.staleFields).toContain('adapter_set');
  });

  it('detects stale repo state', () => {
    const result = checkAnchorStaleness({
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      currentAdapterSet: ['opencode'],
      currentRepoState: { git_head: 'newcommit', tree_status: 'dirty' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|explicit-only'
    });

    expect(result.isStale).toBe(true);
    expect(result.staleFields).toContain('repo_state');
  });

  it('detects stale instruction-surface hash', () => {
    const result = checkAnchorStaleness({
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      currentAdapterSet: ['opencode'],
      currentRepoState: { git_head: null, tree_status: 'clean-or-not-applicable' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|CLAUDE.md|explicit-only'
    });

    expect(result.isStale).toBe(true);
    expect(result.staleFields).toContain('instruction_surface_hash');
  });

  it('detects multiple stale fields at once', () => {
    const result = checkAnchorStaleness({
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:changed',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:alsochanged'
      },
      currentAdapterSet: ['opencode', 'claude-code'],
      currentRepoState: { git_head: 'abc', tree_status: 'dirty' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|CLAUDE.md|explicit-only'
    });

    expect(result.isStale).toBe(true);
    expect(result.staleFields).toContain('truth_doc_hashes');
    expect(result.staleFields).toContain('adapter_set');
    expect(result.staleFields).toContain('repo_state');
    expect(result.staleFields).toContain('instruction_surface_hash');
  });

  it('Section 10.4.1: treats approval as stale when anchor conflicts exist even without file write', () => {
    // The spec says: "If the finding conflicts with an approval anchor,
    // CodeLatch must treat the approval as stale even if no file write has happened yet."
    const result = checkAnchorStaleness({
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:different', // hash changed → anchor stale
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      currentAdapterSet: ['opencode'],
      currentRepoState: { git_head: null, tree_status: 'clean-or-not-applicable' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|explicit-only'
    });

    expect(result.isStale).toBe(true);
  });
});
