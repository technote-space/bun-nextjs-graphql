import type { GraphQLContext } from '$/context';
import type { MutationResolvers, User } from '$/types';

export const updateUser: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'updateUser'
> = {
  updateUser: async (_parent, { id, input }, { token }) =>
    ({
      id: 'user-id1',
      name: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as User,
};
