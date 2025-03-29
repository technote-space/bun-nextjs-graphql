import type { MaybeNullable } from '#/shared/types';
import type { TaskOutputDto } from './dto';
import type { TaskPresenter } from './presenter';

export class TaskPresenterMock implements TaskPresenter<TaskOutputDto> {
  public entity<T extends TaskOutputDto>(
    task: T | null,
  ): NonNullable<TaskOutputDto> | MaybeNullable<T> {
    if (task) return task;
    return null as MaybeNullable<T>;
  }
}
