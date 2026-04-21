export const corePackageName = '@codelatch/core';

export const CODELATCH_VERSION = '0.1.0';

export type CoreResult<TData> = {
  status: 'ready';
  data: TData;
};

export const createCoreResult = <TData>(data: TData): CoreResult<TData> => ({
  status: 'ready',
  data
});

export {
  createRuntimeRootPaths,
  initializeRuntimeRoot,
  createProjectManifest,
  createTruthDocRegistry,
  resolveInstructionSurfacePolicy,
  createBootstrapEnvelope,
  computeBootstrapAnchors,
  detectRepoState,
  decideBootstrapMode,
  suggestAdapterSelection,
  resolveTruthDocPaths,
  buildTruthDocRegistryInput,
  createBootstrapSummary,
  type RuntimeRootPaths,
  type FsOps,
  type FsReadOps,
  type CreateManifestInput,
  type TruthDocRegistryInput,
  type BootstrapEnvelope,
  type CreateBootstrapEnvelopeInput,
  type BootstrapAnchors,
  type ComputeBootstrapAnchorsInput,
  type RepoDetectionResult,
  type TruthDocDetection,
  type HostDirDetection,
  type BootstrapMode,
  type BootstrapDecision,
  type AdapterSelectionSuggestion,
  type BootstrapSummary
} from './bootstrap/index.js';

export { dispatchCommand, type BootstrapInput } from './dispatcher.js';
