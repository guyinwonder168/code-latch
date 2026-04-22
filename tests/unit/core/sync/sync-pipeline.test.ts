import { describe, expect, it } from 'vitest';
import { executeSyncPipeline } from '@codelatch/core';
import { DriftClass } from '@codelatch/workflow-contracts';
import type { AdapterId } from '@codelatch/schemas';

describe('sync pipeline', () => {
  const baseManifest = {
    project_id: 'test-project',
    framework_version: '0.1.0',
    runtime_root: '.tmp/codelatch',
    profile: 'coding-development',
    adapters: ['opencode'] as AdapterId[],
    instruction_surface_policy: {
      native_surfaces: ['AGENTS.md'],
      compatibility_surfaces: [],
      mirror_policy: 'explicit-only'
    },
    installed_procedural_bundles: {
      skills: ['official/core'],
      agents: ['official/core'],
      instructions: ['official/core'],
      host_integrations: ['official/core']
    },
    truth_docs: {
      prd: 'product-docs/prd.md',
      technical_design: 'product-docs/technical-design.md',
      implementation_plan: 'product-docs/implementation-plan.md'
    },
    installed_packs: [],
    created_at: '2026-04-21T00:00:00Z',
    updated_at: '2026-04-21T00:00:00Z'
  };

  const baseRegistry = {
    truth_docs: {
      prd: { path: 'product-docs/prd.md', version: '0.2.8', hash: 'sha256:abc123' },
      technical_design: { path: 'product-docs/technical-design.md', version: '0.2.15', hash: 'sha256:def456' },
      implementation_plan: { path: 'product-docs/implementation-plan.md', version: '0.1.2', hash: 'sha256:ghi789' }
    },
    updated_at: '2026-04-21T00:00:00Z'
  };

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

  it('returns no-drift result when everything matches', () => {
    const result = executeSyncPipeline({
      manifest: baseManifest,
      registry: baseRegistry,
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      actualInstructionSurfaces: ['AGENTS.md'],
      currentAdapterSet: ['opencode'],
      currentRepoState: { git_head: null, tree_status: 'clean-or-not-applicable' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|explicit-only'
    });

    expect(result.highestDriftClass).toBe(DriftClass.CLASS_0);
    expect(result.findings).toEqual([]);
    expect(result.requiresHardStop).toBe(false);
    expect(result.requiresRebrainstorm).toBe(false);
  });

  it('detects Class 0 drift and produces proposed writes', () => {
    const result = executeSyncPipeline({
      manifest: baseManifest,
      registry: {
        truth_docs: {
          prd: { path: 'docs/prd.md', version: '0.2.8', hash: 'sha256:abc123' },
          technical_design: { path: 'product-docs/technical-design.md', version: '0.2.15', hash: 'sha256:def456' },
          implementation_plan: { path: 'product-docs/implementation-plan.md', version: '0.1.2', hash: 'sha256:ghi789' }
        },
        updated_at: '2026-04-21T00:00:00Z'
      },
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      actualInstructionSurfaces: ['AGENTS.md'],
      currentAdapterSet: ['opencode'],
      currentRepoState: { git_head: null, tree_status: 'clean-or-not-applicable' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|explicit-only'
    });

    expect(result.highestDriftClass).toBe(DriftClass.CLASS_0);
    expect(result.proposedWrites.length).toBeGreaterThan(0);
    expect(result.proposedWrites.every(w => w.driftClass === DriftClass.CLASS_0)).toBe(true);
    expect(result.requiresHardStop).toBe(false);
  });

  it('detects Class 1 drift and stops with no proposed writes', () => {
    const result = executeSyncPipeline({
      manifest: baseManifest,
      registry: baseRegistry,
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:tdchanged',
        implementation_plan: 'sha256:ghi789'
      },
      actualInstructionSurfaces: ['AGENTS.md'],
      currentAdapterSet: ['opencode'],
      currentRepoState: { git_head: null, tree_status: 'clean-or-not-applicable' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|explicit-only'
    });

    expect(result.highestDriftClass).toBe(DriftClass.CLASS_1);
    expect(result.requiresHardStop).toBe(true);
    expect(result.requiresRebrainstorm).toBe(false);
    // Class 1 findings do not auto-generate proposed writes
    const class1Writes = result.proposedWrites.filter(w => w.driftClass === DriftClass.CLASS_1);
    expect(class1Writes.length).toBe(0);
  });

  it('detects Class 2 drift and requires re-brainstorm', () => {
    const result = executeSyncPipeline({
      manifest: baseManifest,
      registry: baseRegistry,
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:prdchanged',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      actualInstructionSurfaces: ['AGENTS.md'],
      currentAdapterSet: ['opencode'],
      currentRepoState: { git_head: null, tree_status: 'clean-or-not-applicable' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|explicit-only'
    });

    expect(result.highestDriftClass).toBe(DriftClass.CLASS_2);
    expect(result.requiresHardStop).toBe(true);
    expect(result.requiresRebrainstorm).toBe(true);
  });

  it('detects stale anchors alongside drift', () => {
    const result = executeSyncPipeline({
      manifest: baseManifest,
      registry: baseRegistry,
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:prdchanged',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      actualInstructionSurfaces: ['AGENTS.md'],
      currentAdapterSet: ['opencode'],
      currentRepoState: { git_head: 'abc', tree_status: 'dirty' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|explicit-only'
    });

    expect(result.anchorStaleness.isStale).toBe(true);
    expect(result.anchorStaleness.staleFields).toContain('truth_doc_hashes');
    expect(result.anchorStaleness.staleFields).toContain('repo_state');
  });

  it('validates instruction surfaces against the policy', () => {
    const result = executeSyncPipeline({
      manifest: baseManifest,
      registry: baseRegistry,
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      actualInstructionSurfaces: [], // AGENTS.md missing
      currentAdapterSet: ['opencode'],
      currentRepoState: { git_head: null, tree_status: 'clean-or-not-applicable' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|explicit-only'
    });

    expect(result.surfaceValidation.valid).toBe(false);
    expect(result.surfaceValidation.missing).toContain('AGENTS.md');
    expect(result.findings.some(f => f.kind === 'missing-instruction-surface')).toBe(true);
  });

  it('materializes sync report when findings exist', () => {
    const result = executeSyncPipeline({
      manifest: baseManifest,
      registry: baseRegistry,
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:prdchanged',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      actualInstructionSurfaces: ['AGENTS.md'],
      currentAdapterSet: ['opencode'],
      currentRepoState: { git_head: null, tree_status: 'clean-or-not-applicable' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|explicit-only'
    });

    expect(result.reportMaterialized).toBe(true);
    expect(result.reportPath).toBeDefined();
    expect(result.reportPath).toContain('.tmp/codelatch/sync/');
  });

  it('does NOT materialize report when no findings', () => {
    const result = executeSyncPipeline({
      manifest: baseManifest,
      registry: baseRegistry,
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      actualInstructionSurfaces: ['AGENTS.md'],
      currentAdapterSet: ['opencode'],
      currentRepoState: { git_head: null, tree_status: 'clean-or-not-applicable' },
      currentInstructionSurfaceHash: 'isp:AGENTS.md|explicit-only'
    });

    expect(result.reportMaterialized).toBe(false);
    expect(result.reportPath).toBeUndefined();
  });
});
