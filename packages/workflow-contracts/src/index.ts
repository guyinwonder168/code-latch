export const workflowContractsPackageName = '@codelatch/workflow-contracts';

export enum CanonicalCommand {
  BOOTSTRAP = 'codelatch-bootstrap',
  SYNC = 'codelatch-sync',
  PACK_CREATE = 'codelatch-pack-create',
  LEARN = 'codelatch-learn',
  CLEAN = 'codelatch-clean',
  AUDIT = 'codelatch-audit',
  PROMOTE = 'codelatch-promote'
}

export enum WorkflowEvent {
  BOOTSTRAP_START = 'bootstrap.start',
  BRAINSTORM_START = 'brainstorm.start',
  SYNC_START = 'sync.start',
  EXACT_PLAN_GENERATE = 'exact-plan.generate',
  APPROVAL_CHECKPOINT = 'approval.checkpoint',
  EXECUTION_STEP = 'execution.step',
  DRIFT_STOP = 'drift.stop',
  REVIEW_CHECKPOINT = 'review.checkpoint',
  LEARN_REVIEW = 'learn.review',
  PROMOTE_REVIEW = 'promote.review'
}

export enum WorkflowPhase {
  BOOTSTRAP = 'bootstrap',
  BRAINSTORM = 'brainstorm',
  SYNC = 'sync',
  EXACT_PLAN = 'exact-plan',
  FREE_RUN = 'free-run',
  REVIEW = 'review',
  LEARN = 'learn',
  PROMOTE = 'promote'
}

export type BudgetOverflowBehavior = 'stop' | 'trim';

export type CommandSuccess<TData = void> = {
  success: true;
  data?: TData;
};

export type CommandFailure = {
  success: false;
  error: string;
};

export type CommandResult<TData = void> = CommandSuccess<TData> | CommandFailure;

export type InjectionPolicy = {
  id: string;
  requiredTruthDocs: string[];
  optionalPacks: string[];
  optionalIncidents: string[];
  allowHotSnippets: boolean;
  budgetOverflow: BudgetOverflowBehavior;
  reproducibilityRefs: string[];
};

export type CommandContext = {
  adapterId: string;
  projectRoot: string;
  command: CanonicalCommand;
};

export type InstructionSurfacePolicy = {
  native_surfaces: string[];
  compatibility_surfaces: string[];
  mirror_policy: string;
};

export type TruthDocEntry = {
  path: string;
  version: string;
  hash: string;
};

export type BootstrapResult = {
  runtimeRoot: string;
  manifestPath: string;
  registryPath: string;
  versionGovernorPath: string;
  instructionSurfaces: string[];
  adapterSet: string[];
};

export enum DriftClass {
  CLASS_0 = 0,
  CLASS_1 = 1,
  CLASS_2 = 2
}

export type DriftFinding = {
  kind: string;
  driftClass: DriftClass;
  severity: 'low' | 'medium' | 'high';
  message: string;
  pointers: string[];
};

export type ProposedWrite = {
  targetPath: string;
  description: string;
  driftClass: DriftClass;
  requiresApproval: boolean;
};

export type SyncResult = {
  highestDriftClass: DriftClass;
  findings: DriftFinding[];
  proposedWrites: ProposedWrite[];
  requiresHardStop: boolean;
  requiresRebrainstorm: boolean;
  reportMaterialized: boolean;
  reportPath?: string;
};
