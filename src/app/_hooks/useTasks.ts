'use client';

import type {
  Mutation,
  SortOrder,
  Task,
  TaskConnection,
  TaskSortKey,
  TaskStatus,
} from '$/types';
import { type DocumentNode, useMutation, useQuery } from '@apollo/client';
import type { QueryOptions } from '@apollo/client/core/watchQueryOptions';
import {
  COMPLETE_TASK,
  CREATE_TASK,
  DELETE_TASK,
  GET_TASK,
  GET_TASKS,
  START_TASK,
  UPDATE_TASK,
} from './taskGraphQL';

// Type aliases for specific mutation results
type CreateTaskResult = Mutation['createTask'];
type UpdateTaskResult = Mutation['updateTask'];
type CompleteTaskResult = Mutation['completeTask'];
type DeleteTaskResult = Mutation['deleteTask'];
type StartTaskResult = Mutation['startTask'];

// Common options type for task mutations
interface TaskMutationOptions<T> {
  onCompleted?: (data: T) => void;
  onError?: (error: Error) => void;
}

// Helper function to create refetchQueries configuration
const createRefetchQueries = (taskId?: string) => {
  const queries: QueryOptions[] = [{ query: GET_TASKS }];

  if (taskId) {
    queries.push({ query: GET_TASK, variables: { id: taskId } });
  }

  return queries;
};

// Hook for fetching tasks list
export function useGetTasks(
  variables: {
    page?: number;
    perPage?: number;
    sortKey?: TaskSortKey;
    sortOrder?: SortOrder;
    q?: string;
    statuses?: TaskStatus[];
  },
  refreshTrigger?: number,
) {
  return useQuery<{ tasks: TaskConnection }>(GET_TASKS, {
    variables,
    fetchPolicy: 'cache-and-network',
    // This will cause the query to refetch when refreshTrigger changes
    notifyOnNetworkStatusChange: true,
    // Using refreshTrigger in options to trigger refetch when it changes
    ...(refreshTrigger !== undefined ? { key: `tasks-${refreshTrigger}` } : {}),
  });
}

// Hook for fetching a single task
export function useGetTask(id: string) {
  return useQuery<{ task: Task }>(GET_TASK, {
    variables: { id },
    skip: !id,
  });
}

// Helper function to create task mutation hooks
function createTaskMutation<T>(
  mutation: DocumentNode,
  taskId?: string,
  options?: TaskMutationOptions<T>,
) {
  return useMutation(mutation, {
    refetchQueries: createRefetchQueries(taskId),
    ...options,
  });
}

// Hook for creating a task
export function useCreateTask(options?: TaskMutationOptions<CreateTaskResult>) {
  return createTaskMutation<CreateTaskResult>(CREATE_TASK, undefined, options);
}

// Hook for updating a task
export function useUpdateTask(
  taskId: string,
  options?: TaskMutationOptions<UpdateTaskResult>,
) {
  return createTaskMutation<UpdateTaskResult>(UPDATE_TASK, taskId, options);
}

// Hook for completing a task
export function useCompleteTask(
  taskId: string,
  options?: TaskMutationOptions<CompleteTaskResult>,
) {
  return createTaskMutation<CompleteTaskResult>(COMPLETE_TASK, taskId, options);
}

// Hook for deleting a task
export function useDeleteTask(options?: TaskMutationOptions<DeleteTaskResult>) {
  return createTaskMutation<DeleteTaskResult>(DELETE_TASK, undefined, options);
}

// Hook for starting a task
export function useStartTask(
  taskId: string,
  options?: TaskMutationOptions<StartTaskResult>,
) {
  return createTaskMutation<StartTaskResult>(START_TASK, taskId, options);
}
