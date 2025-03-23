import { describe, expect, mock, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { Task } from '#/domains/entities/task';
import {
  CompletedAt,
  CreatedAt,
  Description,
  Id,
  Title,
  UpdatedAt,
} from '#/domains/entities/task/valueObjects';
import { User } from '#/domains/entities/user';
import {
  CreatedAt as UserCreatedAt,
  Id as UserId,
  Name as UserName,
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
            new UserName('user name'),
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
});
