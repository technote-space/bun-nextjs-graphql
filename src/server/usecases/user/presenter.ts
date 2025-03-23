import type { User } from '#/domains/entities/user';
import type { MaybeNullable } from '#/shared/types';

export interface UserPresenter {
  // biome-ignore lint/suspicious/noExplicitAny:
  entity<T extends User>(user: T | null): NonNullable<any> | MaybeNullable<T>;
}
