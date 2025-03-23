import type { GraphQLContext } from '$/context';
import type { MutationResolvers, User } from '$/types';

export const deleteUser: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'deleteUser'
> = {
  deleteUser: async (_parent, { id }, { token }) =>
    ({
      id: 'user-id1',
      name: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as User,
};
