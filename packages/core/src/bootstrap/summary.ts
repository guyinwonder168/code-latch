/**
 * Bootstrap summary generation.
 *
 * Produces a structured summary of what the bootstrap
 * pipeline created, wrote, or adopted. Pure function —
 * no side effects.
 */

import type { BootstrapMode } from './adopt.js';
import type { AdapterId } from '@codelatch/schemas';

export type BootstrapSummary = {
  mode: BootstrapMode;
  adapters: AdapterId[];
  createdPaths: string[];
  adoptedPaths: string[];
  instructionSurfaces: string[];
  runtimeRoot: string;
  truthDocPaths: {
    prd: string;
    technical_design: string;
    implementation_plan: string;
  };
};

/**
 * Create a bootstrap summary from pipeline results.
 * Pure function — no side effects.
 */
export const createBootstrapSummary = (input: {
  mode: BootstrapMode;
  adapters: AdapterId[];
  createdPaths: string[];
  adoptedPaths: string[];
  instructionSurfaces: string[];
  runtimeRoot: string;
  truthDocPaths: { prd: string; technical_design: string; implementation_plan: string };
}): BootstrapSummary => ({
  mode: input.mode,
  adapters: input.adapters,
  createdPaths: input.createdPaths,
  adoptedPaths: input.adoptedPaths,
  instructionSurfaces: input.instructionSurfaces,
  runtimeRoot: input.runtimeRoot,
  truthDocPaths: input.truthDocPaths
});
