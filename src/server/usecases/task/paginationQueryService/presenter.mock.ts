import type { PaginateTaskOutput } from './dto';
import type { TaskQueryServicePresenter } from './presenter';

export class TaskQueryServicePresenterMock
  implements TaskQueryServicePresenter
{
  public paginate(result: PaginateTaskOutput): PaginateTaskOutput {
    return result;
  }
}
