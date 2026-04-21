/**
 * OpenCode command config renderer — produces command registration entries
 * for the plugin's `config` hook. CodeLatch chooses programmatic registration
 * via the config hook rather than file-based .md commands; .opencode/commands/
 * remains a valid OpenCode surface for other plugins.
 *
 * Each entry maps to:
 *   opencodeConfig.command.<name> = { template, description, subtask }
 */

export type OpenCodeCommandEntry = {
  template: string;
  description: string;
  subtask: boolean;
};

export type OpenCodeCommandConfig = Record<string, OpenCodeCommandEntry>;

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  'codelatch-bootstrap': 'Initialize CodeLatch in this repository',
  'codelatch-sync': 'Sync truth docs and detect drift',
  'codelatch-pack-create': 'Create a project or domain pack',
  'codelatch-learn': 'Review project incidents and propose learning',
  'codelatch-clean': 'Clean resolved runtime artifacts',
  'codelatch-audit': 'Audit for contradictions, duplication, and risks',
  'codelatch-promote': 'Suggest global promotion of approved lessons'
};

/**
 * Render command registration entries for the plugin config hook.
 */
export const renderOpenCodeCommandConfig = (
  commandNames: readonly string[]
): OpenCodeCommandConfig => {
  const config: OpenCodeCommandConfig = {};

  for (const name of commandNames) {
    config[name] = {
      template: '',
      description: DEFAULT_DESCRIPTIONS[name] ?? `CodeLatch: ${name}`,
      subtask: true
    };
  }

  return config;
};
