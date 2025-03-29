import type { PaginateUserOutput } from './dto';
import type { UserQueryServicePresenter } from './presenter';

export class UserQueryServicePresenterMock
  implements UserQueryServicePresenter
{
  public paginate(result: PaginateUserOutput): PaginateUserOutput {
    return result;
  }
}
