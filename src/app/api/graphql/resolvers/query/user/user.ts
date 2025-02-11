import type { GraphQLContext } from '$/context';
import type { QueryResolvers } from '$/types';

export const user: Pick<Required<QueryResolvers<GraphQLContext>>, 'user'> = {
  user: async (_parent, { id }, { token }) => ({
    id: 'user-id1',
    name: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};
