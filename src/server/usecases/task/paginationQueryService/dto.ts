import type {
  PageParams,
  PaginationResult,
} from '#/usecases/shared/pagination';
import type { TaskOutputDto } from '#/usecases/task/dto';

export type PaginateTaskParams = PageParams<'id' | 'title'> &
  Readonly<{
    q?: string | null;
  }>;
export type PaginateTaskOutput = PaginationResult<TaskOutputDto>;
