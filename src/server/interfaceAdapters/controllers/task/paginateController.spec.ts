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
import type { PaginateTaskOutput } from '#/usecases/task/paginationQueryService/dto';
import { TaskQueryServicePresenterMock } from '#/usecases/task/paginationQueryService/presenter.mock';
import { TaskPaginationQueryServiceMock } from '#/usecases/task/paginationQueryService/usecase.mock';
import { PaginateTaskController } from './paginateController';

describe('PaginateTaskController', () => {
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
    const queryService = new TaskPaginationQueryServiceMock({
      items: [task],
      pageInfo: {
        totalCount: 1,
        perPage: 20,
        totalPage: 1,
        currentPage: 1,
      },
      key: 'id',
    });
    const presenter = new TaskQueryServicePresenterMock();
    const handleErrorUseCase = new HandleErrorInteractor([]);
    const handleErrorPresenter = new HandleErrorPresenterMock();
    const controller = new PaginateTaskController<PaginateTaskOutput>(
      sessionProvider,
      queryService,
      presenter,
      handleErrorUseCase,
      handleErrorPresenter,
    );

    // when
    const result = await controller.invoke({
      params: { page: 1, perPage: 20, sortKey: 'id', sortOrder: 'asc' },
      token: 'token',
    });

    // then
    expect(result.items).toHaveLength(1);
    expect(result.key).toBe('id');
    expect(result.pageInfo).toEqual({
      totalCount: 1,
      perPage: 20,
      totalPage: 1,
      currentPage: 1,
    });
  });
});
