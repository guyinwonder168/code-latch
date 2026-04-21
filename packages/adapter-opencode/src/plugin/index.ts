import { createCoreResult, type CoreResult } from '@codelatch/core';
import { OPEN_CODE_ADAPTER_ID } from '../metadata/index.js';

export type OpenCodeInvocation = {
  commandName: string;
};

export type OpenCodePluginResult = CoreResult<{
  adapter: string;
  commandName: string;
}>;

export type OpenCodePluginEntry = {
  invoke: (invocation: OpenCodeInvocation) => OpenCodePluginResult;
};

const mapInvocationToResult = (
  invocation: OpenCodeInvocation
): OpenCodePluginResult =>
  createCoreResult({
    adapter: OPEN_CODE_ADAPTER_ID,
    commandName: invocation.commandName
  });

export const createOpenCodePluginEntry = (): OpenCodePluginEntry => ({
  invoke: mapInvocationToResult
});
