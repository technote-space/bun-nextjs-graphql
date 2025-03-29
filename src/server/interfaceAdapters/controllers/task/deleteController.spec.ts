import { describe, expect, test } from 'bun:test';
import { User } from '#/domains/entities/user';
import { Name as UserName } from '#/domains/entities/user/valueObjects';
import { UserSessionProviderMock } from '#/interfaceAdapters/controllers/shared/userSessionProvider.mock';
import { HandleErrorInteractor } from '#/usecases/handleError/interactor';
import { HandleErrorPresenterMock } from '#/usecases/handleError/presenter.mock';
import { DeleteTaskUseCaseMock } from '#/usecases/task/delete/usecase.mock';
import type { TaskOutputDto } from '#/usecases/task/dto';
import { TaskPresenterMock } from '#/usecases/task/presenter.mock';
import { DeleteTaskController } from './deleteController';

describe('DeleteTaskController', () => {
  test('コントローラーの呼び出しに成功する', async () => {
    // given
    const user = User.create(new UserName('test'));
    const sessionProvider = new UserSessionProviderMock({ user });
    const useCase = new DeleteTaskUseCaseMock(null);
    const presenter = new TaskPresenterMock();
    const handleErrorUseCase = new HandleErrorInteractor([]);
    const handleErrorPresenter = new HandleErrorPresenterMock();
    const controller = new DeleteTaskController<TaskOutputDto>(
      sessionProvider,
      useCase,
      presenter,
      handleErrorUseCase,
      handleErrorPresenter,
    );

    // when
    const result = await controller.invoke({
      id: 'task-id',
      token: 'token',
    });

    // then
    expect(result).toBeNull();
  });
});
