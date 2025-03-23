import type { Task } from '#/domains/entities/task';
import type { MaybeNullable } from '#/shared/types';

export interface TaskPresenter {
  // biome-ignore lint/suspicious/noExplicitAny:
  entity<T extends Task>(task: T | null): NonNullable<any> | MaybeNullable<T>;
}
