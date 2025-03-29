import { describe, expect, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { User } from '#/domains/entities/user';
import { Name } from '#/domains/entities/user/valueObjects';
import { UserRepositoryMock } from '#/domains/repositories/userRepository.mock';
import { UserSession } from '#/usecases/shared/session/userSession';
import { CreateUserInteractor } from './interactor';

describe('CreateUserInteractor', () => {
  test('ログインユーザーはユーザーを作成可能', async () => {
    // given
    const repository = new UserRepositoryMock();
    const interactor = new CreateUserInteractor(repository);

    // when
    const result = await interactor.handle(
      new UserSession(
        { user: User.create(new Name('test')) },
        {
          User: DITokens.UserRepository,
        },
      ),
      { name: new Name('name') },
    );

    // then
    expect(result.name.value).toBe('name');

    expect(repository.calledMethods).toHaveLength(1);
    expect(repository.calledMethods[0].method).toBe('create');
  });

  test('未ログインの場合、エラーが発生する', async () => {
    // given
    const repository = new UserRepositoryMock();
    const interactor = new CreateUserInteractor(repository);

    // when
    // then
    await expect(
      interactor.handle(
        new UserSession(null, {
          User: DITokens.UserRepository,
        }),
        { name: new Name('name') },
      ),
    ).rejects.toThrow();
    expect(repository.calledMethods).toHaveLength(0);
  });
});
