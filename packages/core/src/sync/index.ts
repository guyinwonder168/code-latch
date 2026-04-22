export { buildDriftInputs, type DriftInputs, type BuildDriftInputsInput } from './drift-inputs.js';
export { classifyDrift, type DriftClassification } from './drift-classifier.js';
export { validateInstructionSurfaces, type SurfaceValidationInput, type SurfaceValidationResult } from './surface-validator.js';
export { checkAnchorStaleness, type ApprovalAnchors, type CheckAnchorStalenessInput, type AnchorStalenessResult } from './anchor-staleness.js';
export { buildProposedWrites, type ProposedWritesInput, type ProposedWritesResult } from './proposed-writes.js';
export { buildSyncReport, shouldMaterializeReport, type SyncReportInput, type MaterializationInput, type MaterializationDecision } from './sync-report.js';
export { executeSyncPipeline, type SyncPipelineInput, type SyncPipelineResult } from './sync-pipeline.js';
