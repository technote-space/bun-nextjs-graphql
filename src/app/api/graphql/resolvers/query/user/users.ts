import type { GraphQLContext } from '$/context';
import type { QueryResolvers } from '$/types';

export const users: Pick<Required<QueryResolvers<GraphQLContext>>, 'users'> = {
  users: async (_parent, args, { token }) => ({
    pageInfo: {
      totalCount: 1,
      perPage: 10,
      totalPage: 1,
      currentPage: 1,
    },
    edges: [
      {
        cursor: 'user-id1',
        node: {
          id: 'user-id1',
          name: 'user1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    ],
  }),
};
