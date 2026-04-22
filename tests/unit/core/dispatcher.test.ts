import { describe, expect, it } from 'vitest';
import { dispatchCommand, type FsOps, type FsReadOps, type SyncInput, type AuditInput } from '@codelatch/core';
import {
  CanonicalCommand,
  DriftClass,
  type BootstrapResult,
  type SyncResult,
  type AuditResult,
  type PackCreateResult,
  type LearnResult,
  type CleanResult,
  type PromoteResult
} from '@codelatch/workflow-contracts';

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

  describe('audit command', () => {
    it('fails when audit input is missing', async () => {
      const { fs, fsRead } = createBootstrappedFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.AUDIT },
        fs,
        undefined,
        fsRead
      );

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error).toContain('Audit requires input parameters');
    });

    it('fails when manifest is not found', async () => {
      const { fs, fsRead } = createMockFs();

      const auditInput: AuditInput = {
        inspectTruthDocs: true,
        inspectPacks: true,
        inspectSchemaHealth: true,
        inspectAdapterAlignment: true,
        inspectIncidents: true
      };

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.AUDIT },
        fs,
        undefined,
        fsRead,
        undefined,
        auditInput
      );

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error).toContain('manifest not found');
    });

    it('runs audit and returns findings on a bootstrapped project', async () => {
      const { fs, fsRead } = createBootstrappedFs();

      const auditInput: AuditInput = {
        inspectTruthDocs: true,
        inspectPacks: true,
        inspectSchemaHealth: true,
        inspectAdapterAlignment: true,
        inspectIncidents: true
      };

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.AUDIT },
        fs,
        undefined,
        fsRead,
        undefined,
        auditInput
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as AuditResult;
      expect(data.findings).toBeDefined();
      expect(data.riskScore).toBeGreaterThanOrEqual(0);
      // reportMaterialized depends on whether findings exist;
      // the mock fs has no incidents directory, so a low-severity finding is generated
      expect(data.reportMaterialized).toBe(data.findings.length > 0 && data.riskScore > 0);
    });
  });

  describe('pack-create command', () => {
    it('fails when pack-create input is missing', async () => {
      const { fs, fsRead } = createBootstrappedFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.PACK_CREATE },
        fs,
        undefined,
        fsRead
      );

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error).toContain('Pack-create requires input parameters');
    });

    it('creates a project pack on a bootstrapped project', async () => {
      const { fs, fsRead } = createBootstrappedFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.PACK_CREATE },
        fs,
        undefined,
        fsRead,
        undefined,
        undefined,
        { packName: 'test-pack', scope: 'project', purpose: 'testing' }
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as PackCreateResult;
      expect(data.packName).toBe('test-pack');
      expect(data.scope).toBe('project');
      expect(data.registered).toBe(true);
    });
  });

  describe('learn command', () => {
    it('fails when learn input is missing', async () => {
      const { fs, fsRead } = createBootstrappedFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.LEARN },
        fs,
        undefined,
        fsRead
      );

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error).toContain('Learn requires input parameters');
    });

    it('runs learn on a bootstrapped project', async () => {
      const { fs, fsRead } = createBootstrappedFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.LEARN },
        fs,
        undefined,
        fsRead,
        undefined,
        undefined,
        undefined,
        { scanIncidents: true, maxCandidates: 5 }
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as LearnResult;
      expect(data.incidentsScanned).toBeGreaterThanOrEqual(0);
      expect(data.candidates).toBeDefined();
    });
  });

  describe('clean command', () => {
    it('fails when clean input is missing', async () => {
      const { fs, fsRead } = createBootstrappedFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.CLEAN },
        fs,
        undefined,
        fsRead
      );

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error).toContain('Clean requires input parameters');
    });

    it('runs clean on a bootstrapped project', async () => {
      const { fs, fsRead, writtenFiles } = createBootstrappedFs();

      // Write a reconstructible artifact
      await fs.writeFile('/project/.tmp/codelatch/sync/sync_report_123.md', '# Sync Report');

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.CLEAN },
        fs,
        undefined,
        fsRead,
        undefined,
        undefined,
        undefined,
        undefined,
        { targets: ['sync'], dryRun: false }
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as CleanResult;
      expect(data.itemsEnumerated).toBeGreaterThanOrEqual(0);
      expect(data.reportPath).toBeDefined();
    });
  });

  describe('promote command', () => {
    it('fails when promote input is missing', async () => {
      const { fs, fsRead } = createBootstrappedFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.PROMOTE },
        fs,
        undefined,
        fsRead
      );

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error).toContain('Promote requires input parameters');
    });

    it('runs promote on a bootstrapped project', async () => {
      const { fs, fsRead } = createBootstrappedFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.PROMOTE },
        fs,
        undefined,
        fsRead,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        { compareWithGlobal: true, maxCandidates: 3 }
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as PromoteResult;
      expect(data.lessonsLoaded).toBeGreaterThanOrEqual(0);
      expect(data.candidates).toBeDefined();
    });
  });

  describe('unimplemented commands', () => {
    it('returns not-yet-implemented for truly unknown commands', async () => {
      const { fs, fsRead } = createMockFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: 'codelatch-unknown' as CanonicalCommand },
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
