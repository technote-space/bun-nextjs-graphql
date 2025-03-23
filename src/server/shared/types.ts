export type MaybeNullable<T> = undefined extends T
  ? undefined
  : null extends T
    ? null
    : never;
