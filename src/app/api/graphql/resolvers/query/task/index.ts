import type { GraphQLContext } from '$/context';
import type { QueryResolvers } from '$/types';
import { container } from 'tsyringe';
import { FetchTaskController } from '#/interfaceAdapters/controllers/task/fetchController';
import { PaginateTaskController } from '#/interfaceAdapters/controllers/task/paginateController';
import type { GraphQLPaginationTaskSchemaType } from '#/interfaceAdapters/presenters/graphql/task/queryService';
import type { GraphQLSchemaType } from '#/interfaceAdapters/presenters/graphql/task/utils';

export const Task: Pick<
  Required<QueryResolvers<GraphQLContext>>,
  'task' | 'tasks'
> = {
  task: async (_parent, { id }, { token }) =>
    container
      .resolve(FetchTaskController<GraphQLSchemaType>)
      .invoke({ id, token }),
  tasks: async (_parent, args, { token }) =>
    container
      .resolve(PaginateTaskController<GraphQLPaginationTaskSchemaType>)
      .invoke({ params: args, token }),
};
