import type { GraphQLContext } from '$/context';
import type { MutationResolvers, User } from '$/types';

export const createUser: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'createUser'
> = {
  createUser: async (_parent, { input }, { token }) =>
    ({
      id: 'user-id1',
      name: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as User,
};
