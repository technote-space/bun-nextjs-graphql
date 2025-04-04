import { describe, expect, test } from 'bun:test';
import dayjs from 'dayjs';
import { User } from '#/domains/entities/user';
import {
  CreatedAt,
  Id,
  SsoId,
  UpdatedAt,
  UserEmail,
  UserName,
} from '#/domains/entities/user/valueObjects';
import { GraphQLUserQueryServicePresenter } from './queryService';

describe('GraphQLUserQueryServicePresenter', () => {
  test('GraphQL用の出力に変換される', () => {
    // given
    const user = User.reconstruct(
      new Id('id'),
      new SsoId('sso-id'),
      new UserName('test name'),
      new UserEmail('user@example.com'),
      new CreatedAt('2025-01-01T00:00:00.000Z'),
      new UpdatedAt('2025-12-31T23:59:59.999Z'),
    );
    const presenter = new GraphQLUserQueryServicePresenter();

    // when
    const result = presenter.paginate({
      items: [user],
      pageInfo: {
        totalCount: 10,
        perPage: 20,
        totalPage: 1,
        currentPage: 1,
      },
      key: 'name',
    });

    // then
    expect(result).toEqual({
      __typename: 'UserConnection',
      edges: [
        {
          cursor: 'test name',
          node: {
            __typename: 'User',
            id: 'id',
            name: 'test name',
            email: 'user@example.com',
            createdAt: dayjs('2025-01-01T00:00:00.000Z').toDate(),
            updatedAt: dayjs('2025-12-31T23:59:59.999Z').toDate(),
            tasks: undefined as never,
          },
        },
      ],
      pageInfo: {
        totalCount: 10,
        perPage: 20,
        totalPage: 1,
        currentPage: 1,
      },
    });
  });
});
