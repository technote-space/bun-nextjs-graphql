import type { GraphQLContext } from '$/context';
import type { MutationResolvers } from '$/types';

export const createTask: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'createTask'
> = {
  createTask: async (_parent, { input }, { token }) => ({
    id: 'task-id1',
    title: 'task1',
    description: 'task description1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};
