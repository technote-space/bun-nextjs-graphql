import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { Task } from '#/domains/entities/task';
import type { TaskRepository } from '#/domains/repositories/taskRepository';
import { transform } from '#/shared/utils';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { CreateTaskInputDto } from '#/usecases/task/create/dto';
import type { TaskOutputDto } from '../dto';
import type { CreateTaskUseCase } from './usecase';

@singleton()
export class CreateTaskInteractor implements CreateTaskUseCase {
  public constructor(
    @inject(DITokens.TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  public async handle(
    session: UserSession,
    input: CreateTaskInputDto,
  ): Promise<TaskOutputDto> {
    return transform(
      Task.create(
        session.getContext().user.id,
        input.title,
        input.description,
        input.expiredAt,
      ),
      async (task) => {
        await session.authorize('create', task);
        return this.taskRepository.transaction(async (client) =>
          this.taskRepository.save(client, task),
        );
      },
    );
  }
}
