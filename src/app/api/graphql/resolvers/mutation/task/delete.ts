import type { GraphQLContext } from '$/context';
import type { MutationResolvers, Task } from '$/types';

export const deleteTask: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'deleteTask'
> = {
  deleteTask: async (_parent, { id }, { token }) =>
    ({
      id: 'task-id1',
      title: 'task1',
      description: 'task description1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as Task,
};
