import { describe, expect, test } from 'bun:test';
import type { UserRole } from '$/types';
import dayjs from 'dayjs';
import { User } from '#/domains/entities/user';
import {
  CreatedAt,
  Id,
  Role,
  SsoId,
  UpdatedAt,
  UserEmail,
  UserName,
} from '#/domains/entities/user/valueObjects';
import { GraphQLUserPresenter } from '.';

describe('GraphQLUserPresenter', () => {
  test('GraphQL用の出力に変換される', () => {
    // given
    const user = User.reconstruct(
      new Id('id'),
      new SsoId('sso-id'),
      new UserName('test name'),
      new UserEmail('user@example.com'),
      new Role('EDITOR'),
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
      email: 'user@example.com',
      role: 'EDITOR' as UserRole,
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
