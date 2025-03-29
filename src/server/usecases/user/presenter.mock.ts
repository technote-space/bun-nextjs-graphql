import type { MaybeNullable } from '#/shared/types';
import type { UserOutputDto } from './dto';
import type { UserPresenter } from './presenter';

export class UserPresenterMock implements UserPresenter<UserOutputDto> {
  public entity<T extends UserOutputDto>(
    user: T | null,
  ): NonNullable<UserOutputDto> | MaybeNullable<T> {
    if (user) return user;
    return null as MaybeNullable<T>;
  }
}
