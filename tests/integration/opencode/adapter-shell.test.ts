import { describe, expect, it } from 'vitest';
import {
  OPEN_CODE_ADAPTER_ID,
  codelatchPlugin,
  createOpenCodeAdapterMetadata,
  renderAgentsMd,
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
        surface: 'config',
        policyId: 'opencode-bootstrap-shell'
      },
      {
        event: 'execution.step',
        surface: 'command.execute.before',
        policyId: 'opencode-wrapper-checkpoint'
      }
    ]);
  });

  it('renders AGENTS.md following Section 7.5 contract', () => {
    const content = renderAgentsMd({
      truthDocPaths: {
        prd: 'product-docs/prd.md',
        technicalDesign: 'product-docs/technical-design.md',
        implementationPlan: 'product-docs/implementation-plan.md'
      }
    });

    expect(content).toContain('# AGENTS.md');
    expect(content).toContain('This repository uses CodeLatch.');
    expect(content).toContain('## Source of Truth');
    expect(content).toContain('product-docs/prd.md');
    expect(content).toContain('product-docs/technical-design.md');
    expect(content).toContain('product-docs/implementation-plan.md');
    expect(content).toContain('## Non-Negotiable Reminders');
  });

  it('renders AGENTS.md with optional local context path', () => {
    const content = renderAgentsMd({
      truthDocPaths: {
        prd: 'product-docs/prd.md',
        technicalDesign: 'product-docs/technical-design.md',
        implementationPlan: 'product-docs/implementation-plan.md'
      },
      localContextPath: '.opencode/context/core'
    });

    expect(content).toContain('## Local Context');
    expect(content).toContain('.opencode/context/core');
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

  it('recovers from non-array plugin value (string) in existing config', () => {
    const existing = { plugin: 'some-single-plugin' };

    const merged = mergePluginIntoConfig(existing, '@codelatch/adapter-opencode');

    expect(merged.plugin).toEqual(['some-single-plugin', '@codelatch/adapter-opencode']);
  });

  it('recovers from corrupted plugin value (non-array, non-string) in existing config', () => {
    const existing = { plugin: 42 };

    const merged = mergePluginIntoConfig(existing, '@codelatch/adapter-opencode');

    expect(merged.plugin).toEqual(['@codelatch/adapter-opencode']);
  });

  it('filters non-string entries from corrupted plugin array', () => {
    const existing = { plugin: ['valid-plugin', 123, true, 'another'] };

    const merged = mergePluginIntoConfig(existing, '@codelatch/adapter-opencode');

    expect(merged.plugin).toEqual(['valid-plugin', 'another', '@codelatch/adapter-opencode']);
  });

  it('handles missing plugin key in existing config', () => {
    const existing = { providers: { myProvider: {} } };

    const merged = mergePluginIntoConfig(existing, '@codelatch/adapter-opencode');

    expect(merged.plugin).toEqual(['@codelatch/adapter-opencode']);
    expect(merged.providers).toEqual(existing.providers);
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

  it('invokes a skeletal core boundary through the plugin entry', async () => {
    const hooks = await codelatchPlugin({});

    // Plugin returns the expected hook shape
    expect(typeof hooks.config).toBe('function');
    expect(typeof hooks.tool.codelatch.execute).toBe('function');
    expect(typeof hooks.event['command.execute.before']).toBe('function');

    // Config hook registers all 7 CodeLatch commands
    const configResult = hooks.config({});
    expect(configResult.command).toHaveProperty('codelatch-bootstrap');
    expect(configResult.command).toHaveProperty('codelatch-sync');
  });
});
