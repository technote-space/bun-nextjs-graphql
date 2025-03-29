import type { MaybeNullable } from '#/shared/types';
import type { UserOutputDto } from './dto';

export interface UserPresenter<Result> {
  entity<T extends UserOutputDto>(
    user: T | null,
  ): NonNullable<Result> | MaybeNullable<T>;
}
