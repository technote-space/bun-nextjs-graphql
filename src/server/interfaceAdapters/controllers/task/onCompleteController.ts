import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { Id } from '#/domains/entities/task/valueObjects';
import { BaseController } from '#/interfaceAdapters/controllers/shared/baseController';
import type { UserSessionProvider } from '#/interfaceAdapters/controllers/shared/userSessionProvider';
import type { HandleErrorPresenter } from '#/usecases/handleError/presenter';
import type { HandleErrorUseCase } from '#/usecases/handleError/usecase';
import type { OnCompleteTaskUseCase } from '#/usecases/task/onComplete/usecase';
import type { TaskPresenter } from '#/usecases/task/presenter';

type InputData = {
  id: string;
  token?: string;
};

@singleton()
export class OnCompleteTaskController<Result> extends BaseController<
  InputData,
  Result
> {
  public constructor(
    @inject(DITokens.UserSessionProvider)
    private readonly sessionProvider: UserSessionProvider,
    @inject(DITokens.OnCompleteTaskUseCase)
    private readonly useCase: OnCompleteTaskUseCase,
    @inject(DITokens.TaskPresenter)
    private readonly presenter: TaskPresenter<Result>,
    @inject(DITokens.HandleErrorUseCase) handleErrorUseCase: HandleErrorUseCase,
    @inject(DITokens.HandleErrorPresenter)
    handleErrorPresenter: HandleErrorPresenter<Result>,
  ) {
    super(handleErrorUseCase, handleErrorPresenter);
  }

  protected async execute({ id, token }: InputData): Promise<Result> {
    return this.presenter.entity(
      await this.useCase.handle(
        await this.sessionProvider.getSession(token),
        new Id(id),
      ),
    );
  }
}
