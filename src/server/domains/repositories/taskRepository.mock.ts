import type { Task } from '#/domains/entities/task';
import type { TaskRepository } from '#/domains/repositories/taskRepository';
import { RepositoryMock } from '#/frameworks/database/repository.mock';

export class TaskRepositoryMock
  extends RepositoryMock<Task>
  implements TaskRepository
{
  public toEntity(): Task {
    throw new Error();
  }
}
