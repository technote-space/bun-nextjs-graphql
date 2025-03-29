import type { GraphQLContext } from '$/context';
import type { MutationResolvers } from '$/types';
import { container } from 'tsyringe';
import { DeleteTaskController } from '#/interfaceAdapters/controllers/task/deleteController';
import type { GraphQLSchemaType } from '#/interfaceAdapters/presenters/graphql/task/utils';

export const deleteTask: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'deleteTask'
> = {
  deleteTask: async (_parent, { id }, { token }) =>
    container
      .resolve(DeleteTaskController<GraphQLSchemaType | null>)
      .invoke({ id, token }),
};
