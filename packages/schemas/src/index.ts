import { z } from 'zod';

const nonEmptyStringSchema = z.string().min(1);
const nullableStringSchema = nonEmptyStringSchema.nullable();

const adapterIdSchema = z.enum(['opencode', 'claude-code', 'codex', 'kilocode']);
const packScopeSchema = z.enum(['global', 'project']);
const truthDocHashSchema = z.string().regex(/^sha256:.+$/);

const truthDocPathsSchema = z.strictObject({
  prd: nonEmptyStringSchema,
  technical_design: nonEmptyStringSchema,
  implementation_plan: nonEmptyStringSchema
});

const truthDocVersionsSchema = z.strictObject({
  prd: nonEmptyStringSchema,
  technical_design: nonEmptyStringSchema,
  implementation_plan: nonEmptyStringSchema
});

const truthDocHashesSchema = z.strictObject({
  prd: truthDocHashSchema,
  technical_design: truthDocHashSchema,
  implementation_plan: truthDocHashSchema
});

const truthDocEntrySchema = z.strictObject({
  path: nonEmptyStringSchema,
  version: nonEmptyStringSchema,
  hash: truthDocHashSchema
});

export const RepoStateSchema = z.strictObject({
  git_head: nullableStringSchema,
  tree_status: nonEmptyStringSchema
});

export const ProjectManifestSchema = z.strictObject({
  project_id: nonEmptyStringSchema,
  framework_version: nonEmptyStringSchema,
  runtime_root: nonEmptyStringSchema,
  profile: nonEmptyStringSchema,
  adapters: z.array(adapterIdSchema).min(1),
  instruction_surface_policy: z.strictObject({
    native_surfaces: z.array(nonEmptyStringSchema),
    compatibility_surfaces: z.array(nonEmptyStringSchema),
    mirror_policy: nonEmptyStringSchema
  }),
  installed_procedural_bundles: z.strictObject({
    skills: z.array(nonEmptyStringSchema),
    agents: z.array(nonEmptyStringSchema),
    instructions: z.array(nonEmptyStringSchema),
    host_integrations: z.array(nonEmptyStringSchema)
  }),
  truth_docs: truthDocPathsSchema,
  installed_packs: z.array(
    z.strictObject({
      name: nonEmptyStringSchema,
      version: nonEmptyStringSchema,
      scope: packScopeSchema
    })
  ),
  created_at: nonEmptyStringSchema,
  updated_at: nonEmptyStringSchema
});

export const TruthDocRegistrySchema = z.strictObject({
  truth_docs: z.strictObject({
    prd: truthDocEntrySchema,
    technical_design: truthDocEntrySchema,
    implementation_plan: truthDocEntrySchema
  }),
  updated_at: nonEmptyStringSchema
});

export const AdapterMetadataSchema = z.strictObject({
  adapter_id: adapterIdSchema,
  project_root: nonEmptyStringSchema,
  metadata_dir: nonEmptyStringSchema,
  discovery_surfaces: z.strictObject({
    instructions: z.array(nonEmptyStringSchema),
    commands: z.array(nonEmptyStringSchema),
    skills: z.array(nonEmptyStringSchema),
    agents: z.array(nonEmptyStringSchema),
    plugin_manifest: z.array(nonEmptyStringSchema),
    plugin_hooks: z.array(nonEmptyStringSchema)
  }),
  instruction_precedence: z.array(nonEmptyStringSchema).min(1),
  workflow_bindings: z.array(
    z.strictObject({
      event: nonEmptyStringSchema,
      host_surface: nonEmptyStringSchema,
      binding_ref: nonEmptyStringSchema,
      injection_policy: nonEmptyStringSchema,
      fallback: nonEmptyStringSchema
    })
  ).min(1),
  install_mode: nonEmptyStringSchema,
  wrapper_mode: nonEmptyStringSchema
});

export const DistributionManifestSchema = z.strictObject({
  adapter_id: adapterIdSchema,
  framework_version: nonEmptyStringSchema,
  resolved_global_surfaces: z.strictObject({
    instructions: z.array(nonEmptyStringSchema),
    skills: z.array(nonEmptyStringSchema),
    agents: z.array(nonEmptyStringSchema),
    config: z.array(nonEmptyStringSchema),
    hooks: z.array(nonEmptyStringSchema),
    plugin_marketplaces: z.array(nonEmptyStringSchema),
    plugin_cache: z.array(nonEmptyStringSchema)
  }),
  project_metadata_dir: nonEmptyStringSchema,
  validated_at: nonEmptyStringSchema
});

export const ApprovalRecordSchema = z.strictObject({
  approval_id: nonEmptyStringSchema,
  target_type: nonEmptyStringSchema,
  target_id: nonEmptyStringSchema,
  phase: nonEmptyStringSchema,
  decision: z.enum(['approved', 'rejected']),
  approved_scope: z.strictObject({
    summary: nonEmptyStringSchema,
    allow_destructive: z.boolean()
  }),
  approval_scope_hash: truthDocHashSchema,
  truth_doc_versions: truthDocVersionsSchema,
  truth_doc_hashes: truthDocHashesSchema,
  resolved_pack_bundle_ref: nonEmptyStringSchema,
  adapter_set_ref: nonEmptyStringSchema,
  workspace_ref: nullableStringSchema,
  repo_state: RepoStateSchema,
  related_doc_ref: nonEmptyStringSchema,
  approved_at: nonEmptyStringSchema
});

export const RunContractSchema = z.strictObject({
  run_id: nonEmptyStringSchema,
  session_id: nonEmptyStringSchema,
  plan_ref: nonEmptyStringSchema,
  approval_refs: z.array(nonEmptyStringSchema).min(1),
  mode: nonEmptyStringSchema,
  status: nonEmptyStringSchema,
  current_task_id: nonEmptyStringSchema,
  workspace_ref: nullableStringSchema,
  truth_doc_hashes: truthDocHashesSchema,
  resolved_pack_bundle_ref: nonEmptyStringSchema,
  adapter_set_ref: nonEmptyStringSchema,
  repo_state: RepoStateSchema,
  stop_conditions: z.array(nonEmptyStringSchema).min(1),
  rendered_summary_ref: nullableStringSchema
});

export const VersionGovernorSchema = z.strictObject({
  catalog_version: nonEmptyStringSchema,
  policy: z.enum(['pinned', 'latest']),
  core: nonEmptyStringSchema,
  adapters: z.strictObject({
    opencode: nonEmptyStringSchema,
    'claude-code': nonEmptyStringSchema,
    codex: nonEmptyStringSchema,
    kilocode: nonEmptyStringSchema
  }),
  profiles: z.strictObject({
    'coding-development': nonEmptyStringSchema
  }),
  procedural_assets: z.strictObject({
    skills: nonEmptyStringSchema,
    agents: nonEmptyStringSchema,
    instructions: nonEmptyStringSchema,
    host_integrations: nonEmptyStringSchema
  }),
  packs: z.record(nonEmptyStringSchema, nonEmptyStringSchema)
});

const driftFindingSchema = z.strictObject({
  kind: nonEmptyStringSchema,
  drift_class: z.number().int().min(0).max(2),
  severity: z.enum(['low', 'medium', 'high']),
  message: nonEmptyStringSchema,
  pointers: z.array(nonEmptyStringSchema)
});

const proposedWriteSchema = z.strictObject({
  target_path: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  drift_class: z.number().int().min(0).max(2),
  requires_approval: z.boolean()
});

export const SyncReportSchema = z.strictObject({
  run_id: nonEmptyStringSchema,
  command: z.literal('codelatch-sync'),
  highest_drift_class: z.number().int().min(0).max(2),
  findings: z.array(driftFindingSchema),
  proposed_writes: z.array(proposedWriteSchema),
  requires_hard_stop: z.boolean(),
  requires_rebrainstorm: z.boolean(),
  report_doc_ref: nonEmptyStringSchema,
  generated_at: nonEmptyStringSchema
});

export const ContextBundleManifestSchema = z.strictObject({
  bundle_id: nonEmptyStringSchema,
  truth_docs: z.array(nonEmptyStringSchema),
  packs: z.array(nonEmptyStringSchema),
  incidents: z.array(nonEmptyStringSchema),
  hot_snippets: z.array(nonEmptyStringSchema),
  bundle_hash: truthDocHashSchema,
  created_at: nonEmptyStringSchema
});

export type ProjectManifest = z.infer<typeof ProjectManifestSchema>;
export type TruthDocRegistry = z.infer<typeof TruthDocRegistrySchema>;
export type AdapterMetadata = z.infer<typeof AdapterMetadataSchema>;
export type DistributionManifest = z.infer<typeof DistributionManifestSchema>;
export type ApprovalRecord = z.infer<typeof ApprovalRecordSchema>;
export type RunContract = z.infer<typeof RunContractSchema>;
export type VersionGovernor = z.infer<typeof VersionGovernorSchema>;
export type ContextBundleManifest = z.infer<typeof ContextBundleManifestSchema>;
export type SyncReport = z.infer<typeof SyncReportSchema>;
export type DriftFindingSchema = z.infer<typeof driftFindingSchema>;
export type ProposedWriteSchema = z.infer<typeof proposedWriteSchema>;

export type AdapterId = z.infer<typeof adapterIdSchema>;
export type RepoState = z.infer<typeof RepoStateSchema>;

export const schemasPackageName = '@codelatch/schemas';
