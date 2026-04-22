/**
 * Drift classification for sync.
 *
 * Section 13.3: MVP uses three drift classes.
 * Section 13.3.2: Classification rules.
 * Section 13.3.3: False-positive control.
 *
 * Pure function — no side effects.
 */

import { DriftClass, type DriftFinding } from '@codelatch/workflow-contracts';
import type { DriftInputs } from './drift-inputs.js';

export type DriftClassification = {
  highestDriftClass: DriftClass;
  findings: DriftFinding[];
  requiresHardStop: boolean;
  requiresRebrainstorm: boolean;
};

/**
 * Classify drift findings from bounded sync inputs.
 *
 * Rules (Section 13.3.2):
 * - Class 0: mismatch changes metadata only, not behavior/scope/architecture/approval
 * - Class 1: mismatch changes structure, dependency shape, adapter behavior,
 *            folder boundaries, or task sequencing without changing product meaning
 * - Class 2: mismatch changes product behavior, approval policy, safety policy,
 *            scope meaning, or pack behavior that can affect execution outcome
 * - If finding can reasonably fit both Class 1 and Class 2, default to Class 2
 * - If finding conflicts with an approval anchor, treat the approval as stale
 *
 * Pure function — no side effects.
 */
export const classifyDrift = (inputs: DriftInputs): DriftClassification => {
  const findings: DriftFinding[] = [];

  // Check truth-doc hash mismatches
  classifyTruthDocDrift(inputs, findings);

  // Check instruction-surface drift
  classifyInstructionSurfaceDrift(inputs, findings);

  // Check adapter-set drift
  classifyAdapterSetDrift(inputs, findings);

  // Check registry path mismatches
  classifyRegistryPathDrift(inputs, findings);

  // Determine highest drift class
  const highestDriftClass = findings.length === 0
    ? DriftClass.CLASS_0
    : Math.max(...findings.map(f => f.driftClass)) as DriftClass;

  const requiresHardStop = findings.some(f =>
    f.driftClass === DriftClass.CLASS_1 || f.driftClass === DriftClass.CLASS_2
  );

  const requiresRebrainstorm = findings.some(f =>
    f.driftClass === DriftClass.CLASS_2
  );

  return {
    highestDriftClass,
    findings,
    requiresHardStop,
    requiresRebrainstorm
  };
};

/**
 * Classify truth-doc hash drift.
 *
 * - PRD hash change → Class 2 (product behavior change)
 * - Technical design hash change → structural change (Class 1),
 *   but if other docs also changed → likely scope change (Class 2)
 * - Implementation plan hash change → structural (Class 1),
 *   but ambiguous with other changes → Class 2
 */
const classifyTruthDocDrift = (inputs: DriftInputs, findings: DriftFinding[]): void => {
  const anchor = inputs.anchors.truth_doc_hashes;
  const current = inputs.currentTruthDocHashes;
  const registry = inputs.truthDocRegistry;

  const changedDocs: string[] = [];
  if (current.prd !== anchor.prd) changedDocs.push('prd');
  if (current.technical_design !== anchor.technical_design) changedDocs.push('technical_design');
  if (current.implementation_plan !== anchor.implementation_plan) changedDocs.push('implementation_plan');

  if (changedDocs.length === 0) return;

  // PRD change is always Class 2 (product behavior change)
  if (current.prd !== anchor.prd) {
    findings.push({
      kind: 'prd-behavior-change',
      driftClass: DriftClass.CLASS_2,
      severity: 'high',
      message: 'PRD content changed since last approval anchor — product behavior may have shifted.',
      pointers: [registry.prd.path]
    });
  }

  // Technical design change: structural by default, Class 2 if PRD also changed
  if (current.technical_design !== anchor.technical_design) {
    const isAmbiguous = changedDocs.length > 1;
    findings.push({
      kind: isAmbiguous ? 'scope-meaning-change' : 'structural-design-change',
      driftClass: isAmbiguous ? DriftClass.CLASS_2 : DriftClass.CLASS_1,
      severity: isAmbiguous ? 'high' : 'medium',
      message: isAmbiguous
        ? 'Technical design changed alongside other docs — scope meaning may have shifted.'
        : 'Technical design changed without PRD change — structural drift detected.',
      pointers: [registry.technical_design.path]
    });
  }

  // Implementation plan change: structural by default
  if (current.implementation_plan !== anchor.implementation_plan) {
    const isAmbiguous = changedDocs.length > 1 && changedDocs.includes('prd');
    findings.push({
      kind: 'missing-implementation-plan-dependency',
      driftClass: isAmbiguous ? DriftClass.CLASS_2 : DriftClass.CLASS_1,
      severity: isAmbiguous ? 'high' : 'high',
      message: isAmbiguous
        ? 'Implementation plan changed alongside PRD — scope expectations may have shifted.'
        : 'Implementation plan changed — task sequencing or dependencies may have shifted.',
      pointers: [registry.implementation_plan.path]
    });
  }
};

/**
 * Classify instruction-surface drift.
 *
 * Missing or extra instruction anchors relative to the manifest policy.
 */
const classifyInstructionSurfaceDrift = (inputs: DriftInputs, findings: DriftFinding[]): void => {
  const policy = inputs.instructionSurfacePolicy;
  const actual = inputs.actualInstructionSurfaces;

  const expectedNative = new Set(policy.native_surfaces);
  const actualSet = new Set(actual);

  // Missing native surfaces
  for (const surface of expectedNative) {
    if (!actualSet.has(surface)) {
      findings.push({
        kind: 'missing-instruction-surface',
        driftClass: DriftClass.CLASS_1,
        severity: 'medium',
        message: `Expected native instruction surface '${surface}' is missing.`,
        pointers: [surface]
      });
    }
  }

  // Extra surfaces not in policy
  for (const surface of actualSet) {
    if (!expectedNative.has(surface)) {
      findings.push({
        kind: 'extra-instruction-surface',
        driftClass: DriftClass.CLASS_0,
        severity: 'low',
        message: `Instruction surface '${surface}' exists but is not in the manifest policy.`,
        pointers: [surface]
      });
    }
  }
};

/**
 * Classify adapter-set drift.
 *
 * Adapter set changed since anchor — structural drift.
 */
const classifyAdapterSetDrift = (inputs: DriftInputs, findings: DriftFinding[]): void => {
  const anchorSet = inputs.anchors.adapter_set.sort();
  const currentSet = inputs.adapterSet.sort();

  if (anchorSet.length !== currentSet.length ||
      !anchorSet.every((v, i) => v === currentSet[i])) {
    findings.push({
      kind: 'adapter-set-change',
      driftClass: DriftClass.CLASS_1,
      severity: 'medium',
      message: 'Adapter set has changed since the last approval anchor.',
      pointers: [`.tmp/codelatch/project-manifest.json`]
    });
  }
};

/**
 * Classify registry path drift.
 *
 * Registry path mismatches the anchor — metadata-only drift.
 * Stale version labels with matching hashes — metadata-only drift.
 */
const classifyRegistryPathDrift = (inputs: DriftInputs, findings: DriftFinding[]): void => {
  const registry = inputs.truthDocRegistry;
  const manifestPaths = inputs.manifestTruthDocPaths;

  // Detect registry path mismatches (registry path differs from manifest)
  for (const role of ['prd', 'technical_design', 'implementation_plan'] as const) {
    const regPath = registry[role].path;
    const manifestPath = manifestPaths[role];
    if (regPath !== manifestPath) {
      findings.push({
        kind: 'registry-path-mismatch',
        driftClass: DriftClass.CLASS_0,
        severity: 'low',
        message: `Registry path for ${role} differs from manifest: registry='${regPath}', manifest='${manifestPath}'.`,
        pointers: [regPath, manifestPath]
      });
    }
  }

  // Version label drift is implicitly handled by hash comparison (Section 13.3.3).
};
