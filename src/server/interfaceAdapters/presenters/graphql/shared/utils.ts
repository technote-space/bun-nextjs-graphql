import type { ModelName } from '#/frameworks/database/prisma';
import type { PageInfo, PaginationResult } from '#/usecases/shared/pagination';

export type GraphQLPaginationResult<T> = Readonly<{
  edges: {
    cursor: string;
    node: T;
  }[];
  pageInfo: PageInfo;
  __typename: string;
}>;

export const getGraphQLPaginationResult = <E, T>(
  result: PaginationResult<E>,
  toGraphQLSchema: (entity: E) => T,
  modelName: ModelName,
): GraphQLPaginationResult<T> => ({
  edges: result.items.map(toGraphQLSchema).map((node) => ({
    cursor: node[result.key],
    node,
  })),
  pageInfo: result.pageInfo,
  __typename: `${modelName}Connection`,
});
