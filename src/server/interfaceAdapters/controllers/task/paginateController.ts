import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { BaseController } from '#/interfaceAdapters/controllers/shared/baseController';
import type { UserSessionProvider } from '#/interfaceAdapters/controllers/shared/userSessionProvider';
import type { HandleErrorPresenter } from '#/usecases/handleError/presenter';
import type { HandleErrorUseCase } from '#/usecases/handleError/usecase';
import type { PaginateTaskParams } from '#/usecases/task/paginationQueryService/dto';
import type { TaskQueryServicePresenter } from '#/usecases/task/paginationQueryService/presenter';
import type { TaskPaginationQueryService } from '#/usecases/task/paginationQueryService/usecase';

type InputData = {
  params: PaginateTaskParams;
  token?: string;
};

@singleton()
export class PaginateTaskController<Result> extends BaseController<
  InputData,
  Result
> {
  public constructor(
    @inject(DITokens.UserSessionProvider)
    private readonly sessionProvider: UserSessionProvider,
    @inject(DITokens.PaginateTaskQueryService)
    private readonly queryService: TaskPaginationQueryService,
    @inject(DITokens.TaskPresenter)
    private readonly presenter: TaskQueryServicePresenter,
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
