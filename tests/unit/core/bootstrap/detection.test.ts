import { describe, expect, it } from 'vitest';
import { detectRepoState, type FsReadOps } from '@codelatch/core';

const createFsRead = (files: Set<string>): FsReadOps => ({
  exists: async (path: string) => files.has(path),
  readdir: async () => [],
  readFile: async () => ''
});

describe('repo detection', () => {
  it('detects a git repo', async () => {
    const fs = createFsRead(new Set(['/project/.git']));
    const result = await detectRepoState('/project', fs);

    expect(result.isGitRepo).toBe(true);
  });

  it('detects no git repo', async () => {
    const fs = createFsRead(new Set());
    const result = await detectRepoState('/project', fs);

    expect(result.isGitRepo).toBe(false);
  });

  it('detects canonical truth docs', async () => {
    const fs = createFsRead(new Set([
      '/project/product-docs/prd.md',
      '/project/product-docs/technical-design.md',
      '/project/product-docs/implementation-plan.md'
    ]));
    const result = await detectRepoState('/project', fs);

    expect(result.existingTruthDocs).toHaveLength(3);
    expect(result.existingTruthDocs.every((d) => d.isCanonical)).toBe(true);
  });

  it('detects non-canonical truth docs', async () => {
    const fs = createFsRead(new Set([
      '/project/product-docs/codelatch-prd.md',
      '/project/product-docs/technical-design.md'
    ]));
    const result = await detectRepoState('/project', fs);

    expect(result.existingTruthDocs).toHaveLength(2);
    const prd = result.existingTruthDocs.find((d) => d.role === 'prd');
    expect(prd?.isCanonical).toBe(false);
    expect(prd?.path).toBe('product-docs/codelatch-prd.md');
  });

  it('detects root files', async () => {
    const fs = createFsRead(new Set([
      '/project/README.md',
      '/project/CHANGELOG.md',
      '/project/AGENTS.md'
    ]));
    const result = await detectRepoState('/project', fs);

    expect(result.existingRootFiles).toContain('README.md');
    expect(result.existingRootFiles).toContain('CHANGELOG.md');
    expect(result.existingRootFiles).toContain('AGENTS.md');
  });

  it('detects host directories', async () => {
    const fs = createFsRead(new Set([
      '/project/.opencode',
      '/project/.claude'
    ]));
    const result = await detectRepoState('/project', fs);

    expect(result.existingHostDirs).toHaveLength(2);
    expect(result.existingHostDirs.map((d) => d.hostId)).toContain('opencode');
    expect(result.existingHostDirs.map((d) => d.hostId)).toContain('claude-code');
  });

  it('detects existing codelatch runtime', async () => {
    const fs = createFsRead(new Set(['/project/.tmp/codelatch']));
    const result = await detectRepoState('/project', fs);

    expect(result.hasExistingCodelatch).toBe(true);
  });

  it('returns empty detection for empty repo', async () => {
    const fs = createFsRead(new Set());
    const result = await detectRepoState('/project', fs);

    expect(result.isGitRepo).toBe(false);
    expect(result.existingTruthDocs).toHaveLength(0);
    expect(result.existingRootFiles).toHaveLength(0);
    expect(result.existingHostDirs).toHaveLength(0);
    expect(result.hasExistingCodelatch).toBe(false);
  });
});
