import { describe, expect, it } from 'vitest';
import { buildSyncReport, shouldMaterializeReport } from '@codelatch/core';
import { DriftClass, type DriftFinding } from '@codelatch/workflow-contracts';

describe('sync report builder', () => {
  const baseFindings: DriftFinding[] = [
    {
      kind: 'registry-path-mismatch',
      driftClass: DriftClass.CLASS_0,
      severity: 'low',
      message: 'Registry path mismatch detected.',
      pointers: ['product-docs/prd.md']
    }
  ];

  it('builds a sync report with correct shape', () => {
    const report = buildSyncReport({
      findings: baseFindings,
      proposedWrites: [],
      runId: 'run_20260421_120000'
    });

    expect(report.run_id).toBe('run_20260421_120000');
    expect(report.command).toBe('codelatch-sync');
    expect(report.highest_drift_class).toBe(0);
    expect(report.findings).toEqual([{
      kind: 'registry-path-mismatch',
      drift_class: DriftClass.CLASS_0,
      severity: 'low',
      message: 'Registry path mismatch detected.',
      pointers: ['product-docs/prd.md']
    }]);
    expect(report.requires_hard_stop).toBe(false);
    expect(report.requires_rebrainstorm).toBe(false);
    expect(report.generated_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('sets highest_drift_class to the maximum finding class', () => {
    const findings: DriftFinding[] = [
      { kind: 'meta', driftClass: DriftClass.CLASS_0, severity: 'low', message: 'm1', pointers: ['a'] },
      { kind: 'structural', driftClass: DriftClass.CLASS_1, severity: 'medium', message: 'm2', pointers: ['b'] }
    ];

    const report = buildSyncReport({
      findings,
      proposedWrites: [],
      runId: 'run_20260421_120000'
    });

    expect(report.highest_drift_class).toBe(1);
    expect(report.requires_hard_stop).toBe(true);
    expect(report.requires_rebrainstorm).toBe(false);
  });

  it('sets requires_rebrainstorm when Class 2 findings exist', () => {
    const findings: DriftFinding[] = [
      { kind: 'semantic', driftClass: DriftClass.CLASS_2, severity: 'high', message: 'm1', pointers: ['a'] }
    ];

    const report = buildSyncReport({
      findings,
      proposedWrites: [],
      runId: 'run_20260421_120000'
    });

    expect(report.requires_rebrainstorm).toBe(true);
  });

  it('includes proposed writes in the report', () => {
    const report = buildSyncReport({
      findings: baseFindings,
      proposedWrites: [
        { targetPath: 'product-docs/prd.md', description: 'Update registry path', driftClass: DriftClass.CLASS_0, requiresApproval: true }
      ],
      runId: 'run_20260421_120000'
    });

    expect(report.proposed_writes.length).toBe(1);
    expect(report.proposed_writes[0].target_path).toBe('product-docs/prd.md');
  });

  it('generates a report_doc_ref path under .tmp/codelatch/sync/', () => {
    const report = buildSyncReport({
      findings: baseFindings,
      proposedWrites: [],
      runId: 'run_20260421_120000'
    });

    expect(report.report_doc_ref).toContain('.tmp/codelatch/sync/');
    expect(report.report_doc_ref).toMatch(/sync_.*\.md$/);
  });
});

describe('sync report materialization decision', () => {
  it('materializes report when findings exist', () => {
    const decision = shouldMaterializeReport({
      findings: [
        { kind: 'meta', driftClass: DriftClass.CLASS_0, severity: 'low', message: 'm1', pointers: ['a'] }
      ],
      proposedWrites: []
    });

    expect(decision.shouldMaterialize).toBe(true);
  });

  it('materializes report when proposed writes exist', () => {
    const decision = shouldMaterializeReport({
      findings: [],
      proposedWrites: [
        { targetPath: 'a.md', description: 'update', driftClass: DriftClass.CLASS_0, requiresApproval: true }
      ]
    });

    expect(decision.shouldMaterialize).toBe(true);
  });

  it('does NOT materialize report when no findings and no writes', () => {
    const decision = shouldMaterializeReport({
      findings: [],
      proposedWrites: []
    });

    expect(decision.shouldMaterialize).toBe(false);
  });

  it('materializes report for Class 1 hard-stop findings', () => {
    const decision = shouldMaterializeReport({
      findings: [
        { kind: 'structural', driftClass: DriftClass.CLASS_1, severity: 'medium', message: 'm1', pointers: ['a'] }
      ],
      proposedWrites: []
    });

    expect(decision.shouldMaterialize).toBe(true);
  });

  it('materializes report for Class 2 re-brainstorm findings', () => {
    const decision = shouldMaterializeReport({
      findings: [
        { kind: 'semantic', driftClass: DriftClass.CLASS_2, severity: 'high', message: 'm1', pointers: ['a'] }
      ],
      proposedWrites: []
    });

    expect(decision.shouldMaterialize).toBe(true);
  });
});
