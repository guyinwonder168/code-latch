export type OpenCodeCommandWrapper = {
  commandName: string;
  displayName: string;
  transport: 'plugin-dispatch';
};

const toDisplayName = (commandName: string): string =>
  commandName
    .replace(/^codelatch-/, '')
    .split('-')
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join(' ');

export const renderOpenCodeCommandWrappers = (
  commandNames: readonly string[]
): OpenCodeCommandWrapper[] =>
  commandNames.map((commandName) => ({
    commandName,
    displayName: `CodeLatch ${toDisplayName(commandName)}`,
    transport: 'plugin-dispatch'
  }));
