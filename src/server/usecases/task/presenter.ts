import type { MaybeNullable } from '#/shared/types';
import type { TaskOutputDto } from '#/usecases/task/dto';

export interface TaskPresenter<Result> {
  entity<T extends TaskOutputDto>(
    task: T | null,
  ): NonNullable<Result> | MaybeNullable<T>;
}
