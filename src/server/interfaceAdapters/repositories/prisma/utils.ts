import type {
  DateObject,
  Entity,
  StringId,
} from '@technote-space/vo-entity-ts';

type UnionUndefinedToNull<T> = T extends undefined ? null : T;
type UndefinedToNull<T> = Readonly<{
  [P in keyof T]-?: UnionUndefinedToNull<T[P]>;
}>;
type _Entity = Entity &
  Readonly<{
    id: StringId;
    createdAt: DateObject;
    updatedAt: DateObject;
  }>;

// biome-ignore lint/suspicious/noExplicitAny:
export const getUpsertParams = <T extends _Entity, U extends Record<any, any>>(
  entity: T,
  getInput: (entity: T) => U,
): {
  where: { id: string };
  create: UndefinedToNull<U> & { id: string; createdAt: Date; updatedAt: Date };
  update: UndefinedToNull<U> & { createdAt: Date; updatedAt: Date };
} => {
  const input = {
    ...(Object.fromEntries(
      Object.entries(getInput(entity)).map(([key, value]) => [
        key,
        value === undefined ? null : value,
      ]),
    ) as UndefinedToNull<U>),
    createdAt: entity.createdAt.value.toDate(),
    updatedAt: entity.updatedAt.value.toDate(),
  };

  return {
    where: { id: entity.id.value },
    create: { ...input, id: entity.id.value },
    update: input,
  };
};
