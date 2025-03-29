import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import type { Id } from '#/domains/entities/task/valueObjects';
import type { TaskRepository } from '#/domains/repositories/taskRepository';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { TaskOutputDto } from '../dto';
import type { DeleteTaskUseCase } from './usecase';

@singleton()
export class DeleteTaskInteractor implements DeleteTaskUseCase {
  public constructor(
    @inject(DITokens.TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  public async handle(
    session: UserSession,
    id: Id,
  ): Promise<TaskOutputDto | null> {
    return this.taskRepository
      .transaction(async (client) => this.taskRepository.find(client, id))
      .then(async (task) => {
        if (!task) return null;
        await session.authorize('delete', task);
        return this.taskRepository.transaction(async (client) =>
          this.taskRepository.delete(client, id),
        );
      });
  }
}
