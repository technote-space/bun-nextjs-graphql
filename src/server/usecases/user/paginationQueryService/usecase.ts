import type { UserSession } from '#/usecases/shared/session/userSession';
import type { PaginateUserOutput, PaginateUserParams } from './dto';

export interface UserPaginationQueryService {
  handle(
    session: UserSession,
    params: PaginateUserParams,
  ): Promise<PaginateUserOutput>;
}
