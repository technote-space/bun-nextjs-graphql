import type { GraphQLContext } from '$/context';
import type { QueryResolvers } from '$/types';
import { container } from 'tsyringe';
import { FetchTaskController } from '#/interfaceAdapters/controllers/task/fetchController';
import type { GraphQLSchemaType } from '#/interfaceAdapters/presenters/graphql/task/utils';

export const task: Pick<Required<QueryResolvers<GraphQLContext>>, 'task'> = {
  task: async (_parent, { id }, { token }) =>
    container
      .resolve(FetchTaskController<GraphQLSchemaType>)
      .invoke({ id, token }),
};
