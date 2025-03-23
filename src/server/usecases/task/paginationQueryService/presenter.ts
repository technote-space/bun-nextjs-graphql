import type { PaginateTaskOutput } from './dto';

export interface TaskQueryServicePresenter {
  // biome-ignore lint/suspicious/noExplicitAny:
  paginate(result: PaginateTaskOutput): any;
}
