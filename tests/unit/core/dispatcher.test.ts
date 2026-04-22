import { describe, expect, it } from 'vitest';
import { dispatchCommand, type FsOps, type FsReadOps, type SyncInput } from '@codelatch/core';
import { CanonicalCommand, DriftClass, type BootstrapResult, type SyncResult } from '@codelatch/workflow-contracts';

const BOOTSTRAPPED_MANIFEST = JSON.stringify({
  project_id: 'test-project',
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

const BOOTSTRAPPED_REGISTRY = JSON.stringify({
  truth_docs: {
    prd: { path: 'product-docs/prd.md', version: '0.2.8', hash: 'sha256:abc123' },
    technical_design: { path: 'product-docs/technical-design.md', version: '0.2.15', hash: 'sha256:def456' },
    implementation_plan: { path: 'product-docs/implementation-plan.md', version: '0.1.2', hash: 'sha256:ghi789' }
  },
  updated_at: '2025-01-01T00:00:00.000Z'
});

const BOOTSTRAPPED_ANCHORS = JSON.stringify({
  truth_doc_hashes: {
    prd: 'sha256:abc123',
    technical_design: 'sha256:def456',
    implementation_plan: 'sha256:ghi789'
  },
  adapter_set: ['opencode'],
  repo_state: { git_head: 'abc1234', tree_status: 'clean' },
  instruction_surface_hash: 'isp:AGENTS.md|native-only',
  computed_at: '2025-01-01T00:00:00.000Z'
});

const createMockFs = (): { fs: FsOps; fsRead: FsReadOps; writtenFiles: Map<string, string>; createdDirs: string[] } => {
  const writtenFiles = new Map<string, string>();
  const createdDirs: string[] = [];

  return {
    fs: {
      mkdir: async (path: string) => { createdDirs.push(path); },
      writeFile: async (path: string, data: string) => { writtenFiles.set(path, data); }
    },
    fsRead: {
      exists: async () => false,
      readdir: async () => [],
      readFile: async () => ''
    },
    writtenFiles,
    createdDirs
  };
};

const createBootstrappedFs = (): { fs: FsOps; fsRead: FsReadOps; writtenFiles: Map<string, string>; createdDirs: string[] } => {
  const writtenFiles = new Map<string, string>();
  const createdDirs: string[] = [];
  const existingFiles = new Map<string, string>([
    ['/project/.tmp/codelatch/project-manifest.json', BOOTSTRAPPED_MANIFEST],
    ['/project/.tmp/codelatch/truth-doc-registry.json', BOOTSTRAPPED_REGISTRY],
    ['/project/.tmp/codelatch/anchors.json', BOOTSTRAPPED_ANCHORS]
  ]);

  return {
    fs: {
      mkdir: async (path: string) => { createdDirs.push(path); },
      writeFile: async (path: string, data: string) => { writtenFiles.set(path, data); }
    },
    fsRead: {
      exists: async (path: string) => existingFiles.has(path),
      readdir: async () => [],
      readFile: async (path: string) => existingFiles.get(path) ?? ''
    },
    writtenFiles,
    createdDirs
  };
};

describe('command dispatcher', () => {
  describe('bootstrap command', () => {
    it('dispatches bootstrap and returns a success result', async () => {
      const { fs, fsRead } = createMockFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.BOOTSTRAP },
        fs,
        {
          projectId: 'test-project',
          adapters: ['opencode'],
          profile: 'coding-development',
          truthDocPaths: {
            prd: 'product-docs/prd.md',
            technical_design: 'product-docs/technical-design.md',
            implementation_plan: 'product-docs/implementation-plan.md'
          },
          truthDocHashes: {
            prd: 'sha256:abc123',
            technical_design: 'sha256:def456',
            implementation_plan: 'sha256:ghi789'
          },
          truthDocVersions: {
            prd: '0.2.8',
            technical_design: '0.2.15',
            implementation_plan: '0.1.2'
          },
          repoState: { git_head: null, tree_status: 'clean-or-not-applicable' }
        },
        fsRead
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as BootstrapResult;
      expect(data.runtimeRoot).toBe('/project/.tmp/codelatch');
      expect(data.manifestPath).toBe('/project/.tmp/codelatch/project-manifest.json');
      expect(data.registryPath).toBe('/project/.tmp/codelatch/truth-doc-registry.json');
      expect(data.instructionSurfaces).toContain('AGENTS.md');
      expect(data.adapterSet).toEqual(['opencode']);
    });

    it('fails when bootstrap input is missing', async () => {
      const { fs, fsRead } = createMockFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.BOOTSTRAP },
        fs,
        undefined,
        fsRead
      );

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error).toContain('Bootstrap requires input parameters');
    });
  });

  describe('sync command', () => {
    it('fails when sync input is missing', async () => {
      const { fs, fsRead } = createBootstrappedFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead
      );

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error).toContain('Sync requires input parameters');
    });

    it('fails when manifest is not found', async () => {
      const { fs, fsRead } = createMockFs();

      const syncInput: SyncInput = {
        currentTruthDocHashes: {
          prd: 'sha256:abc123',
          technical_design: 'sha256:def456',
          implementation_plan: 'sha256:ghi789'
        },
        actualInstructionSurfaces: ['AGENTS.md'],
        currentAdapterSet: ['opencode'],
        currentRepoState: { git_head: 'abc1234', tree_status: 'clean' },
        currentInstructionSurfaceHash: 'isp:AGENTS.md|native-only'
      };

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead,
        syncInput
      );

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error).toContain('manifest not found');
    });

    it('fails when registry is not found', async () => {
      const writtenFiles = new Map<string, string>([
        ['/project/.tmp/codelatch/project-manifest.json', BOOTSTRAPPED_MANIFEST]
      ]);
      const createdDirs: string[] = [];

      const fs: FsOps = {
        mkdir: async (path: string) => { createdDirs.push(path); },
        writeFile: async (path: string, data: string) => { writtenFiles.set(path, data); }
      };
      const fsRead: FsReadOps = {
        exists: async (path: string) => writtenFiles.has(path),
        readdir: async () => [],
        readFile: async (path: string) => writtenFiles.get(path) ?? ''
      };

      const syncInput: SyncInput = {
        currentTruthDocHashes: {
          prd: 'sha256:abc123',
          technical_design: 'sha256:def456',
          implementation_plan: 'sha256:ghi789'
        },
        actualInstructionSurfaces: ['AGENTS.md'],
        currentAdapterSet: ['opencode'],
        currentRepoState: { git_head: 'abc1234', tree_status: 'clean' },
        currentInstructionSurfaceHash: 'isp:AGENTS.md|native-only'
      };

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead,
        syncInput
      );

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error).toContain('registry not found');
    });

    it('runs sync with no drift (Class 0) when anchors match', async () => {
      const { fs, fsRead } = createBootstrappedFs();

      const syncInput: SyncInput = {
        currentTruthDocHashes: {
          prd: 'sha256:abc123',
          technical_design: 'sha256:def456',
          implementation_plan: 'sha256:ghi789'
        },
        actualInstructionSurfaces: ['AGENTS.md'],
        currentAdapterSet: ['opencode'],
        currentRepoState: { git_head: 'abc1234', tree_status: 'clean' },
        currentInstructionSurfaceHash: 'isp:AGENTS.md|native-only'
      };

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead,
        syncInput
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as SyncResult;
      expect(data.highestDriftClass).toBe(DriftClass.CLASS_0);
      expect(data.requiresHardStop).toBe(false);
      expect(data.requiresRebrainstorm).toBe(false);
    });

    it('detects Class 2 drift when PRD hash changes', async () => {
      const { fs, fsRead } = createBootstrappedFs();

      const syncInput: SyncInput = {
        currentTruthDocHashes: {
          prd: 'sha256:CHANGED_PRD',
          technical_design: 'sha256:def456',
          implementation_plan: 'sha256:ghi789'
        },
        actualInstructionSurfaces: ['AGENTS.md'],
        currentAdapterSet: ['opencode'],
        currentRepoState: { git_head: 'abc1234', tree_status: 'clean' },
        currentInstructionSurfaceHash: 'isp:AGENTS.md|native-only'
      };

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead,
        syncInput
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as SyncResult;
      expect(data.highestDriftClass).toBe(DriftClass.CLASS_2);
      expect(data.requiresHardStop).toBe(true);
      expect(data.requiresRebrainstorm).toBe(true);
    });
  });

  describe('unimplemented commands', () => {
    it('returns not-yet-implemented for unknown commands', async () => {
      const { fs, fsRead } = createMockFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.PACK_CREATE },
        fs,
        undefined,
        fsRead
      );

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error).toContain('not yet implemented');
    });
  });
});
