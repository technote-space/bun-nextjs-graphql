import { describe, expect, test } from 'bun:test';
import dayjs from 'dayjs';
import { Task } from '#/domains/entities/task';
import {
  CompletedAt,
  CreatedAt,
  Description,
  Id,
  Title,
  UpdatedAt,
} from '#/domains/entities/task/valueObjects';
import { Id as UserId } from '#/domains/entities/user/valueObjects';
import { GraphQLTaskPresenter } from '.';

describe('GraphQLTaskPresenter', () => {
  test.each([[null], ['2025-02-01T00:00:00.000Z']])(
    'GraphQL用の出力に変換される',
    (completedAt) => {
      // given
      const task = Task.reconstruct(
        new Id('id'),
        new UserId('user-id'),
        new Title('test title'),
        new Description('test description'),
        new CompletedAt(completedAt),
        new CreatedAt('2025-01-01T00:00:00.000Z'),
        new UpdatedAt('2025-12-31T23:59:59.999Z'),
      );
      const presenter = new GraphQLTaskPresenter();

      // when
      const result = presenter.entity(task);

      // then
      expect(result).toEqual({
        __typename: 'Task',
        id: 'id',
        userId: 'user-id',
        title: 'test title',
        description: 'test description',
        completedAt: completedAt ? new Date(completedAt) : null,
        createdAt: dayjs('2025-01-01T00:00:00.000Z').toDate(),
        updatedAt: dayjs('2025-12-31T23:59:59.999Z').toDate(),
        user: undefined as never,
      });
    },
  );

  test('nullの場合はnullが返却される', () => {
    // given
    const presenter = new GraphQLTaskPresenter();

    // when
    const result = presenter.entity(null);

    // then
    expect(result).toBeNull();
  });
});
