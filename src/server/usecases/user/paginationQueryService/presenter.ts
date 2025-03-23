import type { PaginateUserOutput } from './dto';

export interface UserQueryServicePresenter {
  // biome-ignore lint/suspicious/noExplicitAny:
  paginate(result: PaginateUserOutput): any;
}
