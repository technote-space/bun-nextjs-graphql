import type { User } from '#/domains/entities/user';
import type {
  PageParams,
  PaginationResult,
} from '#/usecases/shared/pagination';

export type PaginateUserParams = PageParams<'id' | 'title'> &
  Readonly<{
    name?: string | null;
  }>;
export type PaginateUserOutput = PaginationResult<User>;
