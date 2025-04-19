import { Task } from '#/domains/entities/task';
import { type Id, UpdatedAt } from '#/domains/entities/task/valueObjects';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { UpdateTaskInputDto } from '#/usecases/task/update/dto';
import type { TaskOutputDto } from '../dto';
import type { UpdateTaskUseCase } from './usecase';

export class UpdateTaskUseCaseMock implements UpdateTaskUseCase {
  public constructor(private readonly task: Task) {}

  public async handle(
    _: UserSession,
    __: Id,
    input: UpdateTaskInputDto,
  ): Promise<TaskOutputDto> {
    return Task.reconstruct(
      this.task.id,
      this.task.userId,
      input.title ?? this.task.title,
      input.description ?? this.task.description,
      this.task.completedAt,
      this.task.startedAt,
      input.expiredAt ?? this.task.expiredAt,
      this.task.createdAt,
      new UpdatedAt(undefined),
    );
  }
}
