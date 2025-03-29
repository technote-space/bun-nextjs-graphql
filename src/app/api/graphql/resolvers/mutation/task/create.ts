import type { GraphQLContext } from '$/context';
import type { MutationResolvers } from '$/types';
import { container } from 'tsyringe';
import { CreateTaskController } from '#/interfaceAdapters/controllers/task/createController';
import type { GraphQLSchemaType } from '#/interfaceAdapters/presenters/graphql/task/utils';

export const createTask: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'createTask'
> = {
  createTask: async (_parent, { input }, { token }) =>
    container
      .resolve(CreateTaskController<GraphQLSchemaType>)
      .invoke({ input, token }),
};
