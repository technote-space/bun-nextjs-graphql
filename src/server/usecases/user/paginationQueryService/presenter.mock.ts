import type { PaginateUserOutput } from './dto';
import type { UserQueryServicePresenter } from './presenter';

export class UserQueryServicePresenterMock
  implements UserQueryServicePresenter
{
  // biome-ignore lint/suspicious/noExplicitAny:
  public paginate(result: PaginateUserOutput): any {
    return result;
  }
}
