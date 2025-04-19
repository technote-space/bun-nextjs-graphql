// Task-related types
export enum TaskStatus {
  PLANNED = 'Planned',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  EXPIRED = 'Expired',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  expiredAt: string | null;
  status: TaskStatus;
}

export interface TaskEdge {
  cursor: string;
  node: Task;
}

export interface PageInfo {
  totalCount: number;
  perPage: number;
  totalPage: number;
  currentPage: number;
}

export interface TaskConnection {
  pageInfo: PageInfo;
  edges: TaskEdge[];
}

export enum TaskSortKey {
  ID = 'id',
  TITLE = 'title',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

// Input types
export interface CreateTaskInput {
  userId: string;
  title: string;
  description: string;
  expiredAt?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  expiredAt?: string | null;
}
