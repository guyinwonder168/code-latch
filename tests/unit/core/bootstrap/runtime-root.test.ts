import { describe, expect, it } from 'vitest';
import {
  createRuntimeRootPaths,
  initializeRuntimeRoot,
  type FsOps
} from '@codelatch/core';

describe('runtime-root', () => {
  describe('createRuntimeRootPaths', () => {
    it('computes all paths relative to the project root', () => {
      const paths = createRuntimeRootPaths('/my/project');

      expect(paths.root).toBe('/my/project/.tmp/codelatch');
      expect(paths.db).toBe('/my/project/.tmp/codelatch/index.db');
      expect(paths.manifest).toBe('/my/project/.tmp/codelatch/project-manifest.json');
      expect(paths.versionGovernor).toBe('/my/project/.tmp/codelatch/version-governor.json');
      expect(paths.registry).toBe('/my/project/.tmp/codelatch/truth-doc-registry.json');
    });

    it('includes all required subdirectories', () => {
      const paths = createRuntimeRootPaths('/project');

      const subdirs = [
        paths.plans, paths.runs, paths.sync, paths.audits,
        paths.cleanup, paths.packsProject, paths.packsCache,
        paths.incidents, paths.proposalsReview, paths.cacheRefs,
        paths.cacheSnippets, paths.workspaces
      ];

      for (const dir of subdirs) {
        expect(dir).toContain('/project/.tmp/codelatch/');
      }
    });

    it('works with relative project roots', () => {
      const paths = createRuntimeRootPaths('.');

      expect(paths.root).toBe('./.tmp/codelatch');
    });
  });

  describe('initializeRuntimeRoot', () => {
    it('creates root directory and all subdirectories', async () => {
      const createdDirs: string[] = [];
      const mockFs: FsOps = {
        mkdir: async (path: string) => {
          createdDirs.push(path);
        },
        writeFile: async () => {}
      };

      const paths = createRuntimeRootPaths('/project');
      await initializeRuntimeRoot(paths, mockFs);

      // Root + 12 subdirectories = 13 total
      expect(createdDirs).toHaveLength(13);
      expect(createdDirs[0]).toBe('/project/.tmp/codelatch');
      expect(createdDirs).toContain('/project/.tmp/codelatch/plans');
      expect(createdDirs).toContain('/project/.tmp/codelatch/workspaces');
    });

    it('passes recursive option to mkdir', async () => {
      let receivedOptions: { recursive?: boolean } | undefined;
      const mockFs: FsOps = {
        mkdir: async (_path: string, options?: { recursive?: boolean }) => {
          receivedOptions = options;
        },
        writeFile: async () => {}
      };

      const paths = createRuntimeRootPaths('/project');
      await initializeRuntimeRoot(paths, mockFs);

      expect(receivedOptions).toEqual({ recursive: true });
    });
  });
});
