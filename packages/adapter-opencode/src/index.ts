export const opencodeAdapterPackageName = '@codelatch/adapter-opencode';

export {
  OPEN_CODE_ADAPTER_ID,
  createOpenCodeAdapterMetadata
} from './metadata/index.js';
export { createOpenCodePluginEntry } from './plugin/index.js';

export { renderAgentsMd, type AgentsMdInput } from './render/agents-md.js';
export { renderOpenCodeCommandConfig, type OpenCodeCommandEntry, type OpenCodeCommandConfig } from './render/command-config.js';
export { renderOpenCodeConfig, mergePluginIntoConfig } from './render/opencode-json.js';
export { renderAdapterJson, OPEN_CODE_DISCOVERY_SURFACES, OPEN_CODE_INSTRUCTION_PRECEDENCE, type AdapterJsonInput } from './render/adapter-json.js';
