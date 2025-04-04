import { describe, expect, test } from 'bun:test';
import { Task } from '#/domains/entities/task';
import { Description, Title } from '#/domains/entities/task/valueObjects';
import { User } from '#/domains/entities/user';
import { UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { UserSessionProviderMock } from '#/interfaceAdapters/controllers/shared/userSessionProvider.mock';
import { HandleErrorInteractor } from '#/usecases/handleError/interactor';
import { HandleErrorPresenterMock } from '#/usecases/handleError/presenter.mock';
import type { TaskOutputDto } from '#/usecases/task/dto';
import { OnCompleteTaskUseCaseMock } from '#/usecases/task/onComplete/usecase.mock';
import { TaskPresenterMock } from '#/usecases/task/presenter.mock';
import { OnCompleteTaskController } from './onCompleteController';

describe('OnCompleteTaskController', () => {
  test('コントローラーの呼び出しに成功する', async () => {
    // given
    const user = User.create(
      new UserName('test'),
      new UserEmail('user@example.com'),
    );
    const task = Task.create(
      user.id,
      new Title('title'),
      new Description('description'),
    );
    const sessionProvider = new UserSessionProviderMock({ user });
    const useCase = new OnCompleteTaskUseCaseMock(task);
    const presenter = new TaskPresenterMock();
    const handleErrorUseCase = new HandleErrorInteractor([]);
    const handleErrorPresenter = new HandleErrorPresenterMock();
    const controller = new OnCompleteTaskController<TaskOutputDto>(
      sessionProvider,
      useCase,
      presenter,
      handleErrorUseCase,
      handleErrorPresenter,
    );

    // when
    const result = await controller.invoke({
      id: task.id.value,
      token: 'token',
    });

    // then
    expect(result?.completedAt.value).not.toBeNull();
  });
});
