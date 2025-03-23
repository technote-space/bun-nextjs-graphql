import type { UserSession } from '#/usecases/shared/session/userSession';
import type { PaginateTaskOutput, PaginateTaskParams } from './dto';

export interface TaskPaginationQueryService {
  handle(
    session: UserSession,
    params: PaginateTaskParams,
  ): Promise<PaginateTaskOutput>;
}
