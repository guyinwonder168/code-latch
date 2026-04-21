import { describe, expect, it } from 'vitest';
import { createTruthDocRegistry } from '@codelatch/core';
import { TruthDocRegistrySchema } from '@codelatch/schemas';

describe('truth-doc-registry creation', () => {
  const baseInput = {
    prd: { path: 'product-docs/prd.md', version: '0.2.8', hash: 'sha256:abc123' },
    technical_design: { path: 'product-docs/technical-design.md', version: '0.2.15', hash: 'sha256:def456' },
    implementation_plan: { path: 'product-docs/implementation-plan.md', version: '0.1.2', hash: 'sha256:ghi789' }
  };

  it('creates a registry with all three truth-doc entries', () => {
    const registry = createTruthDocRegistry(baseInput);

    expect(registry.truth_docs.prd.path).toBe('product-docs/prd.md');
    expect(registry.truth_docs.technical_design.path).toBe('product-docs/technical-design.md');
    expect(registry.truth_docs.implementation_plan.path).toBe('product-docs/implementation-plan.md');
  });

  it('preserves version and hash for each entry', () => {
    const registry = createTruthDocRegistry(baseInput);

    expect(registry.truth_docs.prd.version).toBe('0.2.8');
    expect(registry.truth_docs.prd.hash).toBe('sha256:abc123');
    expect(registry.truth_docs.technical_design.version).toBe('0.2.15');
    expect(registry.truth_docs.implementation_plan.hash).toBe('sha256:ghi789');
  });

  it('sets updated_at to an ISO timestamp', () => {
    const registry = createTruthDocRegistry(baseInput);

    expect(registry.updated_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('produces a schema-valid registry', () => {
    const registry = createTruthDocRegistry(baseInput);
    const result = TruthDocRegistrySchema.safeParse(registry);

    expect(result.success).toBe(true);
  });

  it('handles adopted-repository non-canonical paths', () => {
    const registry = createTruthDocRegistry({
      prd: { path: 'product-docs/codelatch-prd.md', version: '0.2.8', hash: 'sha256:abc' },
      technical_design: { path: 'product-docs/technical-design.md', version: '0.2.15', hash: 'sha256:def' },
      implementation_plan: { path: 'product-docs/implementation-plan.md', version: '0.1.2', hash: 'sha256:ghi' }
    });
    const result = TruthDocRegistrySchema.safeParse(registry);

    expect(result.success).toBe(true);
    expect(registry.truth_docs.prd.path).toBe('product-docs/codelatch-prd.md');
  });
});
