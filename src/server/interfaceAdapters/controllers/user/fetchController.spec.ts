import { describe, expect, test } from 'bun:test';
import { User } from '#/domains/entities/user';
import { UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { UserSessionProviderMock } from '#/interfaceAdapters/controllers/shared/userSessionProvider.mock';
import { HandleErrorInteractor } from '#/usecases/handleError/interactor';
import { HandleErrorPresenterMock } from '#/usecases/handleError/presenter.mock';
import type { UserOutputDto } from '#/usecases/user/dto';
import { FetchUserUseCaseMock } from '#/usecases/user/fetch/usecase.mock';
import { UserPresenterMock } from '#/usecases/user/presenter.mock';
import { FetchUserController } from './fetchController';

describe('FetchUserController', () => {
  test('コントローラーの呼び出しに成功する', async () => {
    // given
    const user = User.create(
      new UserName('test'),
      new UserEmail('user@example.com'),
    );
    const sessionProvider = new UserSessionProviderMock({ user });
    const useCase = new FetchUserUseCaseMock(user);
    const presenter = new UserPresenterMock();
    const handleErrorUseCase = new HandleErrorInteractor([]);
    const handleErrorPresenter = new HandleErrorPresenterMock();
    const controller = new FetchUserController<UserOutputDto>(
      sessionProvider,
      useCase,
      presenter,
      handleErrorUseCase,
      handleErrorPresenter,
    );

    // when
    const result = await controller.invoke({
      id: user.id.value,
      token: 'token',
    });

    // then
    expect(result?.name.value).toBe('test');
    expect(result?.email.value).toBe('user@example.com');
  });
});
