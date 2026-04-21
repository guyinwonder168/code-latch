import { describe, expect, it } from 'vitest';
import { resolveInstructionSurfacePolicy } from '@codelatch/core';

describe('instruction-surface policy resolution', () => {
  it('resolves native surfaces for OpenCode alone', () => {
    const policy = resolveInstructionSurfacePolicy(['opencode']);

    expect(policy.native_surfaces).toEqual(['AGENTS.md']);
    expect(policy.compatibility_surfaces).toEqual([]);
    expect(policy.mirror_policy).toBe('explicit-only');
  });

  it('resolves native surfaces for Claude Code alone', () => {
    const policy = resolveInstructionSurfacePolicy(['claude-code']);

    expect(policy.native_surfaces).toEqual(['CLAUDE.md', '.claude/CLAUDE.md']);
  });

  it('resolves native surfaces for Codex alone', () => {
    const policy = resolveInstructionSurfacePolicy(['codex']);

    expect(policy.native_surfaces).toEqual(['AGENTS.md']);
  });

  it('resolves native surfaces for Kilo Code alone', () => {
    const policy = resolveInstructionSurfacePolicy(['kilocode']);

    expect(policy.native_surfaces).toEqual(['AGENTS.md']);
  });

  it('deduplicates shared surfaces across adapters', () => {
    const policy = resolveInstructionSurfacePolicy(['opencode', 'codex', 'kilocode']);

    // All three use AGENTS.md — should appear once
    expect(policy.native_surfaces).toEqual(['AGENTS.md']);
  });

  it('combines distinct surfaces from OpenCode + Claude Code', () => {
    const policy = resolveInstructionSurfacePolicy(['opencode', 'claude-code']);

    expect(policy.native_surfaces).toContain('AGENTS.md');
    expect(policy.native_surfaces).toContain('CLAUDE.md');
    expect(policy.native_surfaces).toContain('.claude/CLAUDE.md');
    expect(policy.native_surfaces).toHaveLength(3);
  });

  it('combines surfaces from all four adapters', () => {
    const policy = resolveInstructionSurfacePolicy(['opencode', 'claude-code', 'codex', 'kilocode']);

    expect(policy.native_surfaces).toContain('AGENTS.md');
    expect(policy.native_surfaces).toContain('CLAUDE.md');
    expect(policy.native_surfaces).toContain('.claude/CLAUDE.md');
    expect(policy.native_surfaces).toHaveLength(3);
  });

  it('defaults to explicit-only mirror policy', () => {
    const policy = resolveInstructionSurfacePolicy(['opencode']);

    expect(policy.mirror_policy).toBe('explicit-only');
  });
});
