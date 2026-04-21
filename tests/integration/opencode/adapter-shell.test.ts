import { describe, expect, it } from 'vitest';
import {
  OPEN_CODE_ADAPTER_ID,
  createOpenCodePluginEntry,
  createOpenCodeAdapterMetadata,
  renderOpenCodeAgentsMd,
  renderOpenCodeConfig,
  mergePluginIntoConfig,
  renderOpenCodeCommandConfig
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

  it('renders minimal opencode.json with only plugin entry', () => {
    const config = renderOpenCodeConfig({
      pluginEntry: '@codelatch/adapter-opencode'
    });

    expect(config).toEqual({
      '$schema': 'https://opencode.ai/config.json',
      plugin: ['@codelatch/adapter-opencode']
    });
  });

  it('merges plugin entry into existing config without overwriting other keys', () => {
    const existing = {
      providers: { myProvider: {} },
      plugin: ['some-other-plugin']
    };

    const merged = mergePluginIntoConfig(existing, '@codelatch/adapter-opencode');

    expect(merged.plugin).toEqual(['some-other-plugin', '@codelatch/adapter-opencode']);
    expect(merged.providers).toEqual(existing.providers);
  });

  it('does not duplicate plugin entry when merging into config that already has it', () => {
    const existing = {
      plugin: ['@codelatch/adapter-opencode']
    };

    const merged = mergePluginIntoConfig(existing, '@codelatch/adapter-opencode');

    expect(merged.plugin).toEqual(['@codelatch/adapter-opencode']);
  });

  it('renders command registration entries for plugin config hook', () => {
    const commands = renderOpenCodeCommandConfig([
      'codelatch-bootstrap',
      'codelatch-sync'
    ]);

    expect(commands).toEqual({
      'codelatch-bootstrap': {
        template: '',
        description: 'Initialize CodeLatch in this repository',
        subtask: true
      },
      'codelatch-sync': {
        template: '',
        description: 'Sync truth docs and detect drift',
        subtask: true
      }
    });
  });

  it('uses fallback description for unknown command names', () => {
    const commands = renderOpenCodeCommandConfig(['codelatch-custom']);

    expect(commands['codelatch-custom'].description).toBe('CodeLatch: codelatch-custom');
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
