import type { GraphQLContext } from '$/context';
import type { MutationResolvers } from '$/types';
import { container } from 'tsyringe';
import { DeleteUserController } from '#/interfaceAdapters/controllers/user/deleteController';
import type { GraphQLSchemaType } from '#/interfaceAdapters/presenters/graphql/user/utils';

export const deleteUser: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'deleteUser'
> = {
  deleteUser: async (_parent, { id }, { token }) =>
    container
      .resolve(DeleteUserController<GraphQLSchemaType | null>)
      .invoke({ id, token }),
};
