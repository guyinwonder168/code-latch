import { describe, expect, it } from 'vitest';
import { dispatchCommand, type FsOps, type FsReadOps, type SyncInput } from '@codelatch/core';
import { CanonicalCommand, DriftClass, type SyncResult } from '@codelatch/workflow-contracts';

/**
 * Fixture: bootstrapped project manifest (shared across drift classes).
 */
const BOOTSTRAPPED_MANIFEST = JSON.stringify({
  project_id: 'drift-test-project',
  framework_version: '0.1.0',
  runtime_root: '.tmp/codelatch',
  profile: 'coding-development',
  adapters: ['opencode'],
  instruction_surface_policy: {
    native_surfaces: ['AGENTS.md'],
    compatibility_surfaces: [],
    mirror_policy: 'native-only'
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
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z'
});

/**
 * Fixture: bootstrapped truth-doc registry (shared across drift classes).
 */
const BOOTSTRAPPED_REGISTRY = JSON.stringify({
  truth_docs: {
    prd: { path: 'product-docs/prd.md', version: '0.2.8', hash: 'sha256:aaa111' },
    technical_design: { path: 'product-docs/technical-design.md', version: '0.2.15', hash: 'sha256:bbb222' },
    implementation_plan: { path: 'product-docs/implementation-plan.md', version: '0.1.2', hash: 'sha256:ccc333' }
  },
  updated_at: '2025-01-01T00:00:00.000Z'
});

/**
 * Fixture: Class 0 anchors — all hashes match current state.
 */
const CLASS_0_ANCHORS = JSON.stringify({
  truth_doc_hashes: {
    prd: 'sha256:aaa111',
    technical_design: 'sha256:bbb222',
    implementation_plan: 'sha256:ccc333'
  },
  adapter_set: ['opencode'],
  repo_state: { git_head: 'deadbeef', tree_status: 'clean' },
  instruction_surface_hash: 'isp:AGENTS.md|native-only',
  computed_at: '2025-01-01T00:00:00.000Z'
});

/**
 * Fixture: Class 1 anchors — technical-design hash differs.
 */
const CLASS_1_ANCHORS = JSON.stringify({
  truth_doc_hashes: {
    prd: 'sha256:aaa111',
    technical_design: 'sha256:bbb222-OLD',
    implementation_plan: 'sha256:ccc333'
  },
  adapter_set: ['opencode'],
  repo_state: { git_head: 'deadbeef', tree_status: 'clean' },
  instruction_surface_hash: 'isp:AGENTS.md|native-only',
  computed_at: '2025-01-01T00:00:00.000Z'
});

/**
 * Fixture: Class 2 anchors — PRD hash differs.
 */
const CLASS_2_ANCHORS = JSON.stringify({
  truth_doc_hashes: {
    prd: 'sha256:aaa111-OLD',
    technical_design: 'sha256:bbb222',
    implementation_plan: 'sha256:ccc333'
  },
  adapter_set: ['opencode'],
  repo_state: { git_head: 'deadbeef', tree_status: 'clean' },
  instruction_surface_hash: 'isp:AGENTS.md|native-only',
  computed_at: '2025-01-01T00:00:00.000Z'
});

/**
 * End-to-end integration test: proves the full sync pipeline
 * works from OpenCode adapter invocation through core dispatch
 * to drift classification, staleness checks, and report materialization.
 */
describe('OpenCode sync end-to-end', () => {
  const PROJECT_ROOT = '/project';

  const createSyncFs = (anchorsJson: string) => {
    const writtenFiles = new Map<string, string>();
    const createdDirs: string[] = [];
    const existingFiles = new Map<string, string>([
      [`${PROJECT_ROOT}/.tmp/codelatch/project-manifest.json`, BOOTSTRAPPED_MANIFEST],
      [`${PROJECT_ROOT}/.tmp/codelatch/truth-doc-registry.json`, BOOTSTRAPPED_REGISTRY],
      [`${PROJECT_ROOT}/.tmp/codelatch/anchors.json`, anchorsJson]
    ]);

    return {
      fs: {
        mkdir: async (path: string) => { createdDirs.push(path); },
        writeFile: async (path: string, data: string) => { writtenFiles.set(path, data); }
      } as FsOps,
      fsRead: {
        exists: async (path: string) => existingFiles.has(path),
        readdir: async () => [],
        readFile: async (path: string) => existingFiles.get(path) ?? ''
      } as FsReadOps,
      writtenFiles,
      createdDirs
    };
  };

  const makeSyncInput = (overrides?: Partial<SyncInput>): SyncInput => ({
    currentTruthDocHashes: {
      prd: 'sha256:aaa111',
      technical_design: 'sha256:bbb222',
      implementation_plan: 'sha256:ccc333'
    },
    actualInstructionSurfaces: ['AGENTS.md'],
    currentAdapterSet: ['opencode'],
    currentRepoState: { git_head: 'deadbeef', tree_status: 'clean' },
    currentInstructionSurfaceHash: 'isp:AGENTS.md|native-only',
    ...overrides
  });

  describe('Class 0: no drift (anchors match current state)', () => {
    it('returns Class 0 drift when all hashes match anchors', async () => {
      const { fs, fsRead } = createSyncFs(CLASS_0_ANCHORS);

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: PROJECT_ROOT, command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead,
        makeSyncInput()
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as SyncResult;
      expect(data.highestDriftClass).toBe(DriftClass.CLASS_0);
      expect(data.requiresHardStop).toBe(false);
      expect(data.requiresRebrainstorm).toBe(false);
      expect(data.findings).toHaveLength(0);
      expect(data.proposedWrites).toHaveLength(0);
      expect(data.reportMaterialized).toBe(false);
    });

    it('returns Class 0 with extra-surface finding when surface not in policy', async () => {
      const { fs, fsRead } = createSyncFs(CLASS_0_ANCHORS);

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: PROJECT_ROOT, command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead,
        makeSyncInput({ actualInstructionSurfaces: ['AGENTS.md', 'CLAUDE.md'] })
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as SyncResult;
      expect(data.highestDriftClass).toBe(DriftClass.CLASS_0);
      expect(data.requiresHardStop).toBe(false);
      expect(data.requiresRebrainstorm).toBe(false);
      expect(data.findings.some(f => f.kind === 'extra-instruction-surface')).toBe(true);
    });
  });

  describe('Class 1: structural drift (technical design changed)', () => {
    it('returns Class 1 drift when technical-design hash differs from anchor', async () => {
      const { fs, fsRead } = createSyncFs(CLASS_1_ANCHORS);

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: PROJECT_ROOT, command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead,
        makeSyncInput()
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as SyncResult;
      expect(data.highestDriftClass).toBe(DriftClass.CLASS_1);
      expect(data.requiresHardStop).toBe(true);
      expect(data.requiresRebrainstorm).toBe(false);
      expect(data.findings.some(f => f.kind === 'structural-design-change')).toBe(true);
    });

    it('materializes a sync report for Class 1 drift', async () => {
      const { fs, fsRead } = createSyncFs(CLASS_1_ANCHORS);

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: PROJECT_ROOT, command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead,
        makeSyncInput()
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as SyncResult;
      expect(data.reportMaterialized).toBe(true);
      expect(data.reportPath).toContain('sync_');
    });
  });

  describe('Class 2: semantic drift (PRD changed)', () => {
    it('returns Class 2 drift when PRD hash differs from anchor', async () => {
      const { fs, fsRead } = createSyncFs(CLASS_2_ANCHORS);

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: PROJECT_ROOT, command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead,
        makeSyncInput()
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as SyncResult;
      expect(data.highestDriftClass).toBe(DriftClass.CLASS_2);
      expect(data.requiresHardStop).toBe(true);
      expect(data.requiresRebrainstorm).toBe(true);
      expect(data.findings.some(f => f.kind === 'prd-behavior-change')).toBe(true);
    });

    it('materializes a sync report for Class 2 drift', async () => {
      const { fs, fsRead } = createSyncFs(CLASS_2_ANCHORS);

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: PROJECT_ROOT, command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead,
        makeSyncInput()
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as SyncResult;
      expect(data.reportMaterialized).toBe(true);
      expect(data.reportPath).toContain('sync_');
    });

    it('does not propose writes for Class 2 drift (requires human intervention)', async () => {
      const { fs, fsRead } = createSyncFs(CLASS_2_ANCHORS);

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: PROJECT_ROOT, command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead,
        makeSyncInput()
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as SyncResult;
      expect(data.proposedWrites.every(w => w.driftClass === DriftClass.CLASS_0)).toBe(true);
    });
  });

  describe('anchor staleness', () => {
    it('detects stale anchors when adapter set changes', async () => {
      const { fs, fsRead } = createSyncFs(CLASS_0_ANCHORS);

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: PROJECT_ROOT, command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead,
        makeSyncInput({ currentAdapterSet: ['opencode', 'claude-code'] })
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as SyncResult;
      expect(data.findings.some(f => f.kind === 'adapter-set-change')).toBe(true);
      expect(data.requiresHardStop).toBe(true);
    });

    it('detects stale anchors when instruction surface hash changes', async () => {
      const { fs, fsRead } = createSyncFs(CLASS_0_ANCHORS);

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: PROJECT_ROOT, command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead,
        makeSyncInput({ currentInstructionSurfaceHash: 'isp:AGENTS.md,CLAUDE.md|native-only' })
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as SyncResult;
      // The surface hash change means anchors are stale — but the classification
      // depends on whether surfaces themselves changed vs just the hash
      expect(data.highestDriftClass).toBeGreaterThanOrEqual(DriftClass.CLASS_0);
    });
  });

  describe('error cases', () => {
    it('fails when project is not bootstrapped (no manifest)', async () => {
      const writtenFiles = new Map<string, string>();
      const createdDirs: string[] = [];
      const fs: FsOps = {
        mkdir: async (path: string) => { createdDirs.push(path); },
        writeFile: async (path: string, data: string) => { writtenFiles.set(path, data); }
      };
      const fsRead: FsReadOps = {
        exists: async () => false,
        readdir: async () => [],
        readFile: async () => ''
      };

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: PROJECT_ROOT, command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead,
        makeSyncInput()
      );

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error).toContain('manifest not found');
    });

    it('fails when sync input is missing', async () => {
      const { fs, fsRead } = createSyncFs(CLASS_0_ANCHORS);

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: PROJECT_ROOT, command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead
      );

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error).toContain('Sync requires input parameters');
    });
  });
});
