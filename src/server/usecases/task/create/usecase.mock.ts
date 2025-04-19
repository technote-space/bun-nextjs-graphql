import { Task } from '#/domains/entities/task';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { CreateTaskInputDto } from '#/usecases/task/create/dto';
import type { TaskOutputDto } from '../dto';
import type { CreateTaskUseCase } from './usecase';

export class CreateTaskUseCaseMock implements CreateTaskUseCase {
  public async handle(
    session: UserSession,
    input: CreateTaskInputDto,
  ): Promise<TaskOutputDto> {
    return Task.create(
      session.getContext().user.id,
      input.title,
      input.description,
      input.expiredAt,
    );
  }
}
