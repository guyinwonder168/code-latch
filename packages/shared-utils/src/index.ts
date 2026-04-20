export const sharedUtilsPackageName = '@codelatch/shared-utils';

export type ReadonlyList<TValue> = readonly TValue[];

export const identity = <TValue>(value: TValue): TValue => value;

export const toReadonlyArray = <TValue>(values: readonly TValue[]): ReadonlyList<TValue> =>
  [...values];
