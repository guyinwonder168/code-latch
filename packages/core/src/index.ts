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

export {
  buildDriftInputs,
  classifyDrift,
  validateInstructionSurfaces,
  checkAnchorStaleness,
  buildProposedWrites,
  buildSyncReport,
  shouldMaterializeReport,
  executeSyncPipeline,
  type DriftInputs,
  type BuildDriftInputsInput,
  type DriftClassification,
  type SurfaceValidationInput,
  type SurfaceValidationResult,
  type ApprovalAnchors,
  type CheckAnchorStalenessInput,
  type AnchorStalenessResult,
  type ProposedWritesInput,
  type ProposedWritesResult,
  type SyncReportInput,
  type MaterializationInput,
  type MaterializationDecision,
  type SyncPipelineInput,
  type SyncPipelineResult
} from './sync/index.js';

export { dispatchCommand, type BootstrapInput, type SyncInput } from './dispatcher.js';
