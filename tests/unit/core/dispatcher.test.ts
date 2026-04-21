import { describe, expect, it } from 'vitest';
import { dispatchCommand, type FsOps, type FsReadOps } from '@codelatch/core';
import { CanonicalCommand } from '@codelatch/workflow-contracts';

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
      readdir: async () => []
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
      expect(result.data!.runtimeRoot).toBe('/project/.tmp/codelatch');
      expect(result.data!.manifestPath).toBe('/project/.tmp/codelatch/project-manifest.json');
      expect(result.data!.registryPath).toBe('/project/.tmp/codelatch/truth-doc-registry.json');
      expect(result.data!.instructionSurfaces).toContain('AGENTS.md');
      expect(result.data!.adapterSet).toEqual(['opencode']);
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

  describe('unimplemented commands', () => {
    it('returns not-yet-implemented for sync', async () => {
      const { fs, fsRead } = createMockFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.SYNC },
        fs,
        undefined,
        fsRead
      );

      expect(result.success).toBe(false);
    });
  });
});
