import { describe, expect, it } from 'vitest';

describe('OpenCode adapter shell', () => {
  it('imports the adapter package entrypoint', async () => {
    await expect(import('@codelatch/adapter-opencode')).resolves.toBeDefined();
  });
});
