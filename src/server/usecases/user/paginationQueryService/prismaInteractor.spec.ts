import { describe, expect, mock, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { User } from '#/domains/entities/user';
import {
  CreatedAt,
  Id,
  Name,
  UpdatedAt,
} from '#/domains/entities/user/valueObjects';
import { UserSession } from '#/usecases/shared/session/userSession';
import { PrismaUserPaginationQueryService } from './prismaInteractor';

describe('PrismaUserPaginationQueryService', () => {
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
            name: { contains: 'a' },
          },
          {
            name: { contains: 'b' },
          },
        ],
      },
    ],
  ])('ページネーション結果が返却される', async (name, expectedWhere) => {
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
    const interactor = new PrismaUserPaginationQueryService(
      {
        user: {
          count,
          findMany,
        },
      } as never,
      {
        toEntity: (user) =>
          User.reconstruct(
            new Id(user.id),
            new Name(user.name),
            new CreatedAt(user.createdAt),
            new UpdatedAt(user.updatedAt),
          ),
      } as never,
    );

    // when
    const result = await interactor.handle(
      new UserSession(
        {
          user: User.reconstruct(
            new Id('user-id1'),
            new Name('user name'),
            new CreatedAt(undefined),
            new UpdatedAt(undefined),
          ),
        },
        {
          User: DITokens.UserPolicy,
        },
      ),
      {
        page: 1,
        perPage: 20,
        name,
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
