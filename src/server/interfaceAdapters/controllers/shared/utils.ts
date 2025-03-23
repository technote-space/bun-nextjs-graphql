import type {
  Collection,
  Entity,
  ValueObject,
} from '@technote-space/vo-entity-ts';

// biome-ignore lint/suspicious/noExplicitAny:
export const getUpdateValue = <
  T,
  V extends ValueObject<any, any> | Entity | Collection<any>,
>(
  value: T | undefined,
  generator: (value: T) => V,
): V | undefined => {
  if (value === undefined) return undefined;
  return generator(value);
};
