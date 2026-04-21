import { describe, expect, it } from 'vitest';
import { createBootstrapEnvelope } from '@codelatch/core';

describe('bootstrap envelope', () => {
  const baseInput = {
    adapterId: 'opencode',
    truthDocPaths: {
      prd: 'product-docs/prd.md',
      technical_design: 'product-docs/technical-design.md',
      implementation_plan: 'product-docs/implementation-plan.md'
    },
    instructionSurfacePolicy: {
      native_surfaces: ['AGENTS.md'],
      compatibility_surfaces: [],
      mirror_policy: 'explicit-only'
    }
  };

  it('creates an envelope with the bootstrap.start event', () => {
    const envelope = createBootstrapEnvelope(baseInput);

    expect(envelope.event).toBe('bootstrap.start');
    expect(envelope.phase).toBe('bootstrap');
  });

  it('includes the adapter identifier', () => {
    const envelope = createBootstrapEnvelope(baseInput);

    expect(envelope.adapter_id).toBe('opencode');
  });

  it('references all three truth-doc paths', () => {
    const envelope = createBootstrapEnvelope(baseInput);

    expect(envelope.truth_doc_refs).toEqual([
      'product-docs/prd.md',
      'product-docs/technical-design.md',
      'product-docs/implementation-plan.md'
    ]);
  });

  it('preserves the instruction-surface policy', () => {
    const envelope = createBootstrapEnvelope(baseInput);

    expect(envelope.instruction_surface_policy.native_surfaces).toEqual(['AGENTS.md']);
    expect(envelope.instruction_surface_policy.mirror_policy).toBe('explicit-only');
  });

  it('includes provenance with an ISO timestamp', () => {
    const envelope = createBootstrapEnvelope(baseInput);

    expect(envelope.provenance.generated_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
