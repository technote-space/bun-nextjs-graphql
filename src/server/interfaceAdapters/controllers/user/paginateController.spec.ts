import { describe, expect, test } from 'bun:test';
import { User } from '#/domains/entities/user';
import { UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { UserSessionProviderMock } from '#/interfaceAdapters/controllers/shared/userSessionProvider.mock';
import { HandleErrorInteractor } from '#/usecases/handleError/interactor';
import { HandleErrorPresenterMock } from '#/usecases/handleError/presenter.mock';
import type { PaginateUserOutput } from '#/usecases/user/paginationQueryService/dto';
import { UserQueryServicePresenterMock } from '#/usecases/user/paginationQueryService/presenter.mock';
import { UserPaginationQueryServiceMock } from '#/usecases/user/paginationQueryService/usecase.mock';
import { PaginateUserController } from './paginateController';

describe('PaginateUserController', () => {
  test('コントローラーの呼び出しに成功する', async () => {
    // given
    const user = User.create(
      new UserName('test'),
      new UserEmail('user@example.com'),
    );
    const sessionProvider = new UserSessionProviderMock({ user });
    const queryService = new UserPaginationQueryServiceMock({
      items: [user],
      pageInfo: {
        totalCount: 1,
        perPage: 20,
        totalPage: 1,
        currentPage: 1,
      },
      key: 'id',
    });
    const presenter = new UserQueryServicePresenterMock();
    const handleErrorUseCase = new HandleErrorInteractor([]);
    const handleErrorPresenter = new HandleErrorPresenterMock();
    const controller = new PaginateUserController<PaginateUserOutput>(
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
