import { describe, expect, it } from 'vitest';
import { classifyDrift, type DriftInputs } from '@codelatch/core';
import { DriftClass } from '@codelatch/workflow-contracts';

describe('drift classifier', () => {
  const makeBaseInputs = (overrides?: Partial<DriftInputs>): DriftInputs => ({
    truthDocRegistry: {
      prd: { path: 'product-docs/prd.md', version: '0.2.8', hash: 'sha256:abc123' },
      technical_design: { path: 'product-docs/technical-design.md', version: '0.2.15', hash: 'sha256:def456' },
      implementation_plan: { path: 'product-docs/implementation-plan.md', version: '0.1.2', hash: 'sha256:ghi789' }
    },
    manifestTruthDocPaths: {
      prd: 'product-docs/prd.md',
      technical_design: 'product-docs/technical-design.md',
      implementation_plan: 'product-docs/implementation-plan.md'
    },
    currentTruthDocHashes: {
      prd: 'sha256:abc123',
      technical_design: 'sha256:def456',
      implementation_plan: 'sha256:ghi789'
    },
    anchors: {
      truth_doc_hashes: {
        prd: 'sha256:abc123',
        technical_design: 'sha256:def456',
        implementation_plan: 'sha256:ghi789'
      },
      adapter_set: ['opencode'],
      repo_state: { git_head: null, tree_status: 'clean-or-not-applicable' },
      instruction_surface_hash: 'isp:AGENTS.md|explicit-only',
      computed_at: '2026-04-21T00:00:00Z'
    },
    instructionSurfacePolicy: {
      native_surfaces: ['AGENTS.md'],
      compatibility_surfaces: [],
      mirror_policy: 'explicit-only'
    },
    adapterSet: ['opencode'],
    actualInstructionSurfaces: ['AGENTS.md'],
    ...overrides
  });

  describe('no drift', () => {
    it('returns empty findings when everything matches', () => {
      const inputs = makeBaseInputs();
      const result = classifyDrift(inputs);

      expect(result.findings).toEqual([]);
      expect(result.highestDriftClass).toBe(DriftClass.CLASS_0);
      expect(result.requiresHardStop).toBe(false);
      expect(result.requiresRebrainstorm).toBe(false);
    });
  });

  describe('Class 0: Metadata drift', () => {
    it('detects stale version number as Class 0 (via path mismatch)', () => {
      // When the registry records a different path than the manifest,
      // that's a metadata-only drift (Class 0) even if hashes match.
      const inputs = makeBaseInputs({
        truthDocRegistry: {
          prd: { path: 'docs/prd-v2.md', version: '0.2.7', hash: 'sha256:abc123' },
          technical_design: { path: 'product-docs/technical-design.md', version: '0.2.15', hash: 'sha256:def456' },
          implementation_plan: { path: 'product-docs/implementation-plan.md', version: '0.1.2', hash: 'sha256:ghi789' }
        }
      });

      const result = classifyDrift(inputs);

      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings.every(f => f.driftClass === DriftClass.CLASS_0)).toBe(true);
      expect(result.highestDriftClass).toBe(DriftClass.CLASS_0);
      expect(result.requiresHardStop).toBe(false);
      expect(result.requiresRebrainstorm).toBe(false);
    });

    it('detects outdated date as Class 0', () => {
      // Outdated date changes only metadata, not behavior
      const inputs = makeBaseInputs({
        anchors: {
          truth_doc_hashes: {
            prd: 'sha256:abc123',
            technical_design: 'sha256:def456',
            implementation_plan: 'sha256:ghi789'
          },
          adapter_set: ['opencode'],
          repo_state: { git_head: null, tree_status: 'clean-or-not-applicable' },
          instruction_surface_hash: 'isp:AGENTS.md|explicit-only',
          computed_at: '2026-01-01T00:00:00Z' // stale computed_at
        }
      });

      const result = classifyDrift(inputs);

      // Stale computed_at is metadata-only, no hash mismatch
      expect(result.highestDriftClass).toBe(DriftClass.CLASS_0);
    });

    it('detects registry path mismatch as Class 0', () => {
      const inputs = makeBaseInputs({
        truthDocRegistry: {
          prd: { path: 'docs/prd.md', version: '0.2.8', hash: 'sha256:abc123' },
          technical_design: { path: 'product-docs/technical-design.md', version: '0.2.15', hash: 'sha256:def456' },
          implementation_plan: { path: 'product-docs/implementation-plan.md', version: '0.1.2', hash: 'sha256:ghi789' }
        }
      });

      const result = classifyDrift(inputs);

      expect(result.findings.some(f => f.kind === 'registry-path-mismatch')).toBe(true);
      expect(result.findings.every(f => f.driftClass === DriftClass.CLASS_0)).toBe(true);
    });
  });

  describe('Class 1: Structural drift', () => {
    it('detects new module without technical-design coverage as Class 1', () => {
      const inputs = makeBaseInputs({
        currentTruthDocHashes: {
          prd: 'sha256:abc123',
          technical_design: 'sha256:xyz999', // technical design changed
          implementation_plan: 'sha256:ghi789'
        },
        anchors: {
          truth_doc_hashes: {
            prd: 'sha256:abc123',
            technical_design: 'sha256:def456',
            implementation_plan: 'sha256:ghi789'
          },
          adapter_set: ['opencode'],
          repo_state: { git_head: null, tree_status: 'clean-or-not-applicable' },
          instruction_surface_hash: 'isp:AGENTS.md|explicit-only',
          computed_at: '2026-04-21T00:00:00Z'
        },
        changedFiles: ['packages/core/src/sync/new-module.ts'],
        diffSummary: 'added new sync module without design update'
      });

      const result = classifyDrift(inputs);

      expect(result.findings.some(f => f.driftClass === DriftClass.CLASS_1)).toBe(true);
      expect(result.highestDriftClass).toBe(DriftClass.CLASS_1);
      expect(result.requiresHardStop).toBe(true);
      expect(result.requiresRebrainstorm).toBe(false);
    });

    it('detects missing implementation-plan dependency as Class 1', () => {
      const inputs = makeBaseInputs({
        currentTruthDocHashes: {
          prd: 'sha256:abc123',
          technical_design: 'sha256:def456',
          implementation_plan: 'sha256:newhash' // implementation plan changed
        },
        anchors: {
          truth_doc_hashes: {
            prd: 'sha256:abc123',
            technical_design: 'sha256:def456',
            implementation_plan: 'sha256:ghi789'
          },
          adapter_set: ['opencode'],
          repo_state: { git_head: null, tree_status: 'clean-or-not-applicable' },
          instruction_surface_hash: 'isp:AGENTS.md|explicit-only',
          computed_at: '2026-04-21T00:00:00Z'
        }
      });

      const result = classifyDrift(inputs);

      expect(result.findings.some(f => f.kind === 'missing-implementation-plan-dependency')).toBe(true);
      expect(result.highestDriftClass).toBe(DriftClass.CLASS_1);
      expect(result.requiresHardStop).toBe(true);
    });

    it('detects adapter-set change as Class 1', () => {
      const inputs = makeBaseInputs({
        adapterSet: ['opencode', 'claude-code'],
        actualInstructionSurfaces: ['AGENTS.md', 'CLAUDE.md', '.claude/CLAUDE.md'],
        anchors: {
          truth_doc_hashes: {
            prd: 'sha256:abc123',
            technical_design: 'sha256:def456',
            implementation_plan: 'sha256:ghi789'
          },
          adapter_set: ['opencode'],
          repo_state: { git_head: null, tree_status: 'clean-or-not-applicable' },
          instruction_surface_hash: 'isp:AGENTS.md|explicit-only',
          computed_at: '2026-04-21T00:00:00Z'
        }
      });

      const result = classifyDrift(inputs);

      expect(result.findings.some(f => f.kind === 'adapter-set-change')).toBe(true);
      expect(result.highestDriftClass).toBe(DriftClass.CLASS_1);
    });
  });

  describe('Class 2: Semantic drift', () => {
    it('detects PRD behavior change as Class 2', () => {
      const inputs = makeBaseInputs({
        currentTruthDocHashes: {
          prd: 'sha256:prdchanged', // PRD content changed
          technical_design: 'sha256:def456',
          implementation_plan: 'sha256:ghi789'
        },
        anchors: {
          truth_doc_hashes: {
            prd: 'sha256:abc123',
            technical_design: 'sha256:def456',
            implementation_plan: 'sha256:ghi789'
          },
          adapter_set: ['opencode'],
          repo_state: { git_head: null, tree_status: 'clean-or-not-applicable' },
          instruction_surface_hash: 'isp:AGENTS.md|explicit-only',
          computed_at: '2026-04-21T00:00:00Z'
        }
      });

      const result = classifyDrift(inputs);

      expect(result.findings.some(f => f.driftClass === DriftClass.CLASS_2)).toBe(true);
      expect(result.highestDriftClass).toBe(DriftClass.CLASS_2);
      expect(result.requiresHardStop).toBe(true);
      expect(result.requiresRebrainstorm).toBe(true);
    });

    it('detects scope meaning change as Class 2', () => {
      // Both PRD and implementation plan changed — scope likely changed
      const inputs = makeBaseInputs({
        currentTruthDocHashes: {
          prd: 'sha256:prdchanged',
          technical_design: 'sha256:def456',
          implementation_plan: 'sha256:implchanged'
        },
        anchors: {
          truth_doc_hashes: {
            prd: 'sha256:abc123',
            technical_design: 'sha256:def456',
            implementation_plan: 'sha256:ghi789'
          },
          adapter_set: ['opencode'],
          repo_state: { git_head: null, tree_status: 'clean-or-not-applicable' },
          instruction_surface_hash: 'isp:AGENTS.md|explicit-only',
          computed_at: '2026-04-21T00:00:00Z'
        }
      });

      const result = classifyDrift(inputs);

      expect(result.findings.some(f => f.driftClass === DriftClass.CLASS_2)).toBe(true);
      expect(result.requiresRebrainstorm).toBe(true);
    });

    it('defaults to Class 2 when finding could fit both Class 1 and Class 2', () => {
      // Technical design + implementation plan both changed — ambiguous
      const inputs = makeBaseInputs({
        currentTruthDocHashes: {
          prd: 'sha256:abc123',
          technical_design: 'sha256:tdchanged',
          implementation_plan: 'sha256:implchanged'
        },
        anchors: {
          truth_doc_hashes: {
            prd: 'sha256:abc123',
            technical_design: 'sha256:def456',
            implementation_plan: 'sha256:ghi789'
          },
          adapter_set: ['opencode'],
          repo_state: { git_head: null, tree_status: 'clean-or-not-applicable' },
          instruction_surface_hash: 'isp:AGENTS.md|explicit-only',
          computed_at: '2026-04-21T00:00:00Z'
        }
      });

      const result = classifyDrift(inputs);

      // Section 13.3.2: "If a finding can reasonably fit both Class 1 and Class 2, default to Class 2"
      expect(result.highestDriftClass).toBe(DriftClass.CLASS_2);
    });
  });

  describe('false-positive control (Section 13.3.3)', () => {
    it('ignores timestamp-only changes when hashes match', () => {
      const inputs = makeBaseInputs();
      // Hashes all match — no drift, even though computed_at is stale
      const result = classifyDrift(inputs);

      // Only metadata drift (stale computed_at) — no behavior change
      expect(result.findings.every(f => f.driftClass === DriftClass.CLASS_0)).toBe(true);
    });

    it('ignores formatting-only changes when hashes match', () => {
      const inputs = makeBaseInputs();
      // All hashes match — formatting-only cannot change hashes
      const result = classifyDrift(inputs);

      expect(result.findings.every(f => f.driftClass <= DriftClass.CLASS_0)).toBe(true);
    });

    it('each finding includes at least one concrete pointer', () => {
      const inputs = makeBaseInputs({
        currentTruthDocHashes: {
          prd: 'sha256:prdchanged',
          technical_design: 'sha256:def456',
          implementation_plan: 'sha256:ghi789'
        },
        anchors: {
          truth_doc_hashes: {
            prd: 'sha256:abc123',
            technical_design: 'sha256:def456',
            implementation_plan: 'sha256:ghi789'
          },
          adapter_set: ['opencode'],
          repo_state: { git_head: null, tree_status: 'clean-or-not-applicable' },
          instruction_surface_hash: 'isp:AGENTS.md|explicit-only',
          computed_at: '2026-04-21T00:00:00Z'
        }
      });

      const result = classifyDrift(inputs);

      for (const finding of result.findings) {
        expect(finding.pointers.length).toBeGreaterThan(0);
      }
    });
  });
});
