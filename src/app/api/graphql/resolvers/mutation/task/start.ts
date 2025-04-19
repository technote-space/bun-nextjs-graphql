import type { GraphQLContext } from '$/context';
import type { MutationResolvers } from '$/types';
import { container } from 'tsyringe';
import { OnStartTaskController } from '#/interfaceAdapters/controllers/task/onStartController';
import type { GraphQLSchemaType } from '#/interfaceAdapters/presenters/graphql/task/utils';

export const startTask: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'startTask'
> = {
  startTask: async (_parent, { id }, { token }) =>
    container
      .resolve(OnStartTaskController<GraphQLSchemaType>)
      .invoke({ id, token }),
};
