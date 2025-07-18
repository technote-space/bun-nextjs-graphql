import { describe, expect, mock, test } from 'bun:test';
import { TaskStatus } from '$/types';
import { DITokens } from '#/config/constants';
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
import { User } from '#/domains/entities/user';
import {
  Role,
  CreatedAt as UserCreatedAt,
  UserEmail,
  Id as UserId,
  UserName,
  SsoId as UserSsoId,
  UpdatedAt as UserUpdatedAt,
} from '#/domains/entities/user/valueObjects';
import { UserSession } from '#/usecases/shared/session/userSession';
import { PrismaTaskPaginationQueryService } from './prismaInteractor';

describe('PrismaTaskPaginationQueryService', () => {
  test.each([
    [
      undefined,
      {
        userId: 'user-id1',
        deletedAt: null,
      },
    ],
    [
      'a b  a',
      {
        userId: 'user-id1',
        AND: [
          {
            OR: [
              { title: { contains: 'a' } },
              { description: { contains: 'a' } },
            ],
          },
          {
            OR: [
              { title: { contains: 'b' } },
              { description: { contains: 'b' } },
            ],
          },
        ],
        deletedAt: null,
      },
    ],
  ])('ページネーション結果が返却される', async (q, expectedWhere) => {
    // given
    const items = [...Array(5).keys()].map((index) => ({
      id: `id${index}`,
      userId: `user-id${index % 2}`,
      title: `title${index}`,
      description: `description${index}`,
      completedAt: null,
      startedAt: null,
      expiredAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const count = mock(() => Promise.resolve(15));
    const findMany = mock(() => Promise.resolve(items));
    const interactor = new PrismaTaskPaginationQueryService(
      {
        task: {
          count,
          findMany,
        },
      } as never,
      {
        toEntity: (task) =>
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
      } as never,
    );

    // when
    const result = await interactor.handle(
      new UserSession(
        {
          user: User.reconstruct(
            new UserId('user-id1'),
            new UserSsoId('sso-id'),
            new UserName('user name'),
            new UserEmail('user@example.com'),
            new Role('EDITOR'),
            new UserCreatedAt(undefined),
            new UserUpdatedAt(undefined),
          ),
        },
        {
          Task: DITokens.TaskPolicy,
        },
      ),
      {
        page: 1,
        perPage: 20,
        q,
        sortKey: 'title',
        sortOrder: 'asc',
      },
    );

    // then
    expect(result.items).toHaveLength(5);
    expect(result.pageInfo).toEqual({
      totalCount: 15,
      perPage: 20,
      totalPage: 1,
      currentPage: 1,
    });
    expect(count).toBeCalledWith({
      where: expectedWhere,
    });
    expect(findMany).toBeCalledWith({
      orderBy: { title: 'asc' },
      skip: 0,
      take: 20,
      where: expectedWhere,
    });
  });

  test.each([
    [
      [TaskStatus.Completed],
      {
        userId: 'user-id1',
        OR: [{ completedAt: { not: null } }],
      },
    ],
    [
      [TaskStatus.Expired],
      {
        userId: 'user-id1',
        OR: [
          {
            completedAt: null,
            expiredAt: { lt: expect.any(Date) },
          },
        ],
      },
    ],
    [
      [TaskStatus.InProgress],
      {
        userId: 'user-id1',
        OR: [
          {
            completedAt: null,
            startedAt: { not: null },
          },
        ],
      },
    ],
    [
      [TaskStatus.Planned],
      {
        userId: 'user-id1',
        OR: [
          {
            completedAt: null,
            startedAt: null,
          },
        ],
      },
    ],
    [
      [TaskStatus.Completed, TaskStatus.InProgress],
      {
        userId: 'user-id1',
        OR: [
          { completedAt: { not: null } },
          {
            completedAt: null,
            startedAt: { not: null },
          },
        ],
      },
    ],
    [
      [
        TaskStatus.Completed,
        TaskStatus.Expired,
        TaskStatus.InProgress,
        TaskStatus.Planned,
      ],
      {
        userId: 'user-id1',
        OR: [
          { completedAt: { not: null } },
          {
            completedAt: null,
            expiredAt: { lt: expect.any(Date) },
          },
          {
            completedAt: null,
            startedAt: { not: null },
          },
          {
            completedAt: null,
            startedAt: null,
          },
        ],
      },
    ],
    [
      [],
      {
        userId: 'user-id1',
      },
    ],
    [
      null,
      {
        userId: 'user-id1',
      },
    ],
  ])(
    'ステータスによるフィルタリング用の検索条件が設定される',
    async (statuses, expectedWhere) => {
      // given
      const items = [...Array(5).keys()].map((index) => ({
        id: `id${index}`,
        userId: `user-id${index % 2}`,
        title: `title${index}`,
        description: `description${index}`,
        completedAt: null,
        startedAt: null,
        expiredAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      const count = mock(() => Promise.resolve(15));
      const findMany = mock(() => Promise.resolve(items));
      const interactor = new PrismaTaskPaginationQueryService(
        {
          task: {
            count,
            findMany,
          },
        } as never,
        {
          toEntity: (task) =>
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
        } as never,
      );

      // when
      const result = await interactor.handle(
        new UserSession(
          {
            user: User.reconstruct(
              new UserId('user-id1'),
              new UserSsoId('sso-id'),
              new UserName('user name'),
              new UserEmail('user@example.com'),
              new Role('EDITOR'),
              new UserCreatedAt(undefined),
              new UserUpdatedAt(undefined),
            ),
          },
          {
            Task: DITokens.TaskPolicy,
          },
        ),
        {
          page: 1,
          perPage: 20,
          statuses,
          sortKey: 'title',
          sortOrder: 'asc',
        },
      );

      // then
      expect(result.items).toHaveLength(5);
      expect(result.pageInfo).toEqual({
        totalCount: 15,
        perPage: 20,
        totalPage: 1,
        currentPage: 1,
      });

      // Use expect.objectContaining to handle Date objects in the comparison
      expect(count).toBeCalledWith({
        where: expect.objectContaining(expectedWhere),
      });
      expect(findMany).toBeCalledWith({
        orderBy: { title: 'asc' },
        skip: 0,
        take: 20,
        where: expect.objectContaining(expectedWhere),
      });
    },
  );
});
