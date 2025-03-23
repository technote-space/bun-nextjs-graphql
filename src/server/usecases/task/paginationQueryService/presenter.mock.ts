import type { PaginateTaskOutput } from './dto';
import type { TaskQueryServicePresenter } from './presenter';

export class TaskQueryServicePresenterMock
  implements TaskQueryServicePresenter
{
  // biome-ignore lint/suspicious/noExplicitAny:
  public paginate(result: PaginateTaskOutput): any {
    return result;
  }
}
