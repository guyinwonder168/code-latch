/**
 * Promote pipeline for codelatch-promote.
 *
 * Section 14.6: Pipeline:
 * 1. load approved project-level lessons,
 * 2. compare with global pack catalog,
 * 3. compare with previously promoted lessons,
 * 4. generate promotion candidates,
 * 5. create promotion proposal draft metadata and optional review material,
 * 6. require explicit approval before publishing or promoting.
 */

import type { PromoteResult } from '@codelatch/workflow-contracts';
import type { FsReadOps } from '../bootstrap/detection.js';
import { createRuntimeRootPaths } from '../bootstrap/runtime-root.js';

export type PromoteInput = {
  compareWithGlobal: boolean;
  maxCandidates: number;
};

export type PromotePipelineResult = {
  success: true;
  data: PromoteResult;
} | {
  success: false;
  error: string;
};

/**
 * Execute the promote pipeline.
 */
export const executePromotePipeline = async (
  projectRoot: string,
  input: PromoteInput,
  fsRead: FsReadOps
): Promise<PromotePipelineResult> => {
  const paths = createRuntimeRootPaths(projectRoot);

  // Validate manifest exists
  const manifestExists = await fsRead.exists(paths.manifest);
  if (!manifestExists) {
    return { success: false, error: 'Promote requires a bootstrapped project: manifest not found' };
  }

  // Step 1: Load approved project-level lessons (placeholder for MVP)
  const lessonsLoaded = 0;

  // Steps 2-4: Compare and generate candidates (placeholder)
  const candidates: PromoteResult['candidates'] = [];

  // Step 5: Proposal materialization (placeholder)
  const proposalMaterialized = false;

  return {
    success: true,
    data: {
      lessonsLoaded,
      candidates,
      proposalMaterialized
    }
  };
};
