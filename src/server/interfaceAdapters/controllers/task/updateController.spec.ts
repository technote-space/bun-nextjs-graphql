import { describe, expect, test } from 'bun:test';
import { Task } from '#/domains/entities/task';
import { Description, Title } from '#/domains/entities/task/valueObjects';
import { User } from '#/domains/entities/user';
import {
  Role,
  UserEmail,
  UserName,
} from '#/domains/entities/user/valueObjects';
import { UserSessionProviderMock } from '#/interfaceAdapters/controllers/shared/userSessionProvider.mock';
import { HandleErrorInteractor } from '#/usecases/handleError/interactor';
import { HandleErrorPresenterMock } from '#/usecases/handleError/presenter.mock';
import type { TaskOutputDto } from '#/usecases/task/dto';
import { TaskPresenterMock } from '#/usecases/task/presenter.mock';
import { UpdateTaskUseCaseMock } from '#/usecases/task/update/usecase.mock';
import { UpdateTaskController } from './updateController';

describe('UpdateTaskController', () => {
  test('コントローラーの呼び出しに成功する', async () => {
    // given
    const user = User.create(
      new UserName('test'),
      new UserEmail('user@example.com'),
      new Role('ADMIN'),
    );
    const task = Task.create(
      user.id,
      new Title('title'),
      new Description('description'),
    );
    const sessionProvider = new UserSessionProviderMock({ user });
    const useCase = new UpdateTaskUseCaseMock(task);
    const presenter = new TaskPresenterMock();
    const handleErrorUseCase = new HandleErrorInteractor([]);
    const handleErrorPresenter = new HandleErrorPresenterMock();
    const controller = new UpdateTaskController<TaskOutputDto>(
      sessionProvider,
      useCase,
      presenter,
      handleErrorUseCase,
      handleErrorPresenter,
    );

    // when
    const result = await controller.invoke({
      id: task.id.value,
      input: {
        title: 'updated title',
        description: 'updated description',
        expiredAt: new Date('2025-01-01T00:00:00.000Z'),
      },
      token: 'token',
    });

    // then
    expect(result?.title.value).toBe('updated title');
    expect(result?.description.value).toBe('updated description');
    expect(result?.expiredAt.value?.toISOString()).toBe(
      '2025-01-01T00:00:00.000Z',
    );
  });
});
