import { describe, expect, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { User } from '#/domains/entities/user';
import { UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { UserSession } from '#/usecases/shared/session/userSession';
import { FetchMeInteractor } from './interactor';

describe('FetchMeInteractor', () => {
  test('自身の情報が返却される', async () => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
    );
    const interactor = new FetchMeInteractor();

    // when
    const result = await interactor.handle(
      new UserSession(
        { user },
        {
          User: DITokens.UserRepository,
        },
      ),
    );

    // then
    expect(result.name.value).toBe('name');
    expect(result.email.value).toBe('user@example.com');
  });

  test('見ログインの場合、エラーが発生する', async () => {
    // given
    const interactor = new FetchMeInteractor();

    // when
    // then
    await expect(
      interactor.handle(
        new UserSession(null, {
          User: DITokens.UserRepository,
        }),
      ),
    ).rejects.toThrow();
  });
});
