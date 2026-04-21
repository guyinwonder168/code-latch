import { describe, expect, it } from 'vitest';
import { createProjectManifest } from '@codelatch/core';
import { ProjectManifestSchema, type AdapterId } from '@codelatch/schemas';

describe('manifest creation', () => {
  const baseInput = {
    projectId: 'test-project',
    adapters: ['opencode'] as AdapterId[],
    profile: 'coding-development',
    truthDocPaths: {
      prd: 'product-docs/prd.md',
      technical_design: 'product-docs/technical-design.md',
      implementation_plan: 'product-docs/implementation-plan.md'
    },
    instructionSurfacePolicy: {
      native_surfaces: ['AGENTS.md'],
      compatibility_surfaces: [],
      mirror_policy: 'explicit-only'
    }
  };

  it('creates a manifest with correct framework version', () => {
    const manifest = createProjectManifest(baseInput);

    expect(manifest.framework_version).toBe('0.1.0');
    expect(manifest.project_id).toBe('test-project');
    expect(manifest.runtime_root).toBe('.tmp/codelatch');
  });

  it('includes the specified adapter set', () => {
    const manifest = createProjectManifest(baseInput);

    expect(manifest.adapters).toEqual(['opencode']);
  });

  it('uses default procedural bundles when none specified', () => {
    const manifest = createProjectManifest(baseInput);

    expect(manifest.installed_procedural_bundles).toEqual({
      skills: ['official/core'],
      agents: ['official/core'],
      instructions: ['official/core'],
      host_integrations: ['official/core']
    });
  });

  it('merges custom procedural bundles with defaults', () => {
    const manifest = createProjectManifest({
      ...baseInput,
      proceduralBundles: { skills: ['custom/skills'] }
    });

    expect(manifest.installed_procedural_bundles.skills).toEqual(['custom/skills']);
    expect(manifest.installed_procedural_bundles.agents).toEqual(['official/core']);
  });

  it('defaults to empty installed packs when none specified', () => {
    const manifest = createProjectManifest(baseInput);

    expect(manifest.installed_packs).toEqual([]);
  });

  it('includes specified installed packs', () => {
    const manifest = createProjectManifest({
      ...baseInput,
      installedPacks: [{ name: 'core/base', version: '0.1.0', scope: 'global' as const }]
    });

    expect(manifest.installed_packs).toEqual([
      { name: 'core/base', version: '0.1.0', scope: 'global' }
    ]);
  });

  it('sets created_at and updated_at to the same timestamp', () => {
    const manifest = createProjectManifest(baseInput);

    expect(manifest.created_at).toBe(manifest.updated_at);
    expect(manifest.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('preserves the instruction-surface policy', () => {
    const manifest = createProjectManifest(baseInput);

    expect(manifest.instruction_surface_policy.native_surfaces).toEqual(['AGENTS.md']);
    expect(manifest.instruction_surface_policy.mirror_policy).toBe('explicit-only');
  });

  it('produces a schema-valid manifest', () => {
    const manifest = createProjectManifest(baseInput);
    const result = ProjectManifestSchema.safeParse(manifest);

    expect(result.success).toBe(true);
  });

  it('produces a schema-valid manifest with multiple adapters', () => {
    const manifest = createProjectManifest({
      ...baseInput,
      adapters: ['opencode', 'claude-code'] as AdapterId[],
      instructionSurfacePolicy: {
        native_surfaces: ['AGENTS.md', 'CLAUDE.md', '.claude/CLAUDE.md'],
        compatibility_surfaces: [],
        mirror_policy: 'explicit-only'
      }
    });
    const result = ProjectManifestSchema.safeParse(manifest);

    expect(result.success).toBe(true);
    expect(manifest.adapters).toEqual(['opencode', 'claude-code']);
  });
});
