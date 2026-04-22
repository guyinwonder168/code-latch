/**
 * Learn pipeline for codelatch-learn.
 *
 * Section 14.3: Pipeline:
 * 1. scan incident records,
 * 2. score worthy candidates,
 * 3. compare against existing project packs,
 * 4. compare with prior proposals,
 * 5. record proposal metadata in `.tmp/codelatch/index.db`,
 * 6. materialize proposal review markdown only if needed,
 * 7. auto-draft a proposed global-context patch,
 * 8. trigger brainstorming when the learning path is ambiguous,
 * 9. require approval for any pack mutation, promotion suggestion, or global-context write.
 */

import type { LearnResult } from '@codelatch/workflow-contracts';
import type { FsReadOps } from '../bootstrap/detection.js';
import { createRuntimeRootPaths } from '../bootstrap/runtime-root.js';

export type LearnInput = {
  scanIncidents: boolean;
  maxCandidates: number;
};

export type LearnPipelineResult = {
  success: true;
  data: LearnResult;
} | {
  success: false;
  error: string;
};

/**
 * Execute the learn pipeline.
 */
export const executeLearnPipeline = async (
  projectRoot: string,
  input: LearnInput,
  fsRead: FsReadOps
): Promise<LearnPipelineResult> => {
  const paths = createRuntimeRootPaths(projectRoot);

  // Validate manifest exists
  const manifestExists = await fsRead.exists(paths.manifest);
  if (!manifestExists) {
    return { success: false, error: 'Learn requires a bootstrapped project: manifest not found' };
  }

  // Step 1: Scan incident records (placeholder for MVP)
  const incidentsPath = paths.incidents;
  const incidentsExist = await fsRead.exists(incidentsPath);
  const incidentsScanned = incidentsExist ? 0 : 0;

  // Steps 2-4: Scoring and comparison (placeholder for MVP)
  const candidates: LearnResult['candidates'] = [];

  // Steps 5-6: Proposal materialization (placeholder)
  const proposalMaterialized = false;

  return {
    success: true,
    data: {
      incidentsScanned,
      candidates,
      proposalMaterialized
    }
  };
};
