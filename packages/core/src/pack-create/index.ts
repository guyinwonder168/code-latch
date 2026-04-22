/**
 * Pack-create pipeline for codelatch-pack-create.
 *
 * Section 14.2: Pipeline:
 * 1. identify scope,
 * 2. identify purpose,
 * 3. choose project vs domain pack,
 * 4. generate pack frontmatter,
 * 5. create `index.md`,
 * 6. register pack in project manifest,
 * 7. run overlap/conflict scan,
 * 8. present pack summary.
 */

import type { PackCreateResult } from '@codelatch/workflow-contracts';
import type { FsReadOps } from '../bootstrap/detection.js';
import { createRuntimeRootPaths } from '../bootstrap/runtime-root.js';

export type PackCreateInput = {
  packName: string;
  scope: 'project' | 'domain';
  purpose: string;
};

export type PackCreatePipelineResult = {
  success: true;
  data: PackCreateResult;
} | {
  success: false;
  error: string;
};

/**
 * Execute the pack-create pipeline.
 */
export const executePackCreatePipeline = async (
  projectRoot: string,
  input: PackCreateInput,
  fsRead: FsReadOps
): Promise<PackCreatePipelineResult> => {
  const paths = createRuntimeRootPaths(projectRoot);

  // Validate manifest exists
  const manifestExists = await fsRead.exists(paths.manifest);
  if (!manifestExists) {
    return { success: false, error: 'Pack-create requires a bootstrapped project: manifest not found' };
  }

  // Steps 1-3: scope and purpose are provided by input
  const { packName, scope, purpose } = input;

  // Step 4-5: Generate pack path and frontmatter (placeholder for MVP)
  const packDir = scope === 'project'
    ? `${paths.packsProject}/${packName}`
    : `${paths.packsCache}/${packName}`;
  const packPath = `${packDir}/index.md`;

  // Step 6: Register pack in manifest (placeholder — real implementation would update manifest)
  const registered = true;

  // Step 7: Overlap/conflict scan (placeholder for MVP)
  const overlapScan = {
    conflicts: [] as string[],
    warnings: [] as string[]
  };

  // Step 8: Return summary
  return {
    success: true,
    data: {
      packName,
      packPath,
      scope,
      registered,
      overlapScan
    }
  };
};
