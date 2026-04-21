import { describe, expect, it } from 'vitest';
import { dispatchCommand, type FsOps, type FsReadOps } from '@codelatch/core';
import { createOpenCodePluginEntry } from '@codelatch/adapter-opencode';
import { CanonicalCommand } from '@codelatch/workflow-contracts';
import { ProjectManifestSchema, TruthDocRegistrySchema } from '@codelatch/schemas';

/**
 * Integration test: proves the OpenCode adapter shell can call
 * real bootstrap core logic through the command dispatcher.
 */
describe('OpenCode adapter → core bootstrap integration', () => {
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

  it('the OpenCode plugin entry can trigger bootstrap through the dispatcher', async () => {
    const { fs, fsRead } = createMockFs();
    const plugin = createOpenCodePluginEntry();

    // Step 1: the plugin entry normalizes the invocation
    const pluginResult = plugin.invoke({ commandName: 'codelatch-bootstrap' });
    expect(pluginResult.status).toBe('ready');
    expect(pluginResult.data.commandName).toBe('codelatch-bootstrap');

    // Step 2: the adapter maps the invocation to a command context
    const context = {
      adapterId: pluginResult.data.adapter,
      projectRoot: '/my-project',
      command: CanonicalCommand.BOOTSTRAP
    };

    // Step 3: the dispatcher routes to the bootstrap handler
    const result = await dispatchCommand(context, fs, {
      projectId: 'my-project',
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
    }, fsRead);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data!.runtimeRoot).toBe('/my-project/.tmp/codelatch');
    expect(result.data!.adapterSet).toEqual(['opencode']);
    expect(result.data!.instructionSurfaces).toContain('AGENTS.md');
  });

  it('produces schema-valid manifest and registry through the full flow', async () => {
    const { fs, fsRead, writtenFiles } = createMockFs();

    await dispatchCommand(
      { adapterId: 'opencode', projectRoot: '/my-project', command: CanonicalCommand.BOOTSTRAP },
      fs,
      {
        projectId: 'my-project',
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

    const manifest = JSON.parse(writtenFiles.get('/my-project/.tmp/codelatch/project-manifest.json')!);
    const registry = JSON.parse(writtenFiles.get('/my-project/.tmp/codelatch/truth-doc-registry.json')!);

    expect(ProjectManifestSchema.safeParse(manifest).success).toBe(true);
    expect(TruthDocRegistrySchema.safeParse(registry).success).toBe(true);
  });
});
