import type { ModelName } from '#/frameworks/database/prisma';
import type { PageInfo, PaginationResult } from '#/usecases/shared/pagination';

export type GraphQLPaginationResult<T, M extends ModelName> = Readonly<{
  edges: {
    cursor: string;
    node: T;
  }[];
  pageInfo: PageInfo;
  __typename: `${M}Connection`;
}>;

export const getGraphQLPaginationResult = <E, T, M extends ModelName>(
  result: PaginationResult<E>,
  toGraphQLSchema: (entity: E) => T,
  modelName: M,
): GraphQLPaginationResult<T, M> => ({
  edges: result.items.map(toGraphQLSchema).map((node) => ({
    cursor: node[result.key],
    node,
  })),
  pageInfo: result.pageInfo,
  __typename: `${modelName}Connection`,
});
