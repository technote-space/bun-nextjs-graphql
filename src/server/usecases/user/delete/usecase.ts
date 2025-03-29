import type { Id } from '#/domains/entities/user/valueObjects';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { UserOutputDto } from '../dto';

export interface DeleteUserUseCase {
  handle(session: UserSession, id: Id): Promise<UserOutputDto | null>;
}
