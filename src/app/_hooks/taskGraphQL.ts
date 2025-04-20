import { gql } from '@apollo/client';

// Fragment for task fields
export const TASK_FIELDS = gql`
  fragment TaskFields on Task {
    id
    title
    description
    startedAt
    completedAt
    createdAt
    updatedAt
    expiredAt
    status
  }
`;

// Query to get a single task by ID
export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      ...TaskFields
    }
  }
  ${TASK_FIELDS}
`;

// Query to get all tasks with pagination
export const GET_TASKS = gql`
  query GetTasks($page: Int, $perPage: Int, $sortKey: TaskSortKey, $sortOrder: SortOrder, $q: String, $statuses: [TaskStatus!]) {
    tasks(page: $page, perPage: $perPage, sortKey: $sortKey, sortOrder: $sortOrder, q: $q, statuses: $statuses) {
      pageInfo {
        totalCount
        perPage
        totalPage
        currentPage
      }
      edges {
        cursor
        node {
          ...TaskFields
        }
      }
    }
  }
  ${TASK_FIELDS}
`;

// Mutation to create a new task
export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      ...TaskFields
    }
  }
  ${TASK_FIELDS}
`;

// Mutation to update a task
export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      ...TaskFields
    }
  }
  ${TASK_FIELDS}
`;

// Mutation to complete a task
export const COMPLETE_TASK = gql`
  mutation CompleteTask($id: ID!) {
    completeTask(id: $id) {
      ...TaskFields
    }
  }
  ${TASK_FIELDS}
`;

// Mutation to delete a task
export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      ...TaskFields
    }
  }
  ${TASK_FIELDS}
`;

// Mutation to start a task
export const START_TASK = gql`
  mutation StartTask($id: ID!) {
    startTask(id: $id) {
      ...TaskFields
    }
  }
  ${TASK_FIELDS}
`;
