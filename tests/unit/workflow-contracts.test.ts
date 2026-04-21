import { describe, expect, it } from 'vitest';
import {
  CanonicalCommand,
  WorkflowEvent,
  WorkflowPhase,
  type CommandContext,
  type BootstrapResult,
  type InstructionSurfacePolicy,
  type CommandFailure,
  type CommandResult,
  type CommandSuccess,
  type InjectionPolicy
} from '@codelatch/workflow-contracts';

describe('workflow contracts', () => {
  it('exports canonical commands from the truth docs', () => {
    expect(Object.values(CanonicalCommand)).toEqual([
      'codelatch-bootstrap',
      'codelatch-sync',
      'codelatch-pack-create',
      'codelatch-learn',
      'codelatch-clean',
      'codelatch-audit',
      'codelatch-promote'
    ]);
  });

  it('exports canonical workflow events from the technical design', () => {
    expect(Object.values(WorkflowEvent)).toEqual([
      'bootstrap.start',
      'brainstorm.start',
      'sync.start',
      'exact-plan.generate',
      'approval.checkpoint',
      'execution.step',
      'drift.stop',
      'review.checkpoint',
      'learn.review',
      'promote.review'
    ]);
  });

  it('exports canonical workflow phases', () => {
    expect(Object.values(WorkflowPhase)).toEqual([
      'bootstrap',
      'brainstorm',
      'sync',
      'exact-plan',
      'free-run',
      'review',
      'learn',
      'promote'
    ]);
  });

  it('exports a command context type', () => {
    const context: CommandContext = {
      adapterId: 'opencode',
      projectRoot: '/project',
      command: CanonicalCommand.BOOTSTRAP
    };

    expect(context.command).toBe('codelatch-bootstrap');
  });

  it('exports a bootstrap result type', () => {
    const result: BootstrapResult = {
      runtimeRoot: '.tmp/codelatch',
      manifestPath: '.tmp/codelatch/project-manifest.json',
      registryPath: '.tmp/codelatch/truth-doc-registry.json',
      versionGovernorPath: '.tmp/codelatch/version-governor.json',
      instructionSurfaces: ['AGENTS.md'],
      adapterSet: ['opencode']
    };

    expect(result.runtimeRoot).toBe('.tmp/codelatch');
  });

  it('exports an instruction-surface policy type', () => {
    const policy: InstructionSurfacePolicy = {
      native_surfaces: ['AGENTS.md'],
      compatibility_surfaces: [],
      mirror_policy: 'explicit-only'
    };

    expect(policy.native_surfaces).toContain('AGENTS.md');
  });

  it('supports successful command results', () => {
    const result: CommandSuccess = { success: true };

    expect(result).toEqual({ success: true });
  });

  it('supports failed command results', () => {
    const result: CommandFailure = {
      success: false,
      error: 'command failed'
    };

    expect(result).toEqual({
      success: false,
      error: 'command failed'
    });
  });

  it('exports a minimal injection policy contract', () => {
    const policy: InjectionPolicy = {
      id: 'approval-anchor-plus-scope',
      requiredTruthDocs: ['prd', 'technical-design'],
      optionalPacks: ['brainstorming'],
      optionalIncidents: ['incident-123'],
      allowHotSnippets: false,
      budgetOverflow: 'stop',
      reproducibilityRefs: ['truth-doc:prd@sha256:abc123']
    };
    const result: CommandResult = { success: true };

    expect({ policy, result }).toEqual({
      policy: {
        id: 'approval-anchor-plus-scope',
        requiredTruthDocs: ['prd', 'technical-design'],
        optionalPacks: ['brainstorming'],
        optionalIncidents: ['incident-123'],
        allowHotSnippets: false,
        budgetOverflow: 'stop',
        reproducibilityRefs: ['truth-doc:prd@sha256:abc123']
      },
      result: { success: true }
    });
  });
});
