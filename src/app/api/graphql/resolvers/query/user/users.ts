import type { GraphQLContext } from '$/context';
import type { QueryResolvers } from '$/types';
import { container } from 'tsyringe';
import { PaginateUserController } from '#/interfaceAdapters/controllers/user/paginateController';
import type { GraphQLPaginationUserSchemaType } from '#/interfaceAdapters/presenters/graphql/user/queryService';

export const users: Pick<Required<QueryResolvers<GraphQLContext>>, 'users'> = {
  users: async (_parent, args, { token }) =>
    container
      .resolve(PaginateUserController<GraphQLPaginationUserSchemaType>)
      .invoke({ params: args, token }),
};
