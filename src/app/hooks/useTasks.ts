'use client';

import { useMutation, useQuery } from '@apollo/client';
import {
  COMPLETE_TASK,
  CREATE_TASK,
  DELETE_TASK,
  GET_TASK,
  GET_TASKS,
  START_TASK,
  UPDATE_TASK,
} from './taskGraphQL';
import type {
  SortOrder,
  Task,
  TaskConnection,
  TaskSortKey,
  TaskStatus,
} from './types';

// Mutation result types
interface CreateTaskResult {
  createTask: Task;
}

interface UpdateTaskResult {
  updateTask: Task;
}

interface CompleteTaskResult {
  completeTask: Task;
}

interface DeleteTaskResult {
  deleteTask: Task;
}

interface StartTaskResult {
  startTask: Task;
}

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

// Hook for creating a task
export function useCreateTask(options?: {
  onCompleted?: (data: CreateTaskResult) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    ...options,
  });
}

// Hook for updating a task
export function useUpdateTask(
  taskId: string,
  options?: {
    onCompleted?: (data: UpdateTaskResult) => void;
    onError?: (error: Error) => void;
  },
) {
  return useMutation(UPDATE_TASK, {
    refetchQueries: [
      { query: GET_TASKS },
      { query: GET_TASK, variables: { id: taskId } },
    ],
    ...options,
  });
}

// Hook for completing a task
export function useCompleteTask(
  taskId: string,
  options?: {
    onCompleted?: (data: CompleteTaskResult) => void;
    onError?: (error: Error) => void;
  },
) {
  return useMutation(COMPLETE_TASK, {
    refetchQueries: [
      { query: GET_TASKS },
      { query: GET_TASK, variables: { id: taskId } },
    ],
    ...options,
  });
}

// Hook for deleting a task
export function useDeleteTask(options?: {
  onCompleted?: (data: DeleteTaskResult) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    ...options,
  });
}

// Hook for starting a task
export function useStartTask(
  taskId: string,
  options?: {
    onCompleted?: (data: StartTaskResult) => void;
    onError?: (error: Error) => void;
  },
) {
  return useMutation(START_TASK, {
    refetchQueries: [
      { query: GET_TASKS },
      { query: GET_TASK, variables: { id: taskId } },
    ],
    ...options,
  });
}
