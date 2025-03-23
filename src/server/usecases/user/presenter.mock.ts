import type { User } from '#/domains/entities/user';
import type { MaybeNullable } from '#/shared/types';
import type { UserPresenter } from './presenter';

export class UserPresenterMock implements UserPresenter {
  public entity<T extends User>(
    user: T | null,
    // biome-ignore lint/suspicious/noExplicitAny:
  ): NonNullable<any> | MaybeNullable<T> {
    if (user) return user;
    return null as MaybeNullable<T>;
  }
}
