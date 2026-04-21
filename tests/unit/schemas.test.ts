import { describe, expect, it } from 'vitest';
import {
  AdapterMetadataSchema,
  ApprovalRecordSchema,
  ContextBundleManifestSchema,
  DistributionManifestSchema,
  ProjectManifestSchema,
  RepoStateSchema,
  RunContractSchema,
  TruthDocRegistrySchema,
  VersionGovernorSchema,
  type AdapterMetadata,
  type ApprovalRecord,
  type ContextBundleManifest,
  type DistributionManifest,
  type ProjectManifest,
  type RepoState,
  type RunContract,
  type TruthDocRegistry,
  type VersionGovernor
} from '@codelatch/schemas';

const projectManifestFixture: ProjectManifest = {
  project_id: 'code-latch',
  framework_version: '0.1.0',
  runtime_root: '.tmp/codelatch',
  profile: 'coding-development',
  adapters: ['opencode', 'claude-code'],
  instruction_surface_policy: {
    native_surfaces: ['AGENTS.md', 'CLAUDE.md'],
    compatibility_surfaces: [],
    mirror_policy: 'explicit-only'
  },
  installed_procedural_bundles: {
    skills: ['official/core'],
    agents: ['official/core'],
    instructions: ['official/core'],
    host_integrations: ['official/core']
  },
  truth_docs: {
    prd: 'product-docs/codelatch-prd.md',
    technical_design: 'product-docs/technical-design.md',
    implementation_plan: 'product-docs/implementation-plan.md'
  },
  installed_packs: [{ name: 'core/base', version: '0.1.0', scope: 'global' }],
  created_at: '2026-04-03T00:00:00Z',
  updated_at: '2026-04-03T00:00:00Z'
};

const truthDocRegistryFixture: TruthDocRegistry = {
  truth_docs: {
    prd: {
      path: 'product-docs/codelatch-prd.md',
      version: '0.2.8',
      hash: 'sha256:abc123'
    },
    technical_design: {
      path: 'product-docs/technical-design.md',
      version: '0.2.12',
      hash: 'sha256:def456'
    },
    implementation_plan: {
      path: 'product-docs/implementation-plan.md',
      version: '0.1.0',
      hash: 'sha256:ghi789'
    }
  },
  updated_at: '2026-04-19T20:00:00Z'
};

const adapterMetadataFixture: AdapterMetadata = {
  adapter_id: 'claude-code',
  project_root: '.',
  metadata_dir: '.claude/codelatch',
  discovery_surfaces: {
    instructions: ['CLAUDE.md', '.claude/CLAUDE.md'],
    commands: ['.claude/commands'],
    skills: ['.claude/skills'],
    agents: ['.claude/agents'],
    plugin_manifest: ['.claude-plugin/plugin.json'],
    plugin_hooks: ['hooks/hooks.json']
  },
  instruction_precedence: ['.claude/CLAUDE.md', 'CLAUDE.md'],
  workflow_bindings: [
    {
      event: 'brainstorm.start',
      host_surface: 'plugin-hook',
      binding_ref: 'hooks/hooks.json#brainstormStart',
      injection_policy: 'truth-docs-plus-brainstorm-pack',
      fallback: 'wrapper-checkpoint'
    }
  ],
  install_mode: 'global-host-integration',
  wrapper_mode: 'delegate-to-core'
};

const distributionManifestFixture: DistributionManifest = {
  adapter_id: 'codex',
  framework_version: '0.1.0',
  resolved_global_surfaces: {
    instructions: ['<codex-home>/AGENTS.md'],
    skills: ['<user-home>/.agents/skills'],
    agents: ['<codex-home>/agents'],
    config: ['<codex-home>/config.toml'],
    hooks: [],
    plugin_marketplaces: ['<user-home>/.agents/plugins/marketplace.json'],
    plugin_cache: ['<codex-home>/plugins/cache']
  },
  project_metadata_dir: '.codex/codelatch',
  validated_at: '2026-04-03T20:00:00Z'
};

const approvalRecordFixture: ApprovalRecord = {
  approval_id: 'approval_20260403_exact_plan_01',
  target_type: 'plan',
  target_id: 'plan_20260403_01',
  phase: 'exact-plan',
  decision: 'approved',
  approved_scope: {
    summary: 'Implement scoped sync update for pack conflict reporting',
    allow_destructive: false
  },
  approval_scope_hash: 'sha256:scope123',
  truth_doc_versions: {
    prd: '0.2.8',
    technical_design: '0.2.12',
    implementation_plan: '0.1.0'
  },
  truth_doc_hashes: {
    prd: 'sha256:abc123',
    technical_design: 'sha256:def456',
    implementation_plan: 'sha256:ghi789'
  },
  resolved_pack_bundle_ref: '.tmp/codelatch/cache/refs/bundle_exact_plan_01.json',
  adapter_set_ref: '.tmp/codelatch/version-governor.json',
  workspace_ref: null,
  repo_state: {
    git_head: null,
    tree_status: 'clean-or-not-applicable'
  },
  related_doc_ref: '.tmp/codelatch/plans/plan_20260403_01.md',
  approved_at: '2026-04-03T20:00:00Z'
};

const runContractFixture: RunContract = {
  run_id: 'run_20260403_200500',
  session_id: 'session_20260403_01',
  plan_ref: '.tmp/codelatch/plans/plan_20260403_01.md',
  approval_refs: ['approval_20260403_exact_plan_01'],
  mode: 'free-run',
  status: 'active',
  current_task_id: 'task_sync_conflict_report',
  workspace_ref: null,
  truth_doc_hashes: {
    prd: 'sha256:abc123',
    technical_design: 'sha256:def456',
    implementation_plan: 'sha256:ghi789'
  },
  resolved_pack_bundle_ref: '.tmp/codelatch/cache/refs/bundle_exact_plan_01.json',
  adapter_set_ref: '.tmp/codelatch/version-governor.json',
  repo_state: {
    git_head: null,
    tree_status: 'clean-or-not-applicable'
  },
  stop_conditions: ['drift', 'scope-expansion'],
  rendered_summary_ref: null
};

const versionGovernorFixture: VersionGovernor = {
  catalog_version: '2026.04.03',
  policy: 'pinned',
  core: '0.1.0',
  adapters: {
    opencode: '0.1.0',
    'claude-code': '0.1.0',
    codex: '0.1.0',
    kilocode: '0.1.0'
  },
  profiles: {
    'coding-development': '0.1.0'
  },
  procedural_assets: {
    skills: '2026.04.03',
    agents: '2026.04.03',
    instructions: '2026.04.03',
    host_integrations: '2026.04.03'
  },
  packs: {
    'core/base': '0.1.0'
  }
};

const contextBundleFixture: ContextBundleManifest = {
  bundle_id: 'bundle_bootstrap_01',
  truth_docs: [
    'product-docs/codelatch-prd.md',
    'product-docs/technical-design.md',
    'product-docs/implementation-plan.md'
  ],
  packs: [],
  incidents: [],
  hot_snippets: [],
  bundle_hash: 'sha256:bundle123',
  created_at: '2026-04-03T20:00:00Z'
};

const repoStateFixture: RepoState = {
  git_head: null,
  tree_status: 'clean-or-not-applicable'
};

const validCases = [
  ['project manifest', ProjectManifestSchema, projectManifestFixture],
  ['truth-doc registry', TruthDocRegistrySchema, truthDocRegistryFixture],
  ['adapter metadata', AdapterMetadataSchema, adapterMetadataFixture],
  ['distribution manifest', DistributionManifestSchema, distributionManifestFixture],
  ['approval record', ApprovalRecordSchema, approvalRecordFixture],
  ['run contract', RunContractSchema, runContractFixture],
  ['version governor', VersionGovernorSchema, versionGovernorFixture],
  ['context bundle manifest', ContextBundleManifestSchema, contextBundleFixture],
  ['repo state', RepoStateSchema, repoStateFixture]
] as const;

const invalidCases = [
  [
    'project manifest',
    ProjectManifestSchema,
    {
      ...projectManifestFixture,
      adapters: ['unsupported-adapter']
    }
  ],
  [
    'truth-doc registry',
    TruthDocRegistrySchema,
    {
      ...truthDocRegistryFixture,
      truth_docs: {
        ...truthDocRegistryFixture.truth_docs,
        prd: {
          ...truthDocRegistryFixture.truth_docs.prd,
          hash: ''
        }
      }
    }
  ],
  [
    'adapter metadata',
    AdapterMetadataSchema,
    {
      ...adapterMetadataFixture,
      workflow_bindings: [
        {
          ...adapterMetadataFixture.workflow_bindings[0],
          event: ''
        }
      ]
    }
  ],
  [
    'distribution manifest',
    DistributionManifestSchema,
    {
      ...distributionManifestFixture,
      resolved_global_surfaces: {
        ...distributionManifestFixture.resolved_global_surfaces,
        instructions: ['']
      }
    }
  ],
  [
    'approval record',
    ApprovalRecordSchema,
    {
      ...approvalRecordFixture,
      approved_scope: {
        ...approvalRecordFixture.approved_scope,
        allow_destructive: 'no'
      }
    }
  ],
  [
    'run contract',
    RunContractSchema,
    {
      ...runContractFixture,
      approval_refs: []
    }
  ],
  [
    'version governor',
    VersionGovernorSchema,
    {
      ...versionGovernorFixture,
      policy: 'invalid-policy'
    }
  ],
  [
    'context bundle manifest',
    ContextBundleManifestSchema,
    {
      ...contextBundleFixture,
      bundle_hash: 'not-a-sha256'
    }
  ],
  [
    'repo state',
    RepoStateSchema,
    {
      git_head: null,
      tree_status: ''
    }
  ]
] as const;

describe('shared schemas', () => {
  describe('valid fixtures', () => {
    it.each(validCases)('accepts a %s fixture', (_name, schema, fixture) => {
      const result = schema.safeParse(fixture);

      expect(result.success).toBe(true);
    });
  });

  describe('invalid fixtures', () => {
    it.each(invalidCases)('rejects an invalid %s fixture', (_name, schema, fixture) => {
      const result = schema.safeParse(fixture);

      expect(result.success).toBe(false);
    });
  });
});
