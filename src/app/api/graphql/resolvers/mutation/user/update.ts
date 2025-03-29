import type { GraphQLContext } from '$/context';
import type { MutationResolvers } from '$/types';
import { container } from 'tsyringe';
import { UpdateUserController } from '#/interfaceAdapters/controllers/user/updateController';
import type { GraphQLSchemaType } from '#/interfaceAdapters/presenters/graphql/user/utils';

export const updateUser: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'updateUser'
> = {
  updateUser: async (_parent, { id, input }, { token }) =>
    container
      .resolve(UpdateUserController<GraphQLSchemaType>)
      .invoke({ id, input, token }),
};
