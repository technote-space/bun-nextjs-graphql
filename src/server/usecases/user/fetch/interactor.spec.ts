import { describe, expect, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { User } from '#/domains/entities/user';
import { Id, UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { Role } from '#/domains/entities/user/valueObjects';
import { UserRepositoryMock } from '#/domains/repositories/userRepository.mock';
import { UserSession } from '#/usecases/shared/session/userSession';
import { UpdateUserInteractor } from '#/usecases/user/update/interactor';
import { FetchUserInteractor } from './interactor';

describe('FetchUserInteractor', () => {
  test('指定されたIDのユーザーが返却される', async () => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
      new Role('EDITOR'),
    );
    const repository = new UserRepositoryMock([user]);
    const interactor = new FetchUserInteractor(repository);

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
    expect(result.name.value).toBe('name');
    expect(result.email.value).toBe('user@example.com');

    expect(repository.calledMethods).toHaveLength(1);
    expect(repository.calledMethods[0].method).toBe('find');
  });

  test('指定されたIDのユーザーが存在しない場合、エラーが発生する', async () => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
      new Role('EDITOR'),
    );
    const repository = new UserRepositoryMock([user]);
    const interactor = new FetchUserInteractor(repository);

    // when
    // then
    expect(
      interactor.handle(
        new UserSession(null, {
          User: DITokens.UserPolicy,
        }),
        new Id(undefined),
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
