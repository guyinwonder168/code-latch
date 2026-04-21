/**
 * OpenCode config renderer — produces the minimal opencode.json shape
 * required for plugin registration. Commands are registered programmatically
 * inside the plugin's `config` hook, so no `command` key is emitted here.
 *
 * When an existing config is present, the plugin key is merged into it.
 */

export type OpenCodeConfigInput = {
  pluginEntry: string;
};

export type OpenCodeConfig = {
  $schema: string;
  plugin: string[];
};

/**
 * Render a minimal opencode.json with only the plugin entry.
 */
export const renderOpenCodeConfig = ({
  pluginEntry
}: OpenCodeConfigInput): OpenCodeConfig => ({
  $schema: 'https://opencode.ai/config.json',
  plugin: [pluginEntry]
});

/**
 * Coerce the `plugin` field of a parsed opencode.json into a string[].
 * Guards against non-array values from manual edits or legacy config.
 */
const coercePluginArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string');
  }
  if (typeof value === 'string') {
    return [value];
  }
  return [];
};

/**
 * Merge a plugin entry into an existing parsed opencode.json object.
 * Preserves all existing keys and appends the plugin if not already present.
 * Validates the plugin list shape before merging to avoid runtime errors
 * from corrupted or legacy config values.
 */
export const mergePluginIntoConfig = (
  existingConfig: Record<string, unknown>,
  pluginEntry: string
): Record<string, unknown> => {
  const existing = coercePluginArray(existingConfig.plugin);
  const plugin = existing.includes(pluginEntry)
    ? existing
    : [...existing, pluginEntry];

  return { ...existingConfig, plugin };
};
