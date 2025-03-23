import type { Task } from '$/types';
import type { Task as TaskEntity } from '#/domains/entities/task';

export type GraphQLSchemaType = Task;

export const toGraphQLSchema = (task: TaskEntity): GraphQLSchemaType =>
  ({
    __typename: 'Task',
    id: task.id.value,
    userId: task.userId.value,
    title: task.title.value,
    description: task.description.value,
    completedAt: task.completedAt.value?.toDate() ?? null,
    createdAt: task.createdAt.value.toDate(),
    updatedAt: task.updatedAt.value.toDate(),
  }) as GraphQLSchemaType;
