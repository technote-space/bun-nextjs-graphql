import { describe, expect, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { User } from '#/domains/entities/user';
import { Id, UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { Role } from '#/domains/entities/user/valueObjects';
import { UserRepositoryMock } from '#/domains/repositories/userRepository.mock';
import { UserSession } from '#/usecases/shared/session/userSession';
import { UpdateUserInteractor } from './interactor';

describe('UpdateUserInteractor', () => {
  test.each([
    [
      new UserName('updated name'),
      new UserEmail('updated@example.com'),
      'updated name',
      'updated@example.com',
    ],
    [undefined, undefined, 'name', 'user@example.com'],
  ])(
    '指定されたIDのユーザーが更新される',
    async (name, email, expectedName, expectedEmail) => {
      // given
      const user = User.create(
        new UserName('name'),
        new UserEmail('user@example.com'),
        new Role('EDITOR'),
      );
      const repository = new UserRepositoryMock([user]);
      const interactor = new UpdateUserInteractor(repository);

      // when
      const result = await interactor.handle(
        new UserSession(
          { user },
          {
            User: DITokens.UserPolicy,
          },
        ),
        user.id,
        { name, email },
      );

      // then
      expect(result?.name.value).toBe(expectedName);
      expect(result?.email.value).toBe(expectedEmail);

      expect(repository.calledMethods).toHaveLength(2);
      expect(repository.calledMethods[0].method).toBe('find');
      expect(repository.calledMethods[1].method).toBe('save');
    },
  );

  test('指定されたIDのユーザーが存在しない場合、エラーが発生する', async () => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
      new Role('EDITOR'),
    );
    const repository = new UserRepositoryMock([user]);
    const interactor = new UpdateUserInteractor(repository);

    // when
    // then
    expect(
      interactor.handle(
        new UserSession(
          { user },
          {
            User: DITokens.UserPolicy,
          },
        ),
        new Id(undefined),
        {},
      ),
    ).rejects.toThrow();
    expect(repository.calledMethods).toHaveLength(1);
    expect(repository.calledMethods[0].method).toBe('find');
  });

  test.each([
    [null],
    [
      {
        user: User.create(
          new UserName('test'),
          new UserEmail('test@example.com'),
          new Role('EDITOR'),
        ),
      },
    ],
  ])('権限がない場合、エラーが発生する', async (context) => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
      new Role('EDITOR'),
    );
    const repository = new UserRepositoryMock([user]);
    const interactor = new UpdateUserInteractor(repository);

    // when
    // then
    expect(
      interactor.handle(
        new UserSession(context, {
          User: DITokens.UserPolicy,
        }),
        user.id,
        {},
      ),
    ).rejects.toThrow();
    expect(repository.calledMethods).toHaveLength(1);
    expect(repository.calledMethods[0].method).toBe('find');
  });
});
