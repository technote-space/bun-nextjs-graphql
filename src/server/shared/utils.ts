import type { MaybeNullable } from './types';

export const transform = <T, U>(
  value: T | null | undefined,
  callback: (value: T) => U,
): U | MaybeNullable<T> => {
  if (value === undefined || value === null) {
    return value as MaybeNullable<T>;
  }

  return callback(value);
};

export const tap = async <T>(
  value: T,
  // biome-ignore lint/suspicious/noExplicitAny:
  ...callbacks: Array<(value: T) => any | Promise<any>>
): Promise<T> => {
  await callbacks.reduce(async (prev, callback) => {
    await prev;
    await callback(value);
  }, Promise.resolve());
  return value;
};

export const getKeywords = (q?: string | null): string[] => [
  ...new Set((q?.split(' ') ?? []).filter((v) => v)),
];
