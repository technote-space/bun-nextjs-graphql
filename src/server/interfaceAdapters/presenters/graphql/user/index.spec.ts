import { describe, expect, test } from 'bun:test';
import dayjs from 'dayjs';
import { User } from '#/domains/entities/user';
import {
  CreatedAt,
  Id,
  Name,
  UpdatedAt,
} from '#/domains/entities/user/valueObjects';
import { GraphQLUserPresenter } from '.';

describe('GraphQLUserPresenter', () => {
  test('GraphQL用の出力に変換される', () => {
    // given
    const user = User.reconstruct(
      new Id('id'),
      new Name('test name'),
      new CreatedAt('2025-01-01T00:00:00.000Z'),
      new UpdatedAt('2025-12-31T23:59:59.999Z'),
    );
    const presenter = new GraphQLUserPresenter();

    // when
    const result = presenter.entity(user);

    // then
    expect(result).toEqual({
      __typename: 'User',
      id: 'id',
      name: 'test name',
      createdAt: dayjs('2025-01-01T00:00:00.000Z').toDate(),
      updatedAt: dayjs('2025-12-31T23:59:59.999Z').toDate(),
      tasks: undefined as never,
    });
  });

  test('nullの場合はnullが返却される', () => {
    // given
    const presenter = new GraphQLUserPresenter();

    // when
    const result = presenter.entity(null);

    // then
    expect(result).toBeNull();
  });
});
