import { describe, expect, it } from 'vitest';
import {
  ADAPTER_CAPABILITIES,
  type AdapterMetadata,
  type CodeLatchAdapter
} from '@codelatch/adapter-base';

describe('adapter base', () => {
  it('exports canonical adapter capabilities', () => {
    expect(ADAPTER_CAPABILITIES).toContain('discover');
  });

  it('supports adapter metadata typing', () => {
    const metadata: AdapterMetadata = {
      identity: {
        id: 'fixture-adapter',
        displayName: 'Fixture Adapter'
      },
      capabilities: ['discover', 'normalize', 'summarize', 'map-result'],
      workflowBindings: [
        {
          event: 'before-command',
          surface: 'wrapper-prelude',
          policyId: 'minimal-context'
        }
      ]
    };

    expect(metadata.identity.id).toBe('fixture-adapter');
  });

  it('allows a small fixture to satisfy the adapter contract', () => {
    const adapter: CodeLatchAdapter<{ command: string }, { command: string }, { success: boolean }, { ok: boolean }> = {
      metadata: {
        identity: {
          id: 'fixture-adapter',
          displayName: 'Fixture Adapter'
        },
        capabilities: ['discover', 'normalize', 'summarize', 'map-result']
      },
      discover: () => [
        {
          kind: 'instruction-root',
          path: '.opencode'
        }
      ],
      normalize: (invocation) => invocation,
      summarize: () => ({
        headline: 'ready'
      }),
      mapResult: (result) => ({
        ok: result.success
      })
    };

    expect(adapter.mapResult({ success: true })).toEqual({ ok: true });
  });
});
