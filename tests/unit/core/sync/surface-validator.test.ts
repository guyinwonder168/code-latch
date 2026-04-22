import { describe, expect, it } from 'vitest';
import { validateInstructionSurfaces } from '@codelatch/core';

describe('instruction-surface validator', () => {
  it('passes when all native surfaces exist', () => {
    const result = validateInstructionSurfaces({
      policy: {
        native_surfaces: ['AGENTS.md'],
        compatibility_surfaces: [],
        mirror_policy: 'explicit-only'
      },
      actualSurfaces: ['AGENTS.md']
    });

    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
    expect(result.extra).toEqual([]);
  });

  it('detects missing native surfaces', () => {
    const result = validateInstructionSurfaces({
      policy: {
        native_surfaces: ['AGENTS.md', 'CLAUDE.md'],
        compatibility_surfaces: [],
        mirror_policy: 'explicit-only'
      },
      actualSurfaces: ['AGENTS.md']
    });

    expect(result.valid).toBe(false);
    expect(result.missing).toEqual(['CLAUDE.md']);
    expect(result.extra).toEqual([]);
  });

  it('detects extra surfaces not in policy', () => {
    const result = validateInstructionSurfaces({
      policy: {
        native_surfaces: ['AGENTS.md'],
        compatibility_surfaces: [],
        mirror_policy: 'explicit-only'
      },
      actualSurfaces: ['AGENTS.md', 'CLAUDE.md']
    });

    expect(result.valid).toBe(false);
    expect(result.missing).toEqual([]);
    expect(result.extra).toEqual(['CLAUDE.md']);
  });

  it('passes with compatibility surfaces that are in policy', () => {
    const result = validateInstructionSurfaces({
      policy: {
        native_surfaces: ['AGENTS.md'],
        compatibility_surfaces: ['CLAUDE.md'],
        mirror_policy: 'opt-in'
      },
      actualSurfaces: ['AGENTS.md', 'CLAUDE.md']
    });

    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
    expect(result.extra).toEqual([]);
  });

  it('detects both missing and extra surfaces', () => {
    const result = validateInstructionSurfaces({
      policy: {
        native_surfaces: ['AGENTS.md', 'CLAUDE.md'],
        compatibility_surfaces: [],
        mirror_policy: 'explicit-only'
      },
      actualSurfaces: ['AGENTS.md', '.claude/CLAUDE.md']
    });

    expect(result.valid).toBe(false);
    expect(result.missing).toEqual(['CLAUDE.md']);
    expect(result.extra).toEqual(['.claude/CLAUDE.md']);
  });

  it('produces an empty summary when valid', () => {
    const result = validateInstructionSurfaces({
      policy: {
        native_surfaces: ['AGENTS.md'],
        compatibility_surfaces: [],
        mirror_policy: 'explicit-only'
      },
      actualSurfaces: ['AGENTS.md']
    });

    expect(result.summary).toBe('All instruction surfaces match the manifest policy.');
  });

  it('produces a descriptive summary when surfaces are missing', () => {
    const result = validateInstructionSurfaces({
      policy: {
        native_surfaces: ['AGENTS.md', 'CLAUDE.md'],
        compatibility_surfaces: [],
        mirror_policy: 'explicit-only'
      },
      actualSurfaces: ['AGENTS.md']
    });

    expect(result.summary).toContain('CLAUDE.md');
    expect(result.summary).toContain('Missing');
  });
});
