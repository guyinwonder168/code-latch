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
  type RuntimeRootPaths,
  type FsOps,
  type CreateManifestInput,
  type TruthDocRegistryInput,
  type BootstrapEnvelope,
  type CreateBootstrapEnvelopeInput,
  type BootstrapAnchors,
  type ComputeBootstrapAnchorsInput
} from './bootstrap/index.js';

export { dispatchCommand, type BootstrapInput } from './dispatcher.js';
