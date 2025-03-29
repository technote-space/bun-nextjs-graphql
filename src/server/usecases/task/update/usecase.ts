import type { Id } from '#/domains/entities/task/valueObjects';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { TaskOutputDto } from '../dto';
import type { UpdateTaskInputDto } from './dto';

export interface UpdateTaskUseCase {
  handle(
    session: UserSession,
    id: Id,
    input: UpdateTaskInputDto,
  ): Promise<TaskOutputDto>;
}
