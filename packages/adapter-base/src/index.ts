export const adapterBasePackageName = '@codelatch/adapter-base';

export const ADAPTER_CAPABILITIES = [
  'discover',
  'normalize',
  'summarize',
  'map-result'
] as const;

export type AdapterCapability = (typeof ADAPTER_CAPABILITIES)[number];

export type AdapterIdentity = {
  id: string;
  displayName: string;
};

export type WorkflowBinding = {
  event: string;
  surface: string;
  policyId: string;
};

export type AdapterMetadata = {
  identity: AdapterIdentity;
  capabilities: AdapterCapability[];
  workflowBindings?: WorkflowBinding[];
};

export type DiscoveredSurface = {
  kind: string;
  path: string;
};

export type AdapterSummary = {
  headline: string;
};

export type CodeLatchAdapter<
  TInvocation,
  TNormalizedInvocation,
  TResult,
  THostResult
> = {
  metadata: AdapterMetadata;
  discover: () => DiscoveredSurface[];
  normalize: (invocation: TInvocation) => TNormalizedInvocation;
  summarize: (result: TResult) => AdapterSummary;
  mapResult: (result: TResult) => THostResult;
};
