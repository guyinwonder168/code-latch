/**
 * Instruction-surface validation against manifest policy.
 *
 * Validates actual instruction anchors against the enabled
 * adapter set and any explicit compatibility-mirror policy
 * recorded in the project manifest.
 *
 * Pure function — no side effects.
 */

import type { InstructionSurfacePolicy } from '@codelatch/workflow-contracts';

export type SurfaceValidationInput = {
  policy: InstructionSurfacePolicy;
  actualSurfaces: string[];
};

export type SurfaceValidationResult = {
  valid: boolean;
  missing: string[];
  extra: string[];
  summary: string;
};

/**
 * Validate actual instruction surfaces against the manifest policy.
 *
 * Returns:
 * - missing: surfaces the policy expects but are not present
 * - extra: surfaces present but not expected by the policy
 * - valid: true when both missing and extra are empty
 *
 * Pure function — no side effects.
 */
export const validateInstructionSurfaces = (input: SurfaceValidationInput): SurfaceValidationResult => {
  const expectedSet = new Set([
    ...input.policy.native_surfaces,
    ...input.policy.compatibility_surfaces
  ]);

  const actualSet = new Set(input.actualSurfaces);

  const missing = input.policy.native_surfaces.filter(s => !actualSet.has(s));
  const extra = input.actualSurfaces.filter(s => !expectedSet.has(s));

  const valid = missing.length === 0 && extra.length === 0;

  const parts: string[] = [];
  if (missing.length > 0) {
    parts.push(`Missing native surfaces: ${missing.join(', ')}`);
  }
  if (extra.length > 0) {
    parts.push(`Extra surfaces not in policy: ${extra.join(', ')}`);
  }

  const summary = valid
    ? 'All instruction surfaces match the manifest policy.'
    : parts.join('. ') + '.';

  return { valid, missing, extra, summary };
};
