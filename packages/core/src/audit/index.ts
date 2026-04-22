/**
 * Audit pipeline for codelatch-audit.
 *
 * Section 14.5: Pipeline:
 * 1. inspect truth docs and maintained root docs,
 * 2. inspect pack overlap,
 * 3. inspect state schema health,
 * 4. inspect adapter metadata alignment,
 * 5. inspect unresolved incidents and saved or pending-review proposals,
 * 6. record audit result metadata in `.tmp/codelatch/index.db`,
 * 7. write audit Markdown only when actionable findings exist,
 * 8. surface contradictions and risk conditions.
 */

import type { AuditResult, AuditFinding } from '@codelatch/workflow-contracts';
import type { ProjectManifest, TruthDocRegistry } from '@codelatch/schemas';
import { ProjectManifestSchema, TruthDocRegistrySchema } from '@codelatch/schemas';
import type { FsReadOps } from '../bootstrap/detection.js';
import { createRuntimeRootPaths } from '../bootstrap/runtime-root.js';

export type AuditInput = {
  inspectTruthDocs: boolean;
  inspectPacks: boolean;
  inspectSchemaHealth: boolean;
  inspectAdapterAlignment: boolean;
  inspectIncidents: boolean;
};

export type AuditPipelineResult = {
  success: true;
  data: AuditResult;
} | {
  success: false;
  error: string;
};

/**
 * Execute the audit pipeline.
 *
 * 1. Read manifest and registry from disk
 * 2. Validate schema health
 * 3. Inspect truth docs
 * 4. Inspect adapter alignment
 * 5. Build and return audit result
 */
export const executeAuditPipeline = async (
  projectRoot: string,
  input: AuditInput,
  fsRead: FsReadOps
): Promise<AuditPipelineResult> => {
  const paths = createRuntimeRootPaths(projectRoot);
  const findings: AuditFinding[] = [];

  // Step 1: Read manifest from disk
  const manifestExists = await fsRead.exists(paths.manifest);
  if (!manifestExists) {
    return { success: false, error: 'Audit requires a bootstrapped project: manifest not found' };
  }

  const registryExists = await fsRead.exists(paths.registry);
  if (!registryExists) {
    return { success: false, error: 'Audit requires a bootstrapped project: registry not found' };
  }

  const manifestRaw = await fsRead.readFile(paths.manifest);
  const registryRaw = await fsRead.readFile(paths.registry);

  let manifest: ProjectManifest;
  let registry: TruthDocRegistry;

  // Step 2: Validate schema health
  if (input.inspectSchemaHealth) {
    try {
      const manifestParsed = ProjectManifestSchema.safeParse(JSON.parse(manifestRaw));
      if (!manifestParsed.success) {
        findings.push({
          kind: 'schema-health',
          severity: 'high',
          message: `Invalid manifest: ${manifestParsed.error.message}`,
          pointers: [paths.manifest]
        });
      } else {
        manifest = manifestParsed.data;
      }
    } catch {
      findings.push({
        kind: 'schema-health',
        severity: 'high',
        message: 'Failed to parse manifest JSON',
        pointers: [paths.manifest]
      });
    }

    try {
      const registryParsed = TruthDocRegistrySchema.safeParse(JSON.parse(registryRaw));
      if (!registryParsed.success) {
        findings.push({
          kind: 'schema-health',
          severity: 'high',
          message: `Invalid registry: ${registryParsed.error.message}`,
          pointers: [paths.registry]
        });
      } else {
        registry = registryParsed.data;
      }
    } catch {
      findings.push({
        kind: 'schema-health',
        severity: 'high',
        message: 'Failed to parse registry JSON',
        pointers: [paths.registry]
      });
    }
  } else {
    // Still parse for other inspections
    try {
      manifest = ProjectManifestSchema.parse(JSON.parse(manifestRaw));
    } catch {
      return { success: false, error: 'Failed to parse manifest JSON' };
    }
    try {
      registry = TruthDocRegistrySchema.parse(JSON.parse(registryRaw));
    } catch {
      return { success: false, error: 'Failed to parse registry JSON' };
    }
  }

  // If schema health checks failed to parse, we may not have manifest/registry
  // @ts-expect-error — initialized above when parsing succeeds
  if (!manifest || !registry) {
    const riskScore = calculateRiskScore(findings);
    return {
      success: true,
      data: {
        findings,
        riskScore,
        reportMaterialized: findings.length > 0,
        reportPath: findings.length > 0 ? `${paths.audits}/audit_${Date.now()}.md` : undefined
      }
    };
  }

  // Step 3: Inspect truth docs
  if (input.inspectTruthDocs) {
    const truthDocFindings = inspectTruthDocs(manifest, registry, fsRead, projectRoot);
    findings.push(...truthDocFindings);
  }

  // Step 4: Inspect adapter alignment
  if (input.inspectAdapterAlignment) {
    const alignmentFindings = inspectAdapterAlignment(manifest);
    findings.push(...alignmentFindings);
  }

  // Step 5: Inspect incidents (placeholder for future expansion)
  if (input.inspectIncidents) {
    const incidentsPath = paths.incidents;
    const incidentsExist = await fsRead.exists(incidentsPath);
    if (!incidentsExist) {
      findings.push({
        kind: 'incident',
        severity: 'low',
        message: 'No incident directory found — incidents are not being tracked',
        pointers: [incidentsPath]
      });
    }
  }

  // Step 6: Calculate risk score
  const riskScore = calculateRiskScore(findings);

  // Step 7: Materialize report only when findings exist
  const reportMaterialized = findings.length > 0 && riskScore > 0;

  return {
    success: true,
    data: {
      findings,
      riskScore,
      reportMaterialized,
      reportPath: reportMaterialized ? `${paths.audits}/audit_${Date.now()}.md` : undefined
    }
  };
};

/**
 * Inspect truth docs for basic health.
 */
const inspectTruthDocs = (
  manifest: ProjectManifest,
  registry: TruthDocRegistry,
  fsRead: FsReadOps,
  projectRoot: string
): AuditFinding[] => {
  const findings: AuditFinding[] = [];

  // Check that manifest truth doc paths match registry
  const manifestPaths = manifest.truth_docs;
  const registryPaths = {
    prd: registry.truth_docs.prd.path,
    technical_design: registry.truth_docs.technical_design.path,
    implementation_plan: registry.truth_docs.implementation_plan.path
  };

  for (const role of ['prd', 'technical_design', 'implementation_plan'] as const) {
    if (manifestPaths[role] !== registryPaths[role]) {
      findings.push({
        kind: 'truth-doc',
        severity: 'medium',
        message: `Truth doc path mismatch for ${role}: manifest=${manifestPaths[role]}, registry=${registryPaths[role]}`,
        pointers: [manifestPaths[role], registryPaths[role]]
      });
    }
  }

  // Check that truth docs are registered with versions
  for (const role of ['prd', 'technical_design', 'implementation_plan'] as const) {
    const entry = registry.truth_docs[role];
    if (!entry.version || entry.version === 'pending') {
      findings.push({
        kind: 'truth-doc',
        severity: 'low',
        message: `Truth doc ${role} has pending or missing version`,
        pointers: [entry.path]
      });
    }
  }

  return findings;
};

/**
 * Inspect adapter metadata alignment.
 */
const inspectAdapterAlignment = (manifest: ProjectManifest): AuditFinding[] => {
  const findings: AuditFinding[] = [];
  const adapters = manifest.adapters;

  if (!adapters || adapters.length === 0) {
    findings.push({
      kind: 'adapter-alignment',
      severity: 'high',
      message: 'No adapters configured in project manifest',
      pointers: [manifest.runtime_root + '/project-manifest.json']
    });
  }

  if (!manifest.instruction_surface_policy) {
    findings.push({
      kind: 'adapter-alignment',
      severity: 'medium',
      message: 'Missing instruction surface policy in manifest',
      pointers: [manifest.runtime_root + '/project-manifest.json']
    });
  }

  return findings;
};

/**
 * Calculate a simple risk score from findings.
 */
const calculateRiskScore = (findings: AuditFinding[]): number => {
  const severityWeights = { low: 1, medium: 3, high: 5 };
  return findings.reduce((score, f) => score + severityWeights[f.severity], 0);
};
