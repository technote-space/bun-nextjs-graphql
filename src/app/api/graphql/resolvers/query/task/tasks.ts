import type { GraphQLContext } from '$/context';
import type { QueryResolvers } from '$/types';
import { container } from 'tsyringe';
import { PaginateTaskController } from '#/interfaceAdapters/controllers/task/paginateController';
import type { GraphQLPaginationTaskSchemaType } from '#/interfaceAdapters/presenters/graphql/task/queryService';

export const tasks: Pick<Required<QueryResolvers<GraphQLContext>>, 'tasks'> = {
  tasks: async (_parent, args, { token }) =>
    container
      .resolve(PaginateTaskController<GraphQLPaginationTaskSchemaType>)
      .invoke({ params: args, token }),
};
