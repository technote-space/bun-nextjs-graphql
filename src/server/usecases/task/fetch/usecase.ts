import type { Id } from '#/domains/entities/task/valueObjects';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { FetchTaskOutput } from './dto';

export interface FetchTaskUseCase {
  handle(session: UserSession, id: Id): Promise<FetchTaskOutput>;
}
