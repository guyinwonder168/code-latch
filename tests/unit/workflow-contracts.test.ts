import { describe, expect, it } from 'vitest';
import {
  CanonicalCommand,
  WorkflowEvent,
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
