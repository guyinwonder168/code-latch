import { describe, expect, it } from 'vitest';
import { createBootstrapSummary } from '@codelatch/core';

describe('bootstrap summary', () => {
  it('creates a summary with all fields', () => {
    const summary = createBootstrapSummary({
      mode: 'fresh',
      adapters: ['opencode'],
      createdPaths: ['/project/.tmp/codelatch/project-manifest.json', '/project/AGENTS.md'],
      adoptedPaths: [],
      instructionSurfaces: ['AGENTS.md'],
      runtimeRoot: '/project/.tmp/codelatch',
      truthDocPaths: {
        prd: 'product-docs/prd.md',
        technical_design: 'product-docs/technical-design.md',
        implementation_plan: 'product-docs/implementation-plan.md'
      }
    });

    expect(summary.mode).toBe('fresh');
    expect(summary.adapters).toEqual(['opencode']);
    expect(summary.createdPaths).toHaveLength(2);
    expect(summary.adoptedPaths).toHaveLength(0);
    expect(summary.instructionSurfaces).toContain('AGENTS.md');
  });

  it('tracks adopted paths for non-fresh bootstrap', () => {
    const summary = createBootstrapSummary({
      mode: 'adopt',
      adapters: ['opencode'],
      createdPaths: ['/project/.tmp/codelatch/project-manifest.json'],
      adoptedPaths: ['product-docs/codelatch-prd.md'],
      instructionSurfaces: ['AGENTS.md'],
      runtimeRoot: '/project/.tmp/codelatch',
      truthDocPaths: {
        prd: 'product-docs/codelatch-prd.md',
        technical_design: 'product-docs/technical-design.md',
        implementation_plan: 'product-docs/implementation-plan.md'
      }
    });

    expect(summary.mode).toBe('adopt');
    expect(summary.adoptedPaths).toContain('product-docs/codelatch-prd.md');
  });
});
