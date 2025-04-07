import { describe, expect, test } from 'bun:test';
import { User } from '#/domains/entities/user';
import { UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { Role } from '#/domains/entities/user/valueObjects';
import { UserSessionProviderMock } from '#/interfaceAdapters/controllers/shared/userSessionProvider.mock';
import { HandleErrorInteractor } from '#/usecases/handleError/interactor';
import { HandleErrorPresenterMock } from '#/usecases/handleError/presenter.mock';
import type { UserOutputDto } from '#/usecases/user/dto';
import { UserPresenterMock } from '#/usecases/user/presenter.mock';
import { UpdateUserUseCaseMock } from '#/usecases/user/update/usecase.mock';
import { UpdateUserController } from './updateController';

describe('UpdateUserController', () => {
  test('コントローラーの呼び出しに成功する', async () => {
    // given
    const user = User.create(
      new UserName('test'),
      new UserEmail('user@example.com'),
      new Role('ADMIN'),
    );
    const sessionProvider = new UserSessionProviderMock({ user });
    const useCase = new UpdateUserUseCaseMock(user);
    const presenter = new UserPresenterMock();
    const handleErrorUseCase = new HandleErrorInteractor([]);
    const handleErrorPresenter = new HandleErrorPresenterMock();
    const controller = new UpdateUserController<UserOutputDto>(
      sessionProvider,
      useCase,
      presenter,
      handleErrorUseCase,
      handleErrorPresenter,
    );

    // when
    const result = await controller.invoke({
      id: user.id.value,
      input: { name: 'updated name', email: 'updated@example.com' },
      token: 'token',
    });

    // then
    expect(result?.name.value).toBe('updated name');
    expect(result?.email.value).toBe('updated@example.com');
  });
});
