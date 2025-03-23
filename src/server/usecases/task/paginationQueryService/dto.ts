import type { Task } from '#/domains/entities/task';
import type {
  PageParams,
  PaginationResult,
} from '#/usecases/shared/pagination';

export type PaginateTaskParams = PageParams<'id' | 'title'> &
  Readonly<{
    q?: string | null;
  }>;
export type PaginateTaskOutput = PaginationResult<Task>;
