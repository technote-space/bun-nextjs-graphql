import { describe, expect, mock, test } from 'bun:test';
import { Task } from '#/domains/entities/task';
import {
  CompletedAt,
  CreatedAt,
  Description,
  ExpiredAt,
  Id,
  StartedAt,
  Title,
  UpdatedAt,
} from '#/domains/entities/task/valueObjects';
import { Id as UserId } from '#/domains/entities/user/valueObjects';
import { paginate } from '#/usecases/shared/prismaUtils';

describe('paginate', () => {
  const getItems = (count: number) =>
    [...Array(count).keys()].map((index) => ({
      id: `id${index}`,
      userId: `user-id${index}`,
      title: `title${index}`,
      description: `description${index}`,
      completedAt: null,
      startedAt: null,
      expiredAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

  test.each([
    [
      { page: 1, perPage: 10, sortKey: 'id', sortOrder: 'desc' } as const,
      { totalCount: 25, perPage: 10, totalPage: 3, currentPage: 1 },
      {
        skip: 0,
        take: 10,
        orderBy: { id: 'desc' },
        where: { deletedAt: null },
      },
    ],
    [
      { page: 2, perPage: 10, sortKey: 'id', sortOrder: 'desc' } as const,
      { totalCount: 25, perPage: 10, totalPage: 3, currentPage: 2 },
      {
        skip: 10,
        take: 10,
        orderBy: { id: 'desc' },
        where: { deletedAt: null },
      },
    ],
    [
      { page: 3, perPage: 10, sortKey: 'id', sortOrder: 'desc' } as const,
      { totalCount: 25, perPage: 10, totalPage: 3, currentPage: 3 },
      {
        skip: 20,
        take: 10,
        orderBy: { id: 'desc' },
        where: { deletedAt: null },
      },
    ],
    [
      { page: 10, perPage: 10, sortKey: 'id', sortOrder: 'desc' } as const,
      { totalCount: 25, perPage: 10, totalPage: 3, currentPage: 3 },
      {
        skip: 20,
        take: 10,
        orderBy: { id: 'desc' },
        where: { deletedAt: null },
      },
    ],
    [
      { page: 10, perPage: 1000, sortKey: 'id', sortOrder: 'desc' } as const,
      { totalCount: 25, perPage: 100, totalPage: 1, currentPage: 1 },
      {
        skip: 0,
        take: 100,
        orderBy: { id: 'desc' },
        where: { deletedAt: null },
      },
    ],
    [
      { page: 1, perPage: 10, sortKey: 'title', sortOrder: 'asc' } as const,
      { totalCount: 25, perPage: 10, totalPage: 3, currentPage: 1 },
      {
        skip: 0,
        take: 10,
        orderBy: { title: 'asc' },
        where: { deletedAt: null },
      },
    ],
  ])(
    '指定されたページネーションのパラメータで検索される',
    async (pageParams, expectedPageInfo, expectedFindManyCalledWith) => {
      // given
      const findMany = mock(() => Promise.resolve(getItems(5)));
      const count = mock(() => Promise.resolve(25));
      const prisma = { task: { findMany, count } } as never;

      // when
      const result = await paginate(
        'Task',
        pageParams,
        (task) =>
          Task.reconstruct(
            new Id(task.id),
            new UserId(task.userId),
            new Title(task.title),
            new Description(task.description),
            new CompletedAt(task.completedAt),
            new StartedAt(task.startedAt),
            new ExpiredAt(task.expiredAt),
            new CreatedAt(task.createdAt),
            new UpdatedAt(task.updatedAt),
          ),
        prisma,
        {},
      );

      // then
      expect(result.items).toHaveLength(5);
      expect(result.pageInfo).toEqual(expectedPageInfo);
      expect(findMany).toBeCalledWith(expectedFindManyCalledWith);
    },
  );

  test('whereを指定した場合、検索に使用される', async () => {
    // given
    const findMany = mock(() => Promise.resolve(getItems(5)));
    const count = mock(() => Promise.resolve(15));
    const prisma = { task: { findMany, count } } as never;

    // when
    const result = await paginate(
      'Task',
      { page: 1, perPage: 20, sortKey: 'title', sortOrder: 'desc' },
      (task) =>
        Task.reconstruct(
          new Id(task.id),
          new UserId(task.userId),
          new Title(task.title),
          new Description(task.description),
          new CompletedAt(task.completedAt),
          new StartedAt(task.startedAt),
          new ExpiredAt(task.expiredAt),
          new CreatedAt(task.createdAt),
          new UpdatedAt(task.updatedAt),
        ),
      prisma,
      {
        where: {
          AND: [
            {
              OR: [
                { title: { contains: 'a' } },
                { description: { contains: 'a' } },
              ],
            },
          ],
        },
      },
    );

    expect(result.items).toHaveLength(5);
    expect(result.pageInfo).toEqual({
      totalCount: 15,
      perPage: 20,
      totalPage: 1,
      currentPage: 1,
    });
    expect(findMany).toBeCalledWith({
      orderBy: { title: 'desc' },
      skip: 0,
      take: 20,
      where: {
        AND: [
          {
            OR: [
              { title: { contains: 'a' } },
              { description: { contains: 'a' } },
            ],
          },
        ],
        deletedAt: null,
      },
    });
  });
});
