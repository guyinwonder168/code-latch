import { describe, expect, it } from 'vitest';

describe('workspace foundation', () => {
  it('exposes foundational package entrypoints', async () => {
    await expect(import('@codelatch/core')).resolves.toBeDefined();
    await expect(import('@codelatch/schemas')).resolves.toBeDefined();
    await expect(import('@codelatch/workflow-contracts')).resolves.toBeDefined();
    await expect(import('@codelatch/adapter-base')).resolves.toBeDefined();
    await expect(import('@codelatch/shared-utils')).resolves.toBeDefined();
  });
});
