import type { GraphQLContext } from '$/context';
import type { TaskResolvers } from '$/types';

export const Task: TaskResolvers<GraphQLContext> = {
  user: async (parent) => ({
    id: 'user-id1',
    name: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};
