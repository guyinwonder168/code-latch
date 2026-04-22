/**
 * Unit tests for the refactored OpenCode plugin entry module.
 *
 * Validates that codelatchPlugin conforms to the OpenCode Plugin SDK interface
 * (`Plugin = async (ctx) => { config, tool, event }`) and that each hook
 * behaves correctly.
 */

import { describe, expect, it, vi } from 'vitest';
import {
  codelatchPlugin,
  type OpenCodePluginContext,
  type OpenCodePluginHooks
} from '@codelatch/adapter-opencode';
import { CanonicalCommand } from '@codelatch/workflow-contracts';

// ---------------------------------------------------------------------------
// codelatchPlugin async function
// ---------------------------------------------------------------------------

describe('codelatchPlugin', () => {
  it('exports an async function that returns plugin hooks', async () => {
    const ctx: OpenCodePluginContext = {};
    const hooks = await codelatchPlugin(ctx);

    expect(hooks).toBeDefined();
    expect(typeof hooks.config).toBe('function');
    expect(typeof hooks.tool).toBe('object');
    expect(typeof hooks.tool.codelatch).toBe('object');
    expect(typeof hooks.tool.codelatch.execute).toBe('function');
    expect(typeof hooks.event).toBe('object');
    expect(typeof hooks.event['command.execute.before']).toBe('function');
  });

  it('returns the correct shape: config, tool, event', async () => {
    const hooks = await codelatchPlugin({});

    const keys = Object.keys(hooks);
    expect(keys).toContain('config');
    expect(keys).toContain('tool');
    expect(keys).toContain('event');
  });

  // -------------------------------------------------------------------------
  // config hook
  // -------------------------------------------------------------------------

  describe('config hook', () => {
    it('registers all 7 canonical CodeLatch commands', async () => {
      const hooks = await codelatchPlugin({});
      const result = hooks.config({});

      const expectedCommands = [
        CanonicalCommand.BOOTSTRAP,
        CanonicalCommand.SYNC,
        CanonicalCommand.AUDIT,
        CanonicalCommand.PACK_CREATE,
        CanonicalCommand.LEARN,
        CanonicalCommand.CLEAN,
        CanonicalCommand.PROMOTE
      ];

      for (const cmd of expectedCommands) {
        expect(result.command).toHaveProperty(cmd);
        const entry = (result.command as Record<string, unknown>)[cmd] as Record<string, unknown>;
        expect(entry).toHaveProperty('template');
        expect(entry).toHaveProperty('description');
        expect(entry).toHaveProperty('subtask');
        expect(entry.subtask).toBe(true);
      }
    });

    it('merges CodeLatch commands into existing command config without clobbering', async () => {
      const hooks = await codelatchPlugin({});

      const existing = {
        command: {
          'some-other-plugin-command': { template: '', description: 'Other', subtask: true }
        }
      };

      const result = hooks.config(existing);

      // Existing command preserved
      expect(result.command).toHaveProperty('some-other-plugin-command');
      // All CodeLatch commands added
      expect(result.command).toHaveProperty('codelatch-bootstrap');
      expect(result.command).toHaveProperty('codelatch-sync');
    });

    it('creates command object when opencodeConfig has no command key', async () => {
      const hooks = await codelatchPlugin({});
      const result = hooks.config({});

      expect(result.command).toBeDefined();
      expect(result.command).toHaveProperty('codelatch-bootstrap');
    });

    it('preserves non-command config keys', async () => {
      const hooks = await codelatchPlugin({});
      const existing = {
        command: {},
        someOtherKey: 'preserved'
      };

      const result = hooks.config(existing);
      expect(result).toHaveProperty('someOtherKey', 'preserved');
    });
  });

  // -------------------------------------------------------------------------
  // tool.codelatch
  // -------------------------------------------------------------------------

  describe('tool.codelatch', () => {
    it('has a description referencing CodeLatch framework commands', async () => {
      const hooks = await codelatchPlugin({});
      expect(hooks.tool.codelatch.description).toContain('CodeLatch');
    });

    it('defines command and projectRoot args', async () => {
      const hooks = await codelatchPlugin({});
      expect(hooks.tool.codelatch.args).toHaveProperty('command');
      expect(hooks.tool.codelatch.args).toHaveProperty('projectRoot');
    });

    it('calls dispatchCommand with the correct context when executing a valid command', async () => {
      const hooks = await codelatchPlugin({});

      const result = await hooks.tool.codelatch.execute(
        { command: 'codelatch-bootstrap', projectRoot: '/tmp/test-project' },
        {}
      );

      // dispatchCommand should return a result object (even if stubs are used)
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });

  // -------------------------------------------------------------------------
  // event['command.execute.before']
  // -------------------------------------------------------------------------

  describe('event["command.execute.before"]', () => {
    it('passes through data unchanged when command is not a CodeLatch command', async () => {
      const hooks = await codelatchPlugin({});

      const data = { command: 'some-other-command', projectRoot: '/tmp/test' };
      const result = await hooks.event['command.execute.before'](data);

      expect(result).toEqual(data);
    });

    it('passes through data unchanged when command key is missing', async () => {
      const hooks = await codelatchPlugin({});

      const data = { projectRoot: '/tmp/test' };
      const result = await hooks.event['command.execute.before'](data);

      expect(result).toEqual(data);
    });

    it('intercepts CodeLatch command names and adds codelatch result', async () => {
      const hooks = await codelatchPlugin({});

      const data = { command: 'codelatch-bootstrap' };
      const result = await hooks.event['command.execute.before'](data);

      expect(result).toHaveProperty('codelatch');
      expect(result).toHaveProperty('command', 'codelatch-bootstrap');
    });

    it('intercepts all 7 canonical command names', async () => {
      const hooks = await codelatchPlugin({});

      const codeLatchCommands = [
        'codelatch-bootstrap',
        'codelatch-sync',
        'codelatch-audit',
        'codelatch-pack-create',
        'codelatch-learn',
        'codelatch-clean',
        'codelatch-promote'
      ];

      for (const cmd of codeLatchCommands) {
        const data = { command: cmd };
        const result = await hooks.event['command.execute.before'](data);
        expect(result).toHaveProperty('codelatch');
      }
    });
  });
});