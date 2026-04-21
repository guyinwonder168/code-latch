/**
 * Instruction-surface policy resolution for bootstrap.
 *
 * Determines which instruction surfaces are native vs
 * compatibility for each enabled adapter set.
 * Pure function — no side effects.
 */

import type { AdapterId } from '@codelatch/schemas';
import type { InstructionSurfacePolicy } from '@codelatch/workflow-contracts';

const NATIVE_SURFACES: Record<AdapterId, string[]> = {
  opencode: ['AGENTS.md'],
  'claude-code': ['CLAUDE.md', '.claude/CLAUDE.md'],
  codex: ['AGENTS.md'],
  kilocode: ['AGENTS.md']
};

/**
 * Resolve the instruction-surface policy for an enabled adapter set.
 * Native surfaces are the union of each adapter's native instruction anchors.
 * Compatibility surfaces are empty by default (explicit-only mirror policy).
 */
export const resolveInstructionSurfacePolicy = (
  adapters: AdapterId[]
): InstructionSurfacePolicy => {
  const nativeSurfaces = new Set<string>();

  for (const adapterId of adapters) {
    for (const surface of NATIVE_SURFACES[adapterId]) {
      nativeSurfaces.add(surface);
    }
  }

  return {
    native_surfaces: [...nativeSurfaces],
    compatibility_surfaces: [],
    mirror_policy: 'explicit-only'
  };
};
