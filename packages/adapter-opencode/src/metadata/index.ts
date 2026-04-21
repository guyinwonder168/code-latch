import {
  ADAPTER_CAPABILITIES,
  type AdapterMetadata
} from '@codelatch/adapter-base';
import { WorkflowEvent } from '@codelatch/workflow-contracts';

export const OPEN_CODE_ADAPTER_ID = 'opencode';

export const createOpenCodeAdapterMetadata = (): AdapterMetadata => ({
  identity: {
    id: OPEN_CODE_ADAPTER_ID,
    displayName: 'OpenCode Adapter'
  },
  capabilities: [...ADAPTER_CAPABILITIES],
  workflowBindings: [
    {
      event: WorkflowEvent.BOOTSTRAP_START,
      surface: 'config',
      policyId: 'opencode-bootstrap-shell'
    },
    {
      event: WorkflowEvent.EXECUTION_STEP,
      surface: 'command.execute.before',
      policyId: 'opencode-wrapper-checkpoint'
    }
  ]
});
