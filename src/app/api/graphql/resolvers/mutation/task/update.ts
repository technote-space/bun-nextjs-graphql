import type { GraphQLContext } from '$/context';
import type { MutationResolvers } from '$/types';
import { container } from 'tsyringe';
import { UpdateTaskController } from '#/interfaceAdapters/controllers/task/updateController';
import type { GraphQLSchemaType } from '#/interfaceAdapters/presenters/graphql/task/utils';

export const updateTask: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'updateTask'
> = {
  updateTask: async (_parent, { id, input }, { token }) =>
    container
      .resolve(UpdateTaskController<GraphQLSchemaType>)
      .invoke({ id, input, token }),
};
