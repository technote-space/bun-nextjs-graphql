import type { PaginateUserOutput } from './dto';
import type { UserPaginationQueryService } from './usecase';

export class UserPaginationQueryServiceMock
  implements UserPaginationQueryService
{
  public constructor(private readonly output: PaginateUserOutput) {}

  public async handle(): Promise<PaginateUserOutput> {
    return this.output;
  }
}
