import type { UserSession } from '#/usecases/shared/session/userSession';
import type { UserOutputDto } from '../dto';

export interface FetchMeUseCase {
  handle(session: UserSession): Promise<UserOutputDto>;
}
