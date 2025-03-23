import type { GraphQLContext } from '$/context';
import type { MutationResolvers, Task } from '$/types';

export const completeTask: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'completeTask'
> = {
  completeTask: async (_parent, { id }, { token }) =>
    ({
      id: 'task-id1',
      title: 'task1',
      description: 'task description1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as Task,
};
