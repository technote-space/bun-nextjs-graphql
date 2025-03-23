import type { Task } from '#/domains/entities/task';
import type { Id } from '#/domains/entities/task/valueObjects';
import type { Client, Repository } from '#/frameworks/database/repository';

export interface TaskRepository<C extends Client = unknown>
  extends Repository<C> {
  // biome-ignore lint/suspicious/noExplicitAny:
  toEntity(value: any): Task;

  find(client: C, id: Id): Promise<Task | null>;

  save(client: C, task: Task): Promise<Task>;

  delete(client: C, id: Id): Promise<Task | null>;
}
