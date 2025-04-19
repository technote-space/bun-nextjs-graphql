import type { TaskStatus } from '$/types';
import type {
  PageParams,
  PaginationResult,
} from '#/usecases/shared/pagination';
import type { TaskOutputDto } from '#/usecases/task/dto';

export type PaginateTaskParams = PageParams<'id' | 'title'> &
  Readonly<{
    q?: string | null;
    statuses?: TaskStatus[] | null;
    userId?: string | null;
  }>;
export type PaginateTaskOutput = PaginationResult<TaskOutputDto>;
