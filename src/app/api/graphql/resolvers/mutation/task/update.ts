import type { GraphQLContext } from '$/context';
import type { MutationResolvers, Task } from '$/types';

export const updateTask: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'updateTask'
> = {
  updateTask: async (_parent, { id, input }, { token }) =>
    ({
      id: 'task-id1',
      title: 'task1',
      description: 'task description1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as Task,
};
