import { describe, expect, it } from 'vitest';
import {
  OPEN_CODE_ADAPTER_ID,
  createOpenCodePluginEntry,
  createOpenCodeAdapterMetadata,
  renderOpenCodeAgentsMd,
  renderOpenCodeConfig,
  renderOpenCodeCommandWrappers
} from '@codelatch/adapter-opencode';

describe('OpenCode adapter shell', () => {
  it('imports the adapter package entrypoint', async () => {
    await expect(import('@codelatch/adapter-opencode')).resolves.toBeDefined();
  });

  it('exports deterministic OpenCode adapter metadata', () => {
    const metadata = createOpenCodeAdapterMetadata();

    expect(metadata.identity).toEqual({
      id: OPEN_CODE_ADAPTER_ID,
      displayName: 'OpenCode Adapter'
    });
    expect(metadata.capabilities).toEqual([
      'discover',
      'normalize',
      'summarize',
      'map-result'
    ]);
    expect(metadata.workflowBindings).toEqual([
      {
        event: 'bootstrap.start',
        surface: 'runtime-hook',
        policyId: 'opencode-bootstrap-shell'
      },
      {
        event: 'execution.step',
        surface: 'command-wrapper',
        policyId: 'opencode-wrapper-checkpoint'
      }
    ]);
  });

  it('renders deterministic AGENTS.md content for OpenCode', () => {
    const content = renderOpenCodeAgentsMd({
      adapterDisplayName: 'OpenCode Adapter',
      commands: ['codelatch-bootstrap', 'codelatch-sync']
    });

    expect(content).toContain('# OpenCode Adapter');
    expect(content).toContain('- codelatch-bootstrap');
    expect(content).toContain('- codelatch-sync');
    expect(content).toContain('OpenCode-native instruction anchor');
  });

  it('renders deterministic opencode.json content', () => {
    const config = renderOpenCodeConfig({
      pluginEntry: '.opencode/plugins/codelatch.ts',
      commandNames: ['codelatch-bootstrap', 'codelatch-sync']
    });

    expect(config).toEqual({
      '$schema': 'https://opencode.ai/config.json',
      plugin: ['.opencode/plugins/codelatch.ts'],
      command: ['codelatch-bootstrap', 'codelatch-sync']
    });
  });

  it('renders thin branded command wrappers', () => {
    const wrappers = renderOpenCodeCommandWrappers([
      'codelatch-bootstrap',
      'codelatch-sync'
    ]);

    expect(wrappers).toEqual([
      {
        commandName: 'codelatch-bootstrap',
        displayName: 'CodeLatch Bootstrap',
        transport: 'plugin-dispatch'
      },
      {
        commandName: 'codelatch-sync',
        displayName: 'CodeLatch Sync',
        transport: 'plugin-dispatch'
      }
    ]);
  });

  it('invokes a skeletal core boundary through the plugin entry', () => {
    const plugin = createOpenCodePluginEntry();

    expect(
      plugin.invoke({
        commandName: 'codelatch-bootstrap'
      })
    ).toEqual({
      status: 'ready',
      data: {
        adapter: 'opencode',
        commandName: 'codelatch-bootstrap'
      }
    });
  });
});
