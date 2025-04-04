import { describe, expect, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { User } from '#/domains/entities/user';
import { Id, UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { UserRepositoryMock } from '#/domains/repositories/userRepository.mock';
import { UserSession } from '#/usecases/shared/session/userSession';
import { DeleteUserInteractor } from './interactor';

describe('DeleteUserInteractor', () => {
  test('指定されたIDのユーザーが削除される', async () => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
    );
    const repository = new UserRepositoryMock([user]);
    const interactor = new DeleteUserInteractor(repository);

    // when
    const result = await interactor.handle(
      new UserSession(
        { user },
        {
          User: DITokens.UserPolicy,
        },
      ),
      user.id,
    );

    // then
    expect(result?.name.value).toBe('name');
    expect(result?.email.value).toBe('user@example.com');

    expect(repository.calledMethods).toHaveLength(2);
    expect(repository.calledMethods[0].method).toBe('find');
    expect(repository.calledMethods[1].method).toBe('delete');
  });

  test('指定されたIDのユーザーが存在しない場合、nullが返却される', async () => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
    );
    const repository = new UserRepositoryMock([user]);
    const interactor = new DeleteUserInteractor(repository);

    // when
    const result = await interactor.handle(
      new UserSession(
        { user },
        {
          User: DITokens.UserPolicy,
        },
      ),
      new Id(undefined),
    );

    // then
    expect(result).toBeNull();

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
        ),
      },
    ],
  ])('権限がない場合、エラーが発生する', async (context) => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
    );
    const repository = new UserRepositoryMock([user]);
    const interactor = new DeleteUserInteractor(repository);

    // when
    // then
    await expect(
      interactor.handle(
        new UserSession(context, {
          User: DITokens.UserPolicy,
        }),
        user.id,
      ),
    ).rejects.toThrow();
    expect(repository.calledMethods).toHaveLength(1);
    expect(repository.calledMethods[0].method).toBe('find');
  });
});
