import { describe, expect, it } from 'vitest';
import { buildProposedWrites } from '@codelatch/core';
import { DriftClass, type DriftFinding } from '@codelatch/workflow-contracts';

describe('proposed writes builder', () => {
  it('returns empty writes when no findings exist', () => {
    const result = buildProposedWrites({ findings: [] });

    expect(result.writes).toEqual([]);
  });

  it('creates a proposed write for Class 0 findings that requires approval', () => {
    const findings: DriftFinding[] = [
      {
        kind: 'registry-path-mismatch',
        driftClass: DriftClass.CLASS_0,
        severity: 'low',
        message: 'Registry path mismatch detected.',
        pointers: ['product-docs/prd.md']
      }
    ];

    const result = buildProposedWrites({ findings });

    expect(result.writes.length).toBe(1);
    expect(result.writes[0].driftClass).toBe(DriftClass.CLASS_0);
    expect(result.writes[0].requiresApproval).toBe(true);
    expect(result.writes[0].targetPath).toBe('product-docs/prd.md');
  });

  it('does not auto-propose writes for Class 1 findings (requires hard stop)', () => {
    const findings: DriftFinding[] = [
      {
        kind: 'structural-design-change',
        driftClass: DriftClass.CLASS_1,
        severity: 'medium',
        message: 'Technical design changed without PRD change.',
        pointers: ['product-docs/technical-design.md']
      }
    ];

    const result = buildProposedWrites({ findings });

    // Class 1 requires hard stop + doc update before writes
    expect(result.writes.length).toBe(0);
    expect(result.hardStopRequired).toBe(true);
  });

  it('does not auto-propose writes for Class 2 findings (requires re-brainstorm)', () => {
    const findings: DriftFinding[] = [
      {
        kind: 'prd-behavior-change',
        driftClass: DriftClass.CLASS_2,
        severity: 'high',
        message: 'PRD content changed since last anchor.',
        pointers: ['product-docs/prd.md']
      }
    ];

    const result = buildProposedWrites({ findings });

    // Class 2 requires re-brainstorm before writes
    expect(result.writes.length).toBe(0);
    expect(result.rebrainstormRequired).toBe(true);
  });

  it('proposes writes for Class 0 findings even alongside Class 1', () => {
    const findings: DriftFinding[] = [
      {
        kind: 'registry-path-mismatch',
        driftClass: DriftClass.CLASS_0,
        severity: 'low',
        message: 'Registry path mismatch.',
        pointers: ['product-docs/prd.md']
      },
      {
        kind: 'structural-design-change',
        driftClass: DriftClass.CLASS_1,
        severity: 'medium',
        message: 'Technical design changed.',
        pointers: ['product-docs/technical-design.md']
      }
    ];

    const result = buildProposedWrites({ findings });

    // Only Class 0 findings generate proposed writes
    expect(result.writes.length).toBe(1);
    expect(result.writes[0].driftClass).toBe(DriftClass.CLASS_0);
    expect(result.hardStopRequired).toBe(true);
  });

  it('all proposed writes require approval before write', () => {
    const findings: DriftFinding[] = [
      {
        kind: 'registry-path-mismatch',
        driftClass: DriftClass.CLASS_0,
        severity: 'low',
        message: 'Registry path mismatch.',
        pointers: ['product-docs/prd.md']
      },
      {
        kind: 'extra-instruction-surface',
        driftClass: DriftClass.CLASS_0,
        severity: 'low',
        message: 'Extra instruction surface found.',
        pointers: ['CLAUDE.md']
      }
    ];

    const result = buildProposedWrites({ findings });

    for (const write of result.writes) {
      expect(write.requiresApproval).toBe(true);
    }
  });
});
