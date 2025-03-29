import type {
  PageParams,
  PaginationResult,
} from '#/usecases/shared/pagination';
import type { UserOutputDto } from '#/usecases/user/dto';

export type PaginateUserParams = PageParams<'id' | 'title'> &
  Readonly<{
    name?: string | null;
  }>;
export type PaginateUserOutput = PaginationResult<UserOutputDto>;
