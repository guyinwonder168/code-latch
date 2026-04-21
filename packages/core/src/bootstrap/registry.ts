/**
 * Truth-doc-registry creation for bootstrap.
 *
 * Pure function that builds a validated TruthDocRegistry
 * from bootstrap inputs. Schema validation is the caller's
 * responsibility — this module produces the correct shape.
 */

import type { TruthDocRegistry } from '@codelatch/schemas';

export type TruthDocRegistryInput = {
  prd: { path: string; version: string; hash: string };
  technical_design: { path: string; version: string; hash: string };
  implementation_plan: { path: string; version: string; hash: string };
};

/**
 * Create a TruthDocRegistry from bootstrap inputs.
 * Pure function — no side effects.
 */
export const createTruthDocRegistry = (input: TruthDocRegistryInput): TruthDocRegistry => ({
  truth_docs: {
    prd: input.prd,
    technical_design: input.technical_design,
    implementation_plan: input.implementation_plan
  },
  updated_at: new Date().toISOString()
});
