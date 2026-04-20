export const corePackageName = '@codelatch/core';

export const CODELATCH_VERSION = '0.1.0';

export type CoreResult<TData> = {
  status: 'ready';
  data: TData;
};

export const createCoreResult = <TData>(data: TData): CoreResult<TData> => ({
  status: 'ready',
  data
});
