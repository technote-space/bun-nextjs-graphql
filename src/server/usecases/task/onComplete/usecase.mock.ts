import { Task } from '#/domains/entities/task';
import {
  CompletedAt,
  type Id,
  UpdatedAt,
} from '#/domains/entities/task/valueObjects';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { TaskOutputDto } from '../dto';
import type { OnCompleteTaskUseCase } from './usecase';

export class OnCompleteTaskUseCaseMock implements OnCompleteTaskUseCase {
  public constructor(private readonly task: Task) {}

  public async handle(_: UserSession, __: Id): Promise<TaskOutputDto> {
    return Task.reconstruct(
      this.task.id,
      this.task.userId,
      this.task.title,
      this.task.description,
      new CompletedAt(undefined),
      this.task.createdAt,
      new UpdatedAt(undefined),
    );
  }
}
