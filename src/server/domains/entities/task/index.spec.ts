import { describe, expect, test } from 'bun:test';
import { Task } from '.';
import { Id as UserId } from '../user/valueObjects';
import {
  CompletedAt,
  CreatedAt,
  Description,
  ExpiredAt,
  Id,
  StartedAt,
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
      expect(task.startedAt.value).toBeNull();
      expect(task.expiredAt.value).toBeNull();
    });
  });

  describe('reconstruct', () => {
    test.each([[null], ['2025-01-02T00:00:00.000Z']])(
      'インスタンスが復元される',
      (date) => {
        // given
        // when
        const task = Task.reconstruct(
          new Id('id'),
          new UserId('user-id'),
          new Title('title'),
          new Description('description'),
          new CompletedAt(date),
          new StartedAt(date),
          new ExpiredAt(date),
          new CreatedAt('2025-01-01T00:00:00.000Z'),
          new UpdatedAt('2025-12-31T23:59:59.999Z'),
        );

        // then
        expect(task.id.value).toBe('id');
        expect(task.userId.value).toBe('user-id');
        expect(task.title.value).toBe('title');
        expect(task.description.value).toBe('description');
        expect(task.completedAt.value?.toISOString() ?? null).toBe(date);
        expect(task.startedAt.value?.toISOString() ?? null).toBe(date);
        expect(task.expiredAt.value?.toISOString() ?? null).toBe(date);
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
        new StartedAt(null),
        new ExpiredAt(null),
        new CreatedAt('2025-01-01T00:00:00.000Z'),
        new UpdatedAt('2025-12-31T23:59:59.999Z'),
      );
      const task2 = Task.reconstruct(
        new Id(id2),
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
        new CompletedAt(null),
        new StartedAt(null),
        new ExpiredAt(null),
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
    ])('インスタンスが更新される', (date, updateDate) => {
      // given
      const task = Task.reconstruct(
        new Id('id'),
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
        new CompletedAt(date),
        new StartedAt(date),
        new ExpiredAt(date),
        new CreatedAt('2025-01-01T00:00:00.000Z'),
        new UpdatedAt('2025-12-31T23:59:59.999Z'),
      );

      // when
      const result = task.update({
        title: new Title('updated title'),
        description: new Description('updated description'),
        completedAt: new CompletedAt(updateDate),
        startedAt: new StartedAt(updateDate),
        expiredAt: new ExpiredAt(updateDate),
      });

      expect(result.title.value).toBe('updated title');
      expect(result.description.value).toBe('updated description');
      expect(result.completedAt.value?.toISOString() ?? null).toBe(updateDate);
      expect(result.startedAt.value?.toISOString() ?? null).toBe(updateDate);
      expect(result.expiredAt.value?.toISOString() ?? null).toBe(updateDate);
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

    test('すでに完了しているタスクを完了にしようとすると、InvalidControlエラーが発生する', () => {
      // given
      const task = Task.create(
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
      );
      const completedTask = task.onCompleted();

      // when & then
      expect(() => {
        completedTask.onCompleted();
      }).toThrow('その操作は許可されていません');
    });
  });

  describe('onStarted', () => {
    test('開始日時が更新される', () => {
      // given
      const task = Task.create(
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
      );

      // when
      const result = task.onStarted();

      // then
      expect(result.startedAt.value).not.toBeNull();
    });

    test('すでに開始しているタスクを開始にしようとすると、InvalidControlエラーが発生する', () => {
      // given
      const task = Task.create(
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
      );
      const startedTask = task.onStarted();

      // when & then
      expect(() => {
        startedTask.onStarted();
      }).toThrow('その操作は許可されていません');
    });

    test('すでに完了しているタスクを開始にしようとすると、InvalidControlエラーが発生する', () => {
      // given
      const task = Task.create(
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
      );
      const completedTask = task.onCompleted();

      // when & then
      expect(() => {
        completedTask.onStarted();
      }).toThrow('その操作は許可されていません');
    });
  });

  describe('status', () => {
    test('completedAtが設定されている場合はCompletedが返却される', () => {
      // given
      const task = Task.reconstruct(
        new Id('id'),
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
        new CompletedAt('2025-01-01T00:00:00.000Z'),
        new StartedAt('2024-01-01T00:00:00.000Z'),
        new ExpiredAt('2026-01-01T00:00:00.000Z'),
        new CreatedAt('2023-01-01T00:00:00.000Z'),
        new UpdatedAt('2023-01-01T00:00:00.000Z'),
      );

      // when
      const result = task.status;

      // then
      expect(result.value).toBe('Completed');
    });

    test('expiredAtが過去の日付の場合はExpiredが返却される', () => {
      // given
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // 1日前の日付

      const task = Task.reconstruct(
        new Id('id'),
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
        new CompletedAt(null),
        new StartedAt('2024-01-01T00:00:00.000Z'),
        new ExpiredAt(pastDate.toISOString()),
        new CreatedAt('2023-01-01T00:00:00.000Z'),
        new UpdatedAt('2023-01-01T00:00:00.000Z'),
      );

      // when
      const result = task.status;

      // then
      expect(result.value).toBe('Expired');
    });

    test('startedAtが設定されている場合はInProgressが返却される', () => {
      // given
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // 1日後の日付

      const task = Task.reconstruct(
        new Id('id'),
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
        new CompletedAt(null),
        new StartedAt('2024-01-01T00:00:00.000Z'),
        new ExpiredAt(futureDate.toISOString()),
        new CreatedAt('2023-01-01T00:00:00.000Z'),
        new UpdatedAt('2023-01-01T00:00:00.000Z'),
      );

      // when
      const result = task.status;

      // then
      expect(result.value).toBe('InProgress');
    });

    test('completedAt, expiredAt, startedAtが設定されていない場合はPlannedが返却される', () => {
      // given
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // 1日後の日付

      const task = Task.reconstruct(
        new Id('id'),
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
        new CompletedAt(null),
        new StartedAt(null),
        new ExpiredAt(futureDate.toISOString()),
        new CreatedAt('2023-01-01T00:00:00.000Z'),
        new UpdatedAt('2023-01-01T00:00:00.000Z'),
      );

      // when
      const result = task.status;

      // then
      expect(result.value).toBe('Planned');
    });
  });
});
