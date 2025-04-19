import { Task } from '#/domains/entities/task';
import {
  type Id,
  StartedAt,
  UpdatedAt,
} from '#/domains/entities/task/valueObjects';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { TaskOutputDto } from '../dto';
import type { OnStartTaskUseCase } from './usecase';

export class OnStartTaskUseCaseMock implements OnStartTaskUseCase {
  public constructor(private readonly task: Task) {}

  public async handle(_: UserSession, __: Id): Promise<TaskOutputDto> {
    return Task.reconstruct(
      this.task.id,
      this.task.userId,
      this.task.title,
      this.task.description,
      this.task.completedAt,
      new StartedAt(undefined),
      this.task.expiredAt,
      this.task.createdAt,
      new UpdatedAt(undefined),
    );
  }
}
