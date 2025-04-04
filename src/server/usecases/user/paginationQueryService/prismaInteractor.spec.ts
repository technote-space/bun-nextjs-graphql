import { describe, expect, mock, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { User } from '#/domains/entities/user';
import {
  CreatedAt,
  Id,
  SsoId,
  UpdatedAt,
  UserEmail,
  UserName,
} from '#/domains/entities/user/valueObjects';
import { UserSession } from '#/usecases/shared/session/userSession';
import { PrismaUserPaginationQueryService } from './prismaInteractor';

describe('PrismaUserPaginationQueryService', () => {
  test.each([
    [
      undefined,
      {},
    ],
    [
      'a b  a',
      {
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
    const users = [...Array(5).keys()].map((index) => ({
      id: `sso-id${index}`,
      email: `test${index}@example.com`,
    }));
    const items = users.map((user, index) => ({
      id: `user-id${index}`,
      ssoId: user.id,
      name: `name${index}`,
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
            new SsoId(user.ssoId),
            new UserName(user.name),
            new UserEmail(users.find((u) => u.id === user.ssoId)?.email ?? ''),
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
            new SsoId('sso-id1'),
            new UserName('user name'),
            new UserEmail('user1@example.com'),
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
        sortKey: 'name',
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
      orderBy: { name: 'asc' },
      skip: 0,
      take: 20,
      where: expectedWhere,
    });
  });
});
