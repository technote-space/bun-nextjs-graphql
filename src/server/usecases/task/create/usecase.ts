import type { UserSession } from '#/usecases/shared/session/userSession';
import type { TaskOutputDto } from '../dto';
import type { CreateTaskInputDto } from './dto';

export interface CreateTaskUseCase {
  handle(
    session: UserSession,
    input: CreateTaskInputDto,
  ): Promise<TaskOutputDto>;
}
