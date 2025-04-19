import { describe, expect, test } from 'bun:test';
import { TaskStatus } from '$/types';
import dayjs from 'dayjs';
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
import { GraphQLTaskPresenter } from '.';

describe('GraphQLTaskPresenter', () => {
  test.each([[null], ['2025-02-01T00:00:00.000Z']])(
    'GraphQL用の出力に変換される',
    (date) => {
      // given
      const task = Task.reconstruct(
        new Id('id'),
        new UserId('user-id'),
        new Title('test title'),
        new Description('test description'),
        new CompletedAt(date),
        new StartedAt(date),
        new ExpiredAt(date),
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
        completedAt: date ? new Date(date) : null,
        startedAt: date ? new Date(date) : null,
        expiredAt: date ? new Date(date) : null,
        createdAt: dayjs('2025-01-01T00:00:00.000Z').toDate(),
        updatedAt: dayjs('2025-12-31T23:59:59.999Z').toDate(),
        status: date ? TaskStatus.Completed : TaskStatus.Planned,
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
