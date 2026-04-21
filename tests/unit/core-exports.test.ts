import { describe, expect, it } from 'vitest';
import {
  CODELATCH_VERSION,
  createCoreResult,
  type CoreResult,
  createRuntimeRootPaths,
  initializeRuntimeRoot,
  createProjectManifest,
  createTruthDocRegistry,
  resolveInstructionSurfacePolicy,
  createBootstrapEnvelope,
  computeBootstrapAnchors,
  detectRepoState,
  decideBootstrapMode,
  suggestAdapterSelection,
  resolveTruthDocPaths,
  buildTruthDocRegistryInput,
  createBootstrapSummary,
  dispatchCommand
} from '@codelatch/core';
import {
  identity,
  toReadonlyArray,
  type ReadonlyList
} from '@codelatch/shared-utils';

describe('core and shared utils exports', () => {
  it('exports a stable core placeholder surface', () => {
    const result: CoreResult<string> = createCoreResult('ready');

    expect(CODELATCH_VERSION).toBe('0.1.0');
    expect(result).toEqual({ status: 'ready', data: 'ready' });
  });

  it('exports tiny pure helpers used by the shared layer', () => {
    const values: ReadonlyList<string> = toReadonlyArray(['a', 'b']);

    expect(identity('value')).toBe('value');
    expect(values).toEqual(['a', 'b']);
  });

  it('exports bootstrap module functions', () => {
    expect(typeof createRuntimeRootPaths).toBe('function');
    expect(typeof initializeRuntimeRoot).toBe('function');
    expect(typeof createProjectManifest).toBe('function');
    expect(typeof createTruthDocRegistry).toBe('function');
    expect(typeof resolveInstructionSurfacePolicy).toBe('function');
    expect(typeof createBootstrapEnvelope).toBe('function');
    expect(typeof computeBootstrapAnchors).toBe('function');
    expect(typeof detectRepoState).toBe('function');
    expect(typeof decideBootstrapMode).toBe('function');
    expect(typeof suggestAdapterSelection).toBe('function');
    expect(typeof resolveTruthDocPaths).toBe('function');
    expect(typeof buildTruthDocRegistryInput).toBe('function');
    expect(typeof createBootstrapSummary).toBe('function');
    expect(typeof dispatchCommand).toBe('function');
  });
});
