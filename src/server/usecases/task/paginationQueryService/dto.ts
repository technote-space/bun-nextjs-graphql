import type {
  PageParams,
  PaginationResult,
} from '#/usecases/shared/pagination';
import type { TaskOutputDto } from '#/usecases/task/dto';

export type PaginateTaskParams = PageParams<'id' | 'title'> &
  Readonly<{
    q?: string | null;
    userId?: string | null;
  }>;
export type PaginateTaskOutput = PaginationResult<TaskOutputDto>;
