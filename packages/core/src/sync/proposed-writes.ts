/**
 * Approval-aware proposed writes for sync.
 *
 * Section 13.5 step 7: present low-risk proposed changes.
 * Section 13.5 step 8: require approval before any write.
 *
 * - Class 0 findings may be proposed automatically but still require approval.
 * - Class 1 findings require hard stop + doc update before writes.
 * - Class 2 findings require re-brainstorm before writes.
 *
 * Pure function — no side effects.
 */

import { DriftClass, type DriftFinding, type ProposedWrite } from '@codelatch/workflow-contracts';

export type ProposedWritesInput = {
  findings: DriftFinding[];
};

export type ProposedWritesResult = {
  writes: ProposedWrite[];
  hardStopRequired: boolean;
  rebrainstormRequired: boolean;
};

/**
 * Build proposed writes from drift findings.
 *
 * Only Class 0 (metadata) findings generate proposed writes.
 * Class 1 and Class 2 require human intervention first.
 * All proposed writes require approval before any write is applied.
 *
 * Pure function — no side effects.
 */
export const buildProposedWrites = (input: ProposedWritesInput): ProposedWritesResult => {
  const writes: ProposedWrite[] = [];

  for (const finding of input.findings) {
    if (finding.driftClass === DriftClass.CLASS_0) {
      // Class 0 findings may be proposed automatically
      // but still require approval before write
      writes.push({
        targetPath: finding.pointers[0] ?? '',
        description: finding.message,
        driftClass: DriftClass.CLASS_0,
        requiresApproval: true
      });
    }
    // Class 1 and Class 2 do not generate auto-proposed writes
    // They require hard stop / re-brainstorm first
  }

  const hardStopRequired = input.findings.some(f =>
    f.driftClass === DriftClass.CLASS_1 || f.driftClass === DriftClass.CLASS_2
  );

  const rebrainstormRequired = input.findings.some(f =>
    f.driftClass === DriftClass.CLASS_2
  );

  return { writes, hardStopRequired, rebrainstormRequired };
};
