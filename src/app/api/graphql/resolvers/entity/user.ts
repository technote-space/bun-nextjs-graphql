import type { GraphQLContext } from '$/context';
import type { UserResolvers } from '$/types';
import { container } from 'tsyringe';
import { PaginateTaskController } from '#/interfaceAdapters/controllers/task/paginateController';
import type { GraphQLPaginationTaskSchemaType } from '#/interfaceAdapters/presenters/graphql/task/queryService';

export const User: UserResolvers<GraphQLContext> = {
  tasks: async (parent, args, { token }) =>
    container
      .resolve(PaginateTaskController<GraphQLPaginationTaskSchemaType>)
      .invoke({ params: { ...args, userId: parent.id }, token }),
};
