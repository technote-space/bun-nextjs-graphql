import { describe, expect, test } from 'bun:test';
import { User } from '.';
import { CreatedAt, Id, Name, UpdatedAt } from './valueObjects';

describe('User', () => {
  describe('create', () => {
    test('インスタンスが作成される', () => {
      // given
      // when
      const user = User.create(new Name('name'));

      // then
      expect(user.name.value).toBe('name');
    });
  });

  describe('reconstruct', () => {
    test('インスタンスが復元される', () => {
      // given
      // when
      const user = User.reconstruct(
        new Id('id'),
        new Name('name'),
        new CreatedAt('2025-01-01T00:00:00.000Z'),
        new UpdatedAt('2025-12-31T23:59:59.999Z'),
      );

      // then
      expect(user.id.value).toBe('id');
      expect(user.name.value).toBe('name');
      expect(user.createdAt.value.toISOString()).toBe(
        '2025-01-01T00:00:00.000Z',
      );
      expect(user.updatedAt.value.toISOString()).toBe(
        '2025-12-31T23:59:59.999Z',
      );
    });
  });

  describe('equals', () => {
    test.each([
      ['id1', 'id1', true],
      ['id1', 'id2', false],
    ])('インスタンスの比較はidで行われる', (id1, id2, expected) => {
      // given
      const user1 = User.reconstruct(
        new Id(id1),
        new Name('name'),
        new CreatedAt('2025-01-01T00:00:00.000Z'),
        new UpdatedAt('2025-12-31T23:59:59.999Z'),
      );
      const user2 = User.reconstruct(
        new Id(id2),
        new Name('name'),
        new CreatedAt('2025-01-01T00:00:00.000Z'),
        new UpdatedAt('2025-12-31T23:59:59.999Z'),
      );

      // when
      const result = user1.equals(user2);

      // then
      expect(result).toBe(expected);
    });
  });

  describe('update', () => {
    test('インスタンスが更新される', () => {
      // given
      const user = User.reconstruct(
        new Id('id'),
        new Name('name'),
        new CreatedAt('2025-01-01T00:00:00.000Z'),
        new UpdatedAt('2025-12-31T23:59:59.999Z'),
      );

      // when
      const result = user.update({
        name: new Name('updated name'),
      });

      expect(result.name.value).toBe('updated name');
    });
  });
});
