import { describe, expect, test } from 'bun:test';
import { Task } from '#/domains/entities/task';
import { Description, Title } from '#/domains/entities/task/valueObjects';
import { User } from '#/domains/entities/user';
import { UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { UserSessionProviderMock } from '#/interfaceAdapters/controllers/shared/userSessionProvider.mock';
import { HandleErrorInteractor } from '#/usecases/handleError/interactor';
import { HandleErrorPresenterMock } from '#/usecases/handleError/presenter.mock';
import type { TaskOutputDto } from '#/usecases/task/dto';
import { FetchTaskUseCaseMock } from '#/usecases/task/fetch/usecase.mock';
import { TaskPresenterMock } from '#/usecases/task/presenter.mock';
import { FetchTaskController } from './fetchController';

describe('FetchTaskController', () => {
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
    const useCase = new FetchTaskUseCaseMock(task);
    const presenter = new TaskPresenterMock();
    const handleErrorUseCase = new HandleErrorInteractor([]);
    const handleErrorPresenter = new HandleErrorPresenterMock();
    const controller = new FetchTaskController<TaskOutputDto>(
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
    expect(result?.title.value).toBe('title');
    expect(result?.description.value).toBe('description');
  });
});
