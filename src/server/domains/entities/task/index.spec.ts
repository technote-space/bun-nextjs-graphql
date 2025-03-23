import { describe, expect, test } from 'bun:test';
import { Task } from '.';
import { Id as UserId } from '../user/valueObjects';
import {
  CompletedAt,
  CreatedAt,
  Description,
  Id,
  Title,
  UpdatedAt,
} from './valueObjects';

describe('Task', () => {
  describe('create', () => {
    test('インスタンスが作成される', () => {
      // given
      // when
      const task = Task.create(
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
      );

      // then
      expect(task.userId.value).toBe('user-id');
      expect(task.title.value).toBe('title');
      expect(task.description.value).toBe('description');
      expect(task.completedAt.value).toBeNull();
    });
  });

  describe('reconstruct', () => {
    test.each([[null], ['2025-01-02T00:00:00.000Z']])(
      'インスタンスが復元される',
      (completedAt) => {
        // given
        // when
        const task = Task.reconstruct(
          new Id('id'),
          new UserId('user-id'),
          new Title('title'),
          new Description('description'),
          new CompletedAt(completedAt),
          new CreatedAt('2025-01-01T00:00:00.000Z'),
          new UpdatedAt('2025-12-31T23:59:59.999Z'),
        );

        // then
        expect(task.id.value).toBe('id');
        expect(task.userId.value).toBe('user-id');
        expect(task.title.value).toBe('title');
        expect(task.description.value).toBe('description');
        expect(task.completedAt.value?.toISOString() ?? null).toBe(completedAt);
        expect(task.createdAt.value.toISOString()).toBe(
          '2025-01-01T00:00:00.000Z',
        );
        expect(task.updatedAt.value.toISOString()).toBe(
          '2025-12-31T23:59:59.999Z',
        );
      },
    );
  });

  describe('equals', () => {
    test.each([
      ['id1', 'id1', true],
      ['id1', 'id2', false],
    ])('インスタンスの比較はidで行われる', (id1, id2, expected) => {
      // given
      const task1 = Task.reconstruct(
        new Id(id1),
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
        new CompletedAt(null),
        new CreatedAt('2025-01-01T00:00:00.000Z'),
        new UpdatedAt('2025-12-31T23:59:59.999Z'),
      );
      const task2 = Task.reconstruct(
        new Id(id2),
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
        new CompletedAt(null),
        new CreatedAt('2025-01-01T00:00:00.000Z'),
        new UpdatedAt('2025-12-31T23:59:59.999Z'),
      );

      // when
      const result = task1.equals(task2);

      // then
      expect(result).toBe(expected);
    });
  });

  describe('update', () => {
    test.each([
      [null, '2026-01-01T00:00:00.000Z'],
      ['2025-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z'],
      ['2025-01-01T00:00:00.000Z', null],
    ])('インスタンスが更新される', (completedAt, updateCompletedAt) => {
      // given
      const task = Task.reconstruct(
        new Id('id'),
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
        new CompletedAt(completedAt),
        new CreatedAt('2025-01-01T00:00:00.000Z'),
        new UpdatedAt('2025-12-31T23:59:59.999Z'),
      );

      // when
      const result = task.update({
        title: new Title('updated title'),
        description: new Description('updated description'),
        completedAt: new CompletedAt(updateCompletedAt),
      });

      expect(result.title.value).toBe('updated title');
      expect(result.description.value).toBe('updated description');
      expect(result.completedAt.value?.toISOString() ?? null).toBe(
        updateCompletedAt,
      );
    });
  });

  describe('onCompleted', () => {
    test('完了日時が更新される', () => {
      // given
      const task = Task.create(
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
      );

      // when
      const result = task.onCompleted();

      // then
      expect(result.completedAt.value).not.toBeNull();
    });
  });
});
