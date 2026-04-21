export const opencodeAdapterPackageName = '@codelatch/adapter-opencode';

export {
  OPEN_CODE_ADAPTER_ID,
  createOpenCodeAdapterMetadata
} from './metadata/index.js';
export { createOpenCodePluginEntry } from './plugin/index.js';

export { renderOpenCodeAgentsMd } from './render/agents-md.js';
export { renderOpenCodeCommandWrappers } from './render/command-wrappers.js';
export { renderOpenCodeConfig } from './render/opencode-json.js';
