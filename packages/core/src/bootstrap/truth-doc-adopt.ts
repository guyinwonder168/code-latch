/**
 * Truth-doc adoption and creation for bootstrap.
 *
 * Given detection results and the bootstrap mode, computes
 * the truth-doc registry entries. For fresh bootstrap, uses
 * canonical paths. For adopt/migrate, uses detected paths.
 * Pure function — no side effects.
 */

import type { TruthDocDetection } from './detection.js';
import type { BootstrapMode } from './adopt.js';
import type { TruthDocRegistryInput } from './registry.js';

const CANONICAL_PATHS = {
  prd: 'product-docs/prd.md',
  technical_design: 'product-docs/technical-design.md',
  implementation_plan: 'product-docs/implementation-plan.md'
};

const DEFAULT_VERSIONS = {
  prd: '0.1.0',
  technical_design: '0.1.0',
  implementation_plan: '0.1.0'
};

/**
 * Resolve truth-doc paths based on bootstrap mode.
 * For fresh: use canonical paths.
 * For adopt: use detected non-canonical paths.
 * For migrate: use detected paths (may be canonical).
 * Pure function — no side effects.
 */
export const resolveTruthDocPaths = (
  mode: BootstrapMode,
  detectedDocs: TruthDocDetection[]
): { prd: string; technical_design: string; implementation_plan: string } => {
  const detectedByRole = new Map<string, string>();
  for (const doc of detectedDocs) {
    detectedByRole.set(doc.role, doc.path);
  }

  return {
    prd: detectedByRole.get('prd') ?? CANONICAL_PATHS.prd,
    technical_design: detectedByRole.get('technical_design') ?? CANONICAL_PATHS.technical_design,
    implementation_plan: detectedByRole.get('implementation_plan') ?? CANONICAL_PATHS.implementation_plan
  };
};

/**
 * Build truth-doc registry input for bootstrap.
 * Uses resolved paths and default versions/hashes for new docs.
 * Pure function — no side effects.
 */
export const buildTruthDocRegistryInput = (
  paths: { prd: string; technical_design: string; implementation_plan: string },
  existingVersions?: { prd?: string; technical_design?: string; implementation_plan?: string }
): TruthDocRegistryInput => ({
  prd: {
    path: paths.prd,
    version: existingVersions?.prd ?? DEFAULT_VERSIONS.prd,
    hash: 'sha256:pending'
  },
  technical_design: {
    path: paths.technical_design,
    version: existingVersions?.technical_design ?? DEFAULT_VERSIONS.technical_design,
    hash: 'sha256:pending'
  },
  implementation_plan: {
    path: paths.implementation_plan,
    version: existingVersions?.implementation_plan ?? DEFAULT_VERSIONS.implementation_plan,
    hash: 'sha256:pending'
  }
});
