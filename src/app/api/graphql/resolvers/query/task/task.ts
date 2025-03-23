import type { GraphQLContext } from '$/context';
import type { QueryResolvers, Task } from '$/types';

export const task: Pick<Required<QueryResolvers<GraphQLContext>>, 'task'> = {
  task: async (_parent, { id }, { token }) =>
    ({
      id: 'task-id1',
      title: 'task1',
      description: 'task description1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as Task,
};
