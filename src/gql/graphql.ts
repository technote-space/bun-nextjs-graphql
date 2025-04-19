/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: Date; output: Date; }
  DateTime: { input: Date; output: Date; }
};

export type Connection = {
  edges: Array<Edge>;
  pageInfo: PageInfo;
};

export type CreateTaskInput = {
  description: Scalars['String']['input'];
  expiredAt?: InputMaybe<Scalars['DateTime']['input']>;
  title: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  role: UserRole;
};

export type Edge = {
  cursor: Scalars['String']['output'];
  node: Node;
};

export type ErrorCode =
  | 'BAD_REQUEST'
  | 'FORBIDDEN'
  | 'INVALID_CONTROL'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'UNEXPECTED_ERROR'
  | 'VALIDATION_ERROR';

export type List = {
  items: Array<Node>;
  totalCount: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  completeTask: Task;
  createTask: Task;
  createUser: User;
  deleteTask: Maybe<Task>;
  deleteUser: Maybe<User>;
  startTask: Task;
  updateTask: Task;
  updateUser: User;
};


export type MutationCompleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationStartTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTaskArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTaskInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  currentPage: Scalars['Int']['output'];
  perPage: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPage: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  me: User;
  task: Task;
  tasks: TaskConnection;
  user: User;
  users: UserConnection;
};


export type QueryTaskArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTasksArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  q: InputMaybe<Scalars['String']['input']>;
  sortKey?: InputMaybe<TaskSortKey>;
  sortOrder?: InputMaybe<SortOrder>;
  status: InputMaybe<TaskStatus>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  name: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  sortKey?: InputMaybe<UserSortKey>;
  sortOrder?: InputMaybe<SortOrder>;
};

export type SortOrder =
  | 'asc'
  | 'desc';

export type Task = Node & {
  __typename?: 'Task';
  completedAt: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  expiredAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  startedAt: Maybe<Scalars['DateTime']['output']>;
  status: TaskStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['ID']['output'];
};

export type TaskConnection = Connection & {
  __typename?: 'TaskConnection';
  edges: Array<TaskEdge>;
  pageInfo: PageInfo;
};

export type TaskEdge = Edge & {
  __typename?: 'TaskEdge';
  cursor: Scalars['String']['output'];
  node: Task;
};

export type TaskSortKey =
  | 'id'
  | 'title';

export type TaskStatus =
  | 'Completed'
  | 'Expired'
  | 'InProgress'
  | 'Planned';

export type UpdateTaskInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  expiredAt?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
};

export type User = Node & {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: UserRole;
  tasks: TaskConnection;
  updatedAt: Scalars['DateTime']['output'];
};


export type UserTasksArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  q: InputMaybe<Scalars['String']['input']>;
  sortKey?: InputMaybe<TaskSortKey>;
  sortOrder?: InputMaybe<SortOrder>;
};

export type UserConnection = Connection & {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
};

export type UserEdge = Edge & {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  node: User;
};

export type UserRole =
  | 'ADMIN'
  | 'EDITOR';

export type UserSortKey =
  | 'id'
  | 'name';
