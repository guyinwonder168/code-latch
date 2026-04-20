import { describe, expect, it } from 'vitest';
import {
  CODELATCH_VERSION,
  createCoreResult,
  type CoreResult
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
});
