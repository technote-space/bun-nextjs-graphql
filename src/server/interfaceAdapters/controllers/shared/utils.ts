import type {
  Collection,
  Entity,
  ValueObject,
} from '@technote-space/vo-entity-ts';

export const getUpdateValue = <
  T,
  // biome-ignore lint/suspicious/noExplicitAny:
  V extends ValueObject<any, any> | Entity | Collection<any>,
>(
  value: T | undefined,
  generator: (value: T) => V,
): V | undefined => {
  if (value === undefined) return undefined;
  return generator(value);
};
