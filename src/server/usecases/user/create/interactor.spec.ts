import { describe, expect, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { User } from '#/domains/entities/user';
import { UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { Role } from '#/domains/entities/user/valueObjects';
import { UserRepositoryMock } from '#/domains/repositories/userRepository.mock';
import { UserSession } from '#/usecases/shared/session/userSession';
import { CreateUserInteractor } from './interactor';

describe('CreateUserInteractor', () => {
  test('管理者ユーザーはユーザーを作成可能', async () => {
    // given
    const repository = new UserRepositoryMock();
    const interactor = new CreateUserInteractor(repository);

    // when
    const result = await interactor.handle(
      new UserSession(
        {
          user: User.create(
            new UserName('test'),
            new UserEmail('test@example.com'),
            new Role('ADMIN'),
          ),
        },
        {
          User: DITokens.UserPolicy,
        },
      ),
      {
        name: new UserName('name'),
        email: new UserEmail('user@example.com'),
        role: new Role('EDITOR'),
      },
    );

    // then
    expect(result.name.value).toBe('name');
    expect(result.email.value).toBe('user@example.com');
    expect(result.role.value).toBe('EDITOR');

    expect(repository.calledMethods).toHaveLength(1);
    expect(repository.calledMethods[0].method).toBe('save');
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
    const repository = new UserRepositoryMock();
    const interactor = new CreateUserInteractor(repository);

    // when
    // then
    await expect(
      interactor.handle(
        new UserSession(context, {
          User: DITokens.UserPolicy,
        }),
        {
          name: new UserName('name'),
          email: new UserEmail('user@example.com'),
          role: new Role('EDITOR'),
        },
      ),
    ).rejects.toThrow();
    expect(repository.calledMethods).toHaveLength(0);
  });
});
