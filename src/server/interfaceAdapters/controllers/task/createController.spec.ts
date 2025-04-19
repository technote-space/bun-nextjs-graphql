import { describe, expect, test } from 'bun:test';
import { User } from '#/domains/entities/user';
import { UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { Role } from '#/domains/entities/user/valueObjects';
import { UserSessionProviderMock } from '#/interfaceAdapters/controllers/shared/userSessionProvider.mock';
import { HandleErrorInteractor } from '#/usecases/handleError/interactor';
import { HandleErrorPresenterMock } from '#/usecases/handleError/presenter.mock';
import { CreateTaskUseCaseMock } from '#/usecases/task/create/usecase.mock';
import type { TaskOutputDto } from '#/usecases/task/dto';
import { TaskPresenterMock } from '#/usecases/task/presenter.mock';
import { CreateTaskController } from './createController';

describe('CreateTaskController', () => {
  test('コントローラーの呼び出しに成功する', async () => {
    // given
    const user = User.create(
      new UserName('test'),
      new UserEmail('user@example.com'),
      new Role('ADMIN'),
    );
    const sessionProvider = new UserSessionProviderMock({ user });
    const useCase = new CreateTaskUseCaseMock();
    const presenter = new TaskPresenterMock();
    const handleErrorUseCase = new HandleErrorInteractor([]);
    const handleErrorPresenter = new HandleErrorPresenterMock();
    const controller = new CreateTaskController<TaskOutputDto>(
      sessionProvider,
      useCase,
      presenter,
      handleErrorUseCase,
      handleErrorPresenter,
    );

    // when
    const result = await controller.invoke({
      input: { title: 'title', description: 'description' },
      token: 'token',
    });

    // then
    expect(result?.title.value).toBe('title');
    expect(result?.description.value).toBe('description');
  });

  test('expiredAtを指定してコントローラーの呼び出しに成功する', async () => {
    // given
    const user = User.create(
      new UserName('test'),
      new UserEmail('user@example.com'),
      new Role('ADMIN'),
    );
    const sessionProvider = new UserSessionProviderMock({ user });
    const useCase = new CreateTaskUseCaseMock();
    const presenter = new TaskPresenterMock();
    const handleErrorUseCase = new HandleErrorInteractor([]);
    const handleErrorPresenter = new HandleErrorPresenterMock();
    const controller = new CreateTaskController<TaskOutputDto>(
      sessionProvider,
      useCase,
      presenter,
      handleErrorUseCase,
      handleErrorPresenter,
    );

    // when
    const result = await controller.invoke({
      input: {
        title: 'title',
        description: 'description',
        expiredAt: new Date('2025-01-01T00:00:00.000Z'),
      },
      token: 'token',
    });

    // then
    expect(result?.title.value).toBe('title');
    expect(result?.description.value).toBe('description');
    expect(result?.expiredAt.value?.toISOString()).toBe(
      '2025-01-01T00:00:00.000Z',
    );
  });
});
