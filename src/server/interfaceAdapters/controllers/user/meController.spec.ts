import { describe, expect, test } from 'bun:test';
import { User } from '#/domains/entities/user';
import { UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { UserSessionProviderMock } from '#/interfaceAdapters/controllers/shared/userSessionProvider.mock';
import { HandleErrorInteractor } from '#/usecases/handleError/interactor';
import { HandleErrorPresenterMock } from '#/usecases/handleError/presenter.mock';
import type { UserOutputDto } from '#/usecases/user/dto';
import { FetchMeUseCaseMock } from '#/usecases/user/me/usecase.mock';
import { UserPresenterMock } from '#/usecases/user/presenter.mock';
import { FetchMeController } from './meController';

describe('FetchMeController', () => {
  test('コントローラーの呼び出しに成功する', async () => {
    // given
    const user = User.create(
      new UserName('test'),
      new UserEmail('user@example.com'),
    );
    const sessionProvider = new UserSessionProviderMock({ user });
    const useCase = new FetchMeUseCaseMock(user);
    const presenter = new UserPresenterMock();
    const handleErrorUseCase = new HandleErrorInteractor([]);
    const handleErrorPresenter = new HandleErrorPresenterMock();
    const controller = new FetchMeController<UserOutputDto>(
      sessionProvider,
      useCase,
      presenter,
      handleErrorUseCase,
      handleErrorPresenter,
    );

    // when
    const result = await controller.invoke({
      token: 'token',
    });

    // then
    expect(result?.name.value).toBe('test');
    expect(result?.email.value).toBe('user@example.com');
  });
});
