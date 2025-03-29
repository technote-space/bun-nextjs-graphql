import { singleton } from 'tsyringe';
import type { GraphQLPaginationResult } from '#/interfaceAdapters/presenters/graphql/shared/utils';
import { getGraphQLPaginationResult } from '#/interfaceAdapters/presenters/graphql/shared/utils';
import type { PaginateUserOutput } from '#/usecases/user/paginationQueryService/dto';
import type { UserQueryServicePresenter } from '#/usecases/user/paginationQueryService/presenter';
import { type GraphQLSchemaType, toGraphQLSchema } from './utils';

export type GraphQLPaginationUserSchemaType = GraphQLPaginationResult<
  GraphQLSchemaType,
  'User'
>;

@singleton()
export class GraphQLUserQueryServicePresenter
  implements UserQueryServicePresenter
{
  public paginate(result: PaginateUserOutput): GraphQLPaginationUserSchemaType {
    return getGraphQLPaginationResult(result, toGraphQLSchema, 'User');
  }
}
