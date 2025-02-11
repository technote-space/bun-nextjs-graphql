import type { GraphQLContext } from '$/context';
import type { UserResolvers } from '$/types';

export const User: UserResolvers<GraphQLContext> = {
  tasks: async (parent) => ({
    pageInfo: {
      totalCount: 2,
      perPage: 10,
      totalPage: 1,
      currentPage: 1,
    },
    edges: [
      {
        cursor: 'task-id1',
        node: {
          id: 'task-id1',
          title: 'task1',
          description: 'task description1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      {
        cursor: 'task-id2',
        node: {
          id: 'task-id2',
          title: 'task2',
          description: 'task description2',
          completedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    ],
  }),
};
