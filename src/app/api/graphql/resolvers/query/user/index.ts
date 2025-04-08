import type { GraphQLContext } from '$/context';
import type { QueryResolvers } from '$/types';
import { container } from 'tsyringe';
import { FetchUserController } from '#/interfaceAdapters/controllers/user/fetchController';
import { FetchMeController } from '#/interfaceAdapters/controllers/user/meController';
import { PaginateUserController } from '#/interfaceAdapters/controllers/user/paginateController';
import type { GraphQLPaginationUserSchemaType } from '#/interfaceAdapters/presenters/graphql/user/queryService';
import type { GraphQLSchemaType } from '#/interfaceAdapters/presenters/graphql/user/utils';

export const User: Pick<
  Required<QueryResolvers<GraphQLContext>>,
  'me' | 'user' | 'users'
> = {
  me: async (_parent, _, { token }) =>
    container.resolve(FetchMeController<GraphQLSchemaType>).invoke({ token }),
  user: async (_parent, { id }, { token }) =>
    container
      .resolve(FetchUserController<GraphQLSchemaType>)
      .invoke({ id, token }),
  users: async (_parent, args, { token }) =>
    container
      .resolve(PaginateUserController<GraphQLPaginationUserSchemaType>)
      .invoke({ params: args, token }),
};
