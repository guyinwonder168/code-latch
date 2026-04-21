export type OpenCodeConfigInput = {
  pluginEntry: string;
  commandNames: readonly string[];
};

export type OpenCodeConfig = {
  $schema: string;
  plugin: string[];
  command: string[];
};

export const renderOpenCodeConfig = ({
  pluginEntry,
  commandNames
}: OpenCodeConfigInput): OpenCodeConfig => ({
  $schema: 'https://opencode.ai/config.json',
  plugin: [pluginEntry],
  command: [...commandNames]
});
