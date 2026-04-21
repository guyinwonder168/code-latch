export const opencodeAdapterPackageName = '@codelatch/adapter-opencode';

export {
  OPEN_CODE_ADAPTER_ID,
  createOpenCodeAdapterMetadata
} from './metadata/index.js';
export { createOpenCodePluginEntry } from './plugin/index.js';

export { renderOpenCodeAgentsMd } from './render/agents-md.js';
export { renderOpenCodeCommandConfig } from './render/command-config.js';
export { renderOpenCodeConfig, mergePluginIntoConfig } from './render/opencode-json.js';
