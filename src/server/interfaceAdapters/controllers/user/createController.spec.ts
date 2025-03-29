import { describe, expect, test } from 'bun:test';
import { User } from '#/domains/entities/user';
import { Name } from '#/domains/entities/user/valueObjects';
import { UserSessionProviderMock } from '#/interfaceAdapters/controllers/shared/userSessionProvider.mock';
import { HandleErrorInteractor } from '#/usecases/handleError/interactor';
import { HandleErrorPresenterMock } from '#/usecases/handleError/presenter.mock';
import { CreateUserUseCaseMock } from '#/usecases/user/create/usecase.mock';
import type { UserOutputDto } from '#/usecases/user/dto';
import { UserPresenterMock } from '#/usecases/user/presenter.mock';
import { CreateUserController } from './createController';

describe('CreateUserController', () => {
  test('コントローラーの呼び出しに成功する', async () => {
    // given
    const user = User.create(new Name('test'));
    const sessionProvider = new UserSessionProviderMock({ user });
    const useCase = new CreateUserUseCaseMock();
    const presenter = new UserPresenterMock();
    const handleErrorUseCase = new HandleErrorInteractor([]);
    const handleErrorPresenter = new HandleErrorPresenterMock();
    const controller = new CreateUserController<UserOutputDto>(
      sessionProvider,
      useCase,
      presenter,
      handleErrorUseCase,
      handleErrorPresenter,
    );

    // when
    const result = await controller.invoke({
      input: { name: 'test' },
      token: 'token',
    });

    // then
    expect(result?.name.value).toBe('test');
  });
});
