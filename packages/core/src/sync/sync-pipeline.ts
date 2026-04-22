/**
 * Sync pipeline orchestration.
 *
 * Section 13.5: `codelatch-sync` executes the following pipeline:
 * 1. load truth-doc registry and project manifest
 * 2. read current truth docs
 * 3. inspect instruction anchors, project-manifest policy, adapter metadata
 * 4. classify drift findings against approval anchors, plan scope, adapter state
 * 5. record sync result metadata
 * 6. materialize readable sync report only when actionable
 * 7. present low-risk proposed changes
 * 8. require approval before any write
 * 9. trigger re-brainstorm flow for Class 1 or Class 2 drift
 *
 * Pure function — no I/O side effects. The pipeline result is returned
 * for the dispatcher to handle file writes and metadata persistence.
 */

import type { DriftClass, DriftFinding, ProposedWrite } from '@codelatch/workflow-contracts';
import type { ProjectManifest, TruthDocRegistry, RepoState, SyncReport } from '@codelatch/schemas';
import { buildDriftInputs } from './drift-inputs.js';
import { classifyDrift } from './drift-classifier.js';
import { validateInstructionSurfaces, type SurfaceValidationResult } from './surface-validator.js';
import { checkAnchorStaleness, type AnchorStalenessResult, type ApprovalAnchors } from './anchor-staleness.js';
import { buildProposedWrites } from './proposed-writes.js';
import { buildSyncReport, shouldMaterializeReport } from './sync-report.js';

export type SyncPipelineInput = {
  manifest: ProjectManifest;
  registry: TruthDocRegistry;
  anchors: ApprovalAnchors;
  currentTruthDocHashes: { prd: string; technical_design: string; implementation_plan: string };
  actualInstructionSurfaces: string[];
  currentAdapterSet: string[];
  currentRepoState: RepoState;
  currentInstructionSurfaceHash: string;
  changedFiles?: string[];
  diffSummary?: string;
};

export type SyncPipelineResult = {
  highestDriftClass: DriftClass;
  findings: DriftFinding[];
  proposedWrites: ProposedWrite[];
  requiresHardStop: boolean;
  requiresRebrainstorm: boolean;
  anchorStaleness: AnchorStalenessResult;
  surfaceValidation: SurfaceValidationResult;
  reportMaterialized: boolean;
  reportPath?: string;
  report?: SyncReport;
};

/**
 * Execute the full sync pipeline.
 *
 * Steps 1-9 from Section 13.5, orchestrated as pure functions.
 * Returns the complete sync result for the dispatcher to handle.
 *
 * Pure function — no side effects.
 */
export const executeSyncPipeline = (input: SyncPipelineInput): SyncPipelineResult => {
  // Step 1-2: Load manifest, registry, and current truth-doc state
  const driftInputs = buildDriftInputs({
    manifest: input.manifest,
    registry: input.registry,
    anchors: input.anchors,
    currentTruthDocHashes: input.currentTruthDocHashes,
    currentAdapterSet: input.currentAdapterSet,
    actualInstructionSurfaces: input.actualInstructionSurfaces,
    changedFiles: input.changedFiles,
    diffSummary: input.diffSummary
  });

  // Step 3: Validate instruction surfaces against manifest policy
  const surfaceValidation = validateInstructionSurfaces({
    policy: input.manifest.instruction_surface_policy,
    actualSurfaces: input.actualInstructionSurfaces
  });

  // Step 4: Classify drift findings
  const classification = classifyDrift(driftInputs);

  // Check anchor staleness (Section 10.4.1)
  const anchorStaleness = checkAnchorStaleness({
    anchors: input.anchors,
    currentTruthDocHashes: input.currentTruthDocHashes,
    currentAdapterSet: input.currentAdapterSet,
    currentRepoState: input.currentRepoState,
    currentInstructionSurfaceHash: input.currentInstructionSurfaceHash
  });

  // Step 7: Build proposed writes (only Class 0 findings)
  const proposedWritesResult = buildProposedWrites({
    findings: classification.findings
  });

  // Step 6: Determine report materialization
  const materialization = shouldMaterializeReport({
    findings: classification.findings,
    proposedWrites: proposedWritesResult.writes
  });

  let report: SyncReport | undefined;
  let reportPath: string | undefined;

  if (materialization.shouldMaterialize) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
    report = buildSyncReport({
      findings: classification.findings,
      proposedWrites: proposedWritesResult.writes,
      runId: `run_${timestamp}`
    });
    reportPath = report.report_doc_ref;
  }

  return {
    highestDriftClass: classification.highestDriftClass,
    findings: classification.findings,
    proposedWrites: proposedWritesResult.writes,
    requiresHardStop: classification.requiresHardStop,
    requiresRebrainstorm: classification.requiresRebrainstorm,
    anchorStaleness,
    surfaceValidation,
    reportMaterialized: materialization.shouldMaterialize,
    reportPath,
    report
  };
};
