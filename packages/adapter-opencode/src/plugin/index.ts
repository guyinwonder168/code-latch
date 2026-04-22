/**
 * OpenCode Plugin Entry Module
 *
 * Exports the CodeLatch plugin conforming to the OpenCode Plugin SDK interface:
 *   `Plugin = async (ctx) => { config, tool, event, ... }`
 *
 * The plugin:
 *   - Registers all 7 canonical CodeLatch commands via the `config` hook
 *   - Intercepts command execution via `command.execute.before` to delegate
 *     to the shared core dispatcher
 *   - Exposes a `codelatch` tool for direct invocation
 *
 * OpenCode runs on Bun which natively transpiles TypeScript, so local
 * development can load this module directly. Production distribution requires
 * bundling (esbuild) to collapse workspace dependencies into a single file.
 */

import { dispatchCommand } from '@codelatch/core';
import {
  CanonicalCommand,
  type CommandContext,
  type CommandResult,
  type BootstrapResult,
  type SyncResult,
  type AuditResult,
  type PackCreateResult,
  type LearnResult,
  type CleanResult,
  type PromoteResult
} from '@codelatch/workflow-contracts';
import { OPEN_CODE_ADAPTER_ID } from '../metadata/index.js';
import {
  renderOpenCodeCommandConfig,
  type OpenCodeCommandConfig
} from '../render/command-config.js';

// ---------------------------------------------------------------------------
// Plugin SDK-compatible types
// ---------------------------------------------------------------------------

/**
 * Shape of the context object OpenCode passes to the plugin function.
 * Minimal for now — will be extended as OpenCode's SDK stabilises.
 */
export type OpenCodePluginContext = {
  /** OpenCode configuration object the plugin may mutate. */
  config?: Record<string, unknown>;
};

/**
 * The return value of the CodeLatch plugin function.
 * Each key maps to an OpenCode plugin hook.
 */
export type OpenCodePluginHooks = {
  config: (opencodeConfig: Record<string, unknown>) => Record<string, unknown>;
  tool: {
    codelatch: {
      description: string;
      args: Record<string, unknown>;
      execute: (args: Record<string, unknown>, context: Record<string, unknown>) => Promise<CommandResult<BootstrapResult | SyncResult | AuditResult | PackCreateResult | LearnResult | CleanResult | PromoteResult>>;
    };
  };
  event: {
    'command.execute.before': (data: Record<string, unknown>) => Promise<Record<string, unknown>>;
  };
};

// ---------------------------------------------------------------------------
// All canonical commands registered by the plugin
// ---------------------------------------------------------------------------

const CODELATCH_COMMANDS = [
  CanonicalCommand.BOOTSTRAP,
  CanonicalCommand.SYNC,
  CanonicalCommand.AUDIT,
  CanonicalCommand.PACK_CREATE,
  CanonicalCommand.LEARN,
  CanonicalCommand.CLEAN,
  CanonicalCommand.PROMOTE
] as const;

const COMMAND_NAMES = CODELATCH_COMMANDS.map((c) => c as string);

// ---------------------------------------------------------------------------
// Plugin hooks implementation
// ---------------------------------------------------------------------------

/**
 * Config hook — registers all CodeLatch commands in opencode.json.
 * Called at plugin init time.
 */
const config = (opencodeConfig: Record<string, unknown>): Record<string, unknown> => {
  const commandConfig: OpenCodeCommandConfig = renderOpenCodeCommandConfig(COMMAND_NAMES);

  const existing = typeof opencodeConfig.command === 'object' && opencodeConfig.command !== null
    ? opencodeConfig.command as Record<string, unknown>
    : {};

  return {
    ...opencodeConfig,
    command: { ...existing, ...commandConfig }
  };
};

/**
 * Command execute.before hook — intercepts CodeLatch command invocations
 * and delegates to the shared core dispatcher.
 */
const handleCommandExecuteBefore = async (
  data: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const commandName = data?.command as string | undefined;
  if (!commandName || !COMMAND_NAMES.includes(commandName)) {
    return data;
  }

  const projectRoot = (data?.projectRoot as string) ?? process.cwd();

  const context: CommandContext = {
    adapterId: OPEN_CODE_ADAPTER_ID,
    projectRoot,
    command: commandName as CanonicalCommand
  };

  // Core dispatcher needs fs ops — in plugin context these come from the host
  // For now we pass stub ops; real fs integration happens via bootstrap/sync pipelines
  const result = await dispatchCommand(context, {
    writeFile: async () => { /* handled by core pipeline */ },
    mkdir: async () => { /* handled by core pipeline */ }
  });

  return { ...data, codelatch: result };
};

// ---------------------------------------------------------------------------
// Plugin export (OpenCode Plugin SDK interface)
// ---------------------------------------------------------------------------

/**
 * CodeLatch OpenCode plugin.
 *
 * Conforms to the OpenCode Plugin SDK interface:
 *   `Plugin = async (ctx) => { config, tool, event }`
 *
 * Usage in opencode.json:
 *   { "plugin": ["@codelatch/adapter-opencode"] }
 *
 * Or for local development:
 *   { "plugin": ["./path/to/adapter-opencode"] }
 */
export const codelatchPlugin = async (
  _ctx: OpenCodePluginContext
): Promise<OpenCodePluginHooks> => ({
  config,
  tool: {
    codelatch: {
      description: 'CodeLatch framework commands — bootstrap, sync, audit, pack-create, learn, clean, promote',
      args: {
        command: {
          type: 'string',
          description: 'Canonical CodeLatch command to execute'
        },
        projectRoot: {
          type: 'string',
          description: 'Project root directory'
        }
      },
      execute: async (args: Record<string, unknown>, _context: Record<string, unknown>) => {
        const commandName = args.command as string;
        const projectRoot = (args.projectRoot as string) ?? process.cwd();

        const context: CommandContext = {
          adapterId: OPEN_CODE_ADAPTER_ID,
          projectRoot,
          command: commandName as CanonicalCommand
        };

        return dispatchCommand(context, {
          writeFile: async () => {},
          mkdir: async () => {}
        });
      }
    }
  },
  event: {
    'command.execute.before': handleCommandExecuteBefore
  }
});