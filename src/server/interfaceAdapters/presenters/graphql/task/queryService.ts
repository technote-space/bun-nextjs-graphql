import { singleton } from 'tsyringe';
import type { GraphQLPaginationResult } from '#/interfaceAdapters/presenters/graphql/shared/utils';
import { getGraphQLPaginationResult } from '#/interfaceAdapters/presenters/graphql/shared/utils';
import type { PaginateTaskOutput } from '#/usecases/task/paginationQueryService/dto';
import type { TaskQueryServicePresenter } from '#/usecases/task/paginationQueryService/presenter';
import { type GraphQLSchemaType, toGraphQLSchema } from './utils';

@singleton()
export class GraphQLTaskQueryServicePresenter
  implements TaskQueryServicePresenter
{
  public paginate(
    result: PaginateTaskOutput,
  ): GraphQLPaginationResult<GraphQLSchemaType> {
    return getGraphQLPaginationResult(result, toGraphQLSchema, 'Task');
  }
}
