import type { Task } from '#/domains/entities/task';
import type { MaybeNullable } from '#/shared/types';
import type { TaskPresenter } from './presenter';

export class TaskPresenterMock implements TaskPresenter {
  public entity<T extends Task>(
    task: T | null,
    // biome-ignore lint/suspicious/noExplicitAny:
  ): NonNullable<any> | MaybeNullable<T> {
    if (task) return task;
    return null as MaybeNullable<T>;
  }
}
