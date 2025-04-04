import { describe, expect, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { User } from '#/domains/entities/user';
import { Id, UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { UserRepositoryMock } from '#/domains/repositories/userRepository.mock';
import { UserSession } from '#/usecases/shared/session/userSession';
import { FetchUserInteractor } from './interactor';

describe('FetchUserInteractor', () => {
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
  ])('指定されたIDのユーザーが返却される', async (context) => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
    );
    const repository = new UserRepositoryMock([user]);
    const interactor = new FetchUserInteractor(repository);

    // when
    const result = await interactor.handle(
      new UserSession(context, {
        User: DITokens.UserRepository,
      }),
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
    const repository = new UserRepositoryMock();
    const interactor = new FetchUserInteractor(repository);

    // when
    // then
    await expect(
      interactor.handle(
        new UserSession(null, {
          User: DITokens.UserRepository,
        }),
        new Id('id'),
      ),
    ).rejects.toThrow();
    expect(repository.calledMethods).toHaveLength(1);
    expect(repository.calledMethods[0].method).toBe('find');
  });
});
