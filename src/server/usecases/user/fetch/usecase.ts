import type { Id } from '#/domains/entities/user/valueObjects';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { FetchUserOutput } from './dto';

export interface FetchUserUseCase {
  handle(session: UserSession, id: Id): Promise<FetchUserOutput>;
}
