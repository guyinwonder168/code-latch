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
