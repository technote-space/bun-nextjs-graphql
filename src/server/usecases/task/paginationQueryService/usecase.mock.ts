import type { PaginateTaskOutput } from './dto';
import type { TaskPaginationQueryService } from './usecase';

export class TaskPaginationQueryServiceMock
  implements TaskPaginationQueryService
{
  public constructor(private readonly output: PaginateTaskOutput) {}

  public async handle(): Promise<PaginateTaskOutput> {
    return this.output;
  }
}
