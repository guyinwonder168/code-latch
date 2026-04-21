import { describe, expect, it } from 'vitest';
import { resolveTruthDocPaths, buildTruthDocRegistryInput } from '@codelatch/core';

describe('truth-doc adoption', () => {
  describe('resolveTruthDocPaths', () => {
    it('uses canonical paths for fresh bootstrap', () => {
      const paths = resolveTruthDocPaths('fresh', []);

      expect(paths.prd).toBe('product-docs/prd.md');
      expect(paths.technical_design).toBe('product-docs/technical-design.md');
      expect(paths.implementation_plan).toBe('product-docs/implementation-plan.md');
    });

    it('uses detected non-canonical paths for adopt', () => {
      const paths = resolveTruthDocPaths('adopt', [
        { role: 'prd', path: 'product-docs/codelatch-prd.md', isCanonical: false },
        { role: 'technical_design', path: 'product-docs/technical-design.md', isCanonical: true }
      ]);

      expect(paths.prd).toBe('product-docs/codelatch-prd.md');
      expect(paths.technical_design).toBe('product-docs/technical-design.md');
      expect(paths.implementation_plan).toBe('product-docs/implementation-plan.md');
    });

    it('falls back to canonical paths for missing roles', () => {
      const paths = resolveTruthDocPaths('adopt', [
        { role: 'prd', path: 'docs/prd.md', isCanonical: false }
      ]);

      expect(paths.prd).toBe('docs/prd.md');
      expect(paths.technical_design).toBe('product-docs/technical-design.md');
    });
  });

  describe('buildTruthDocRegistryInput', () => {
    it('builds registry input with default versions', () => {
      const input = buildTruthDocRegistryInput({
        prd: 'product-docs/prd.md',
        technical_design: 'product-docs/technical-design.md',
        implementation_plan: 'product-docs/implementation-plan.md'
      });

      expect(input.prd.version).toBe('0.1.0');
      expect(input.prd.hash).toBe('sha256:pending');
      expect(input.technical_design.path).toBe('product-docs/technical-design.md');
    });

    it('uses provided versions when available', () => {
      const input = buildTruthDocRegistryInput(
        {
          prd: 'product-docs/prd.md',
          technical_design: 'product-docs/technical-design.md',
          implementation_plan: 'product-docs/implementation-plan.md'
        },
        { prd: '0.2.8', technical_design: '0.2.15' }
      );

      expect(input.prd.version).toBe('0.2.8');
      expect(input.technical_design.version).toBe('0.2.15');
      expect(input.implementation_plan.version).toBe('0.1.0');
    });
  });
});
