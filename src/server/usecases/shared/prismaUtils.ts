import type { Entity } from '@technote-space/vo-entity-ts';
import type {
  ModelDefinition,
  ModelName,
  PrismaClient,
} from '#/frameworks/database/prisma';
import type { PageParams, PaginationResult } from './pagination';

type FindManyItem<M extends ModelName> = Readonly<
  ModelDefinition<M>['payload']['scalars']
>;
type FindManyArgs<M extends ModelName> = Readonly<
  ModelDefinition<M>['operations']['findMany']['args']
>;

export const paginate = async <
  M extends ModelName,
  E extends Entity,
  I extends FindManyItem<M>,
>(
  model: M,
  { page, perPage, sortKey, sortOrder }: PageParams<keyof I>,
  toEntity: (item: I) => E | Promise<E>,
  prisma: PrismaClient,
  args: FindManyArgs<M>,
): Promise<PaginationResult<E>> => {
  // biome-ignore lint/suspicious/noExplicitAny:
  const delegate = prisma[model.toLowerCase()] as any;
  const totalCount = await delegate.count({
    where: {
      ...args?.where,
      deletedAt: null,
    },
  });
  const toEntityList = async (items: I[]): Promise<E[]> =>
    items.reduce(
      async (prev, item) => (await prev).concat(await toEntity(item)),
      Promise.resolve([] as E[]),
    );

  const _perPage = Math.min(Math.max(1, perPage), 100);
  const totalPage = Math.ceil(totalCount / _perPage);
  const currentPage = Math.max(1, Math.min(page, totalPage));
  const items: I[] = await delegate.findMany({
    ...args,
    where: {
      ...args?.where,
      deletedAt: null,
    },
    take: _perPage,
    skip: (currentPage - 1) * _perPage,
    orderBy: {
      [sortKey ?? 'id']: sortOrder ?? 'desc',
    },
  });

  return {
    items: await toEntityList(items),
    pageInfo: {
      totalCount,
      perPage: _perPage,
      totalPage,
      currentPage,
    },
    key: sortKey as string,
  };
};
