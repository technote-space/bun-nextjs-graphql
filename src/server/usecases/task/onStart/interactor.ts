import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import type { Id } from '#/domains/entities/task/valueObjects';
import type { TaskRepository } from '#/domains/repositories/taskRepository';
import { NotFound } from '#/shared/exceptions';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { TaskOutputDto } from '../dto';
import type { OnStartTaskUseCase } from './usecase';

@singleton()
export class OnStartTaskInteractor implements OnStartTaskUseCase {
  public constructor(
    @inject(DITokens.TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  public async handle(session: UserSession, id: Id): Promise<TaskOutputDto> {
    return this.taskRepository
      .transaction(async (client) => this.taskRepository.find(client, id))
      .then(async (task) => {
        if (!task) throw new NotFound('タスク', 'task', id.value);
        await session.authorize('update', task);
        return this.taskRepository.transaction(async (client) =>
          this.taskRepository.save(client, task.onStarted()),
        );
      });
  }
}
