import type { Id } from '#/domains/entities/task/valueObjects';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { TaskOutputDto } from '../dto';

export interface OnStartTaskUseCase {
  handle(session: UserSession, id: Id): Promise<TaskOutputDto>;
}
