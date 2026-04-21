export type OpenCodeAgentsMdInput = {
  adapterDisplayName: string;
  commands: readonly string[];
};

export const renderOpenCodeAgentsMd = ({
  adapterDisplayName,
  commands
}: OpenCodeAgentsMdInput): string => {
  const renderedCommands = commands.map((command) => `- ${command}`).join('\n');

  return [
    `# ${adapterDisplayName}`,
    '',
    'OpenCode-native instruction anchor for the CodeLatch adapter shell.',
    '',
    '## Commands',
    renderedCommands
  ].join('\n');
};
