import { describe, expect, it } from 'vitest';
import { buildDriftInputs } from '@codelatch/core';
import type { AdapterId } from '@codelatch/schemas';

describe('drift-inputs builder', () => {
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

  it('builds drift inputs from manifest, registry, and anchors', () => {
    const inputs = buildDriftInputs({
      manifest: baseManifest,
      registry: baseRegistry,
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      currentAdapterSet: ['opencode'] as AdapterId[],
      actualInstructionSurfaces: ['AGENTS.md']
    });

    expect(inputs.truthDocRegistry).toEqual(baseRegistry.truth_docs);
    expect(inputs.manifestTruthDocPaths).toEqual(baseManifest.truth_docs);
    expect(inputs.anchors).toEqual(baseAnchors);
    expect(inputs.currentTruthDocHashes.prd).toBe('sha256:abc123');
    expect(inputs.actualInstructionSurfaces).toEqual(['AGENTS.md']);
  });

  it('captures the manifest instruction-surface policy', () => {
    const inputs = buildDriftInputs({
      manifest: baseManifest,
      registry: baseRegistry,
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      currentAdapterSet: ['opencode'] as AdapterId[],
      actualInstructionSurfaces: ['AGENTS.md']
    });

    expect(inputs.instructionSurfacePolicy.native_surfaces).toEqual(['AGENTS.md']);
    expect(inputs.instructionSurfacePolicy.mirror_policy).toBe('explicit-only');
  });

  it('captures the current adapter set', () => {
    const inputs = buildDriftInputs({
      manifest: baseManifest,
      registry: baseRegistry,
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      currentAdapterSet: ['opencode'] as AdapterId[],
      actualInstructionSurfaces: ['AGENTS.md']
    });

    expect(inputs.adapterSet).toEqual(['opencode']);
  });

  it('uses current adapter set (not anchor adapter set) for drift detection', () => {
    const inputs = buildDriftInputs({
      manifest: baseManifest,
      registry: baseRegistry,
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      currentAdapterSet: ['opencode', 'claude-code'] as AdapterId[],
      actualInstructionSurfaces: ['AGENTS.md']
    });

    // adapterSet should reflect current state, not anchor state
    expect(inputs.adapterSet).toEqual(['opencode', 'claude-code']);
  });

  it('accepts optional changedFiles and diffSummary', () => {
    const inputs = buildDriftInputs({
      manifest: baseManifest,
      registry: baseRegistry,
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      currentAdapterSet: ['opencode'] as AdapterId[],
      actualInstructionSurfaces: ['AGENTS.md'],
      changedFiles: ['packages/core/src/sync/drift-classifier.ts'],
      diffSummary: 'added drift-classifier module'
    });

    expect(inputs.changedFiles).toEqual(['packages/core/src/sync/drift-classifier.ts']);
    expect(inputs.diffSummary).toBe('added drift-classifier module');
  });

  it('defaults changedFiles and diffSummary to undefined', () => {
    const inputs = buildDriftInputs({
      manifest: baseManifest,
      registry: baseRegistry,
      anchors: baseAnchors,
      currentTruthDocHashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      currentAdapterSet: ['opencode'] as AdapterId[],
      actualInstructionSurfaces: ['AGENTS.md']
    });

    expect(inputs.changedFiles).toBeUndefined();
    expect(inputs.diffSummary).toBeUndefined();
  });
});
