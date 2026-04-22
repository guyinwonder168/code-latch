/**
 * Sync report builder and materialization decision.
 *
 * Section 13.5 step 6: materialize a readable sync report under
 * `.tmp/codelatch/sync/` only when drift, conflict, or a manual
 * decision must be reviewed, then auto-delete it by default once
 * resolved unless the user explicitly keeps it.
 *
 * Section 10.11: Sync report schema.
 *
 * Pure function — no side effects.
 */

import { DriftClass, type DriftFinding, type ProposedWrite } from '@codelatch/workflow-contracts';
import type { SyncReport } from '@codelatch/schemas';

export type SyncReportInput = {
  findings: DriftFinding[];
  proposedWrites: ProposedWrite[];
  runId: string;
};

export type MaterializationInput = {
  findings: DriftFinding[];
  proposedWrites: ProposedWrite[];
};

export type MaterializationDecision = {
  shouldMaterialize: boolean;
};

/**
 * Build a sync report from findings and proposed writes.
 *
 * Produces the schema-valid sync report shape per Section 10.11.
 * Pure function — no side effects.
 */
export const buildSyncReport = (input: SyncReportInput): SyncReport => {
  const highestDriftClass = input.findings.length === 0
    ? 0
    : Math.max(...input.findings.map(f => f.driftClass));

  const requiresHardStop = input.findings.some(f =>
    f.driftClass === DriftClass.CLASS_1 || f.driftClass === DriftClass.CLASS_2
  );

  const requiresRebrainstorm = input.findings.some(f =>
    f.driftClass === DriftClass.CLASS_2
  );

  const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
  const reportDocRef = `.tmp/codelatch/sync/sync_${timestamp}.md`;

  return {
    run_id: input.runId,
    command: 'codelatch-sync',
    highest_drift_class: highestDriftClass,
    findings: input.findings.map(f => ({
      kind: f.kind,
      drift_class: f.driftClass,
      severity: f.severity,
      message: f.message,
      pointers: f.pointers
    })),
    proposed_writes: input.proposedWrites.map(w => ({
      target_path: w.targetPath,
      description: w.description,
      drift_class: w.driftClass,
      requires_approval: w.requiresApproval
    })),
    requires_hard_stop: requiresHardStop,
    requires_rebrainstorm: requiresRebrainstorm,
    report_doc_ref: reportDocRef,
    generated_at: new Date().toISOString()
  };
};

/**
 * Determine whether a sync report should be materialized.
 *
 * Section 13.5 step 6: reports are materialized only when
 * drift, conflict, or a manual decision must be reviewed.
 *
 * Pure function — no side effects.
 */
export const shouldMaterializeReport = (input: MaterializationInput): MaterializationDecision => {
  const shouldMaterialize = input.findings.length > 0 || input.proposedWrites.length > 0;
  return { shouldMaterialize };
};
