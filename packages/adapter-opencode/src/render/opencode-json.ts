export type OpenCodeConfigInput = {
  pluginEntry: string;
  commandNames: readonly string[];
};

export type OpenCodeConfig = {
  $schema: string;
  plugins: string[];
  commands: string[];
};

export const renderOpenCodeConfig = ({
  pluginEntry,
  commandNames
}: OpenCodeConfigInput): OpenCodeConfig => ({
  $schema: 'https://opencode.ai/config.schema.json',
  plugins: [pluginEntry],
  commands: [...commandNames]
});
