import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { BaseController } from '#/interfaceAdapters/controllers/shared/baseController';
import type { UserSessionProvider } from '#/interfaceAdapters/controllers/shared/userSessionProvider';
import type { HandleErrorPresenter } from '#/usecases/handleError/presenter';
import type { HandleErrorUseCase } from '#/usecases/handleError/usecase';
import type { PaginateUserParams } from '#/usecases/user/paginationQueryService/dto';
import type { UserQueryServicePresenter } from '#/usecases/user/paginationQueryService/presenter';
import type { UserPaginationQueryService } from '#/usecases/user/paginationQueryService/usecase';

type InputData = {
  params: PaginateUserParams;
  token?: string;
};

@singleton()
export class PaginateUserController<Result> extends BaseController<
  InputData,
  Result
> {
  public constructor(
    @inject(DITokens.UserSessionProvider)
    private readonly sessionProvider: UserSessionProvider,
    @inject(DITokens.PaginateUserQueryService)
    private readonly queryService: UserPaginationQueryService,
    @inject(DITokens.UserQueryServicePresenter)
    private readonly presenter: UserQueryServicePresenter,
    @inject(DITokens.HandleErrorUseCase) handleErrorUseCase: HandleErrorUseCase,
    @inject(DITokens.HandleErrorUseCase)
    handleErrorPresenter: HandleErrorPresenter<Result>,
  ) {
    super(handleErrorUseCase, handleErrorPresenter);
  }

  protected async execute({ params, token }: InputData): Promise<Result> {
    return this.presenter.paginate(
      await this.queryService.handle(
        await this.sessionProvider.getSession(token),
        params,
      ),
    );
  }
}
