/**
 * Bootstrap-phase injected-context envelope primitive.
 *
 * Constructs the minimal context envelope that should be
 * injected when the bootstrap.start workflow event fires.
 * Pure function — no side effects.
 */

export type BootstrapEnvelope = {
  event: 'bootstrap.start';
  phase: 'bootstrap';
  adapter_id: string;
  truth_doc_refs: string[];
  instruction_surface_policy: {
    native_surfaces: string[];
    compatibility_surfaces: string[];
    mirror_policy: string;
  };
  provenance: {
    generated_at: string;
  };
};

export type CreateBootstrapEnvelopeInput = {
  adapterId: string;
  truthDocPaths: { prd: string; technical_design: string; implementation_plan: string };
  instructionSurfacePolicy: {
    native_surfaces: string[];
    compatibility_surfaces: string[];
    mirror_policy: string;
  };
};

/**
 * Create the bootstrap injected-context envelope.
 * Pure function — no side effects.
 */
export const createBootstrapEnvelope = (
  input: CreateBootstrapEnvelopeInput
): BootstrapEnvelope => ({
  event: 'bootstrap.start',
  phase: 'bootstrap',
  adapter_id: input.adapterId,
  truth_doc_refs: [
    input.truthDocPaths.prd,
    input.truthDocPaths.technical_design,
    input.truthDocPaths.implementation_plan
  ],
  instruction_surface_policy: {
    native_surfaces: input.instructionSurfacePolicy.native_surfaces,
    compatibility_surfaces: input.instructionSurfacePolicy.compatibility_surfaces,
    mirror_policy: input.instructionSurfacePolicy.mirror_policy
  },
  provenance: {
    generated_at: new Date().toISOString()
  }
});
