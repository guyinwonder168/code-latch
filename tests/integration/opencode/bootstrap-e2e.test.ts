import { describe, expect, it } from 'vitest';
import { dispatchCommand, type FsOps, type FsReadOps } from '@codelatch/core';
import { renderAgentsMd, renderAdapterJson, OPEN_CODE_DISCOVERY_SURFACES, OPEN_CODE_INSTRUCTION_PRECEDENCE } from '@codelatch/adapter-opencode';
import { CanonicalCommand, type BootstrapResult } from '@codelatch/workflow-contracts';
import { AdapterMetadataSchema } from '@codelatch/schemas';

/**
 * End-to-end integration test: proves the full bootstrap pipeline
 * works from OpenCode adapter invocation through core bootstrap
 * to emitted instruction surfaces and adapter metadata.
 */
describe('OpenCode bootstrap end-to-end', () => {
  const createMockFs = () => {
    const writtenFiles = new Map<string, string>();
    const createdDirs: string[] = [];

    return {
      fs: {
        mkdir: async (path: string) => { createdDirs.push(path); },
        writeFile: async (path: string, data: string) => { writtenFiles.set(path, data); }
      } as FsOps,
      fsRead: {
        exists: async () => false,
        readdir: async () => [],
        readFile: async () => ''
      } as FsReadOps,
      writtenFiles,
      createdDirs
    };
  };

  const createAdoptedRepoFs = () => {
    const writtenFiles = new Map<string, string>();
    const createdDirs: string[] = [];
    const existingFiles = new Set([
      '/adopted-project/.git',
      '/adopted-project/product-docs/codelatch-prd.md',
      '/adopted-project/product-docs/technical-design.md',
      '/adopted-project/README.md',
      '/adopted-project/.opencode'
    ]);

    return {
      fs: {
        mkdir: async (path: string) => { createdDirs.push(path); },
        writeFile: async (path: string, data: string) => { writtenFiles.set(path, data); }
      } as FsOps,
      fsRead: {
        exists: async (path: string) => existingFiles.has(path),
        readdir: async () => [],
        readFile: async () => ''
      } as FsReadOps,
      writtenFiles,
      createdDirs
    };
  };

  describe('fresh repo bootstrap', () => {
    it('bootstraps an empty repo with OpenCode adapter', async () => {
      const { fs, fsRead } = createMockFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.BOOTSTRAP },
        fs,
        {
          projectId: 'my-project',
          adapters: ['opencode'],
          profile: 'coding-development'
        },
        fsRead
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as BootstrapResult;
      expect(data.adapterSet).toContain('opencode');
    });

    it('uses non-canonical truth-doc paths in the registry', async () => {
      const { fs, fsRead, writtenFiles } = createAdoptedRepoFs();

      await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/adopted-project', command: CanonicalCommand.BOOTSTRAP },
        fs,
        {
          projectId: 'adopted-project',
          profile: 'coding-development'
        },
        fsRead
      );

      const registry = JSON.parse(writtenFiles.get('/adopted-project/.tmp/codelatch/truth-doc-registry.json')!);
      // codelatch-prd.md is non-canonical, should be adopted
      expect(registry.truth_docs.prd.path).toBe('product-docs/codelatch-prd.md');
    });
  });

  describe('multi-adapter bootstrap', () => {
    it('emits correct instruction surfaces for OpenCode + Claude Code', async () => {
      const { fs, fsRead } = createMockFs();

      const result = await dispatchCommand(
        { adapterId: 'opencode', projectRoot: '/project', command: CanonicalCommand.BOOTSTRAP },
        fs,
        {
          projectId: 'my-project',
          adapters: ['opencode', 'claude-code'],
          profile: 'coding-development'
        },
        fsRead
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      const data = result.data! as BootstrapResult;
      expect(data.instructionSurfaces).toContain('AGENTS.md');
      expect(data.instructionSurfaces).toContain('CLAUDE.md');
      expect(data.instructionSurfaces).toContain('.claude/CLAUDE.md');
    });
  });

  describe('adapter renderers', () => {
    it('renderAgentsMd follows Section 7.5 contract', () => {
      const content = renderAgentsMd({
        truthDocPaths: {
          prd: 'product-docs/prd.md',
          technicalDesign: 'product-docs/technical-design.md',
          implementationPlan: 'product-docs/implementation-plan.md'
        }
      });

      expect(content).toContain('# AGENTS.md');
      expect(content).toContain('This repository uses CodeLatch.');
      expect(content).toContain('product-docs/prd.md');
    });

    it('renderAdapterJson produces schema-valid output', () => {
      const adapterJson = renderAdapterJson({
        projectRoot: '.',
        metadataDir: '.opencode/codelatch',
        discoverySurfaces: OPEN_CODE_DISCOVERY_SURFACES,
        instructionPrecedence: OPEN_CODE_INSTRUCTION_PRECEDENCE,
        workflowBindings: [
          {
            event: 'bootstrap.start',
            host_surface: 'config',
            binding_ref: 'opencode.json#plugin',
            injection_policy: 'opencode-bootstrap-shell',
            fallback: 'wrapper-prelude'
          }
        ]
      });

      expect(AdapterMetadataSchema.safeParse(adapterJson).success).toBe(true);
    });
  });
});
