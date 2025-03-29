import type { GraphQLContext } from '$/context';
import type { MutationResolvers } from '$/types';
import { container } from 'tsyringe';
import { OnCompleteTaskController } from '#/interfaceAdapters/controllers/task/onCompleteController';
import type { GraphQLSchemaType } from '#/interfaceAdapters/presenters/graphql/task/utils';

export const completeTask: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'completeTask'
> = {
  completeTask: async (_parent, { id }, { token }) =>
    container
      .resolve(OnCompleteTaskController<GraphQLSchemaType>)
      .invoke({ id, token }),
};
