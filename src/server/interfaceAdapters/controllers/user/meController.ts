import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { BaseController } from '#/interfaceAdapters/controllers/shared/baseController';
import type { UserSessionProvider } from '#/interfaceAdapters/controllers/shared/userSessionProvider';
import type { HandleErrorPresenter } from '#/usecases/handleError/presenter';
import type { HandleErrorUseCase } from '#/usecases/handleError/usecase';
import type { FetchMeUseCase } from '#/usecases/user/me/usecase';
import type { UserPresenter } from '#/usecases/user/presenter';

type InputData = {
  token?: string;
};

@singleton()
export class FetchMeController<Result> extends BaseController<
  InputData,
  Result
> {
  public constructor(
    @inject(DITokens.UserSessionProvider)
    private readonly sessionProvider: UserSessionProvider,
    @inject(DITokens.FetchMeUseCase)
    private readonly useCase: FetchMeUseCase,
    @inject(DITokens.UserPresenter)
    private readonly presenter: UserPresenter<Result>,
    @inject(DITokens.HandleErrorUseCase) handleErrorUseCase: HandleErrorUseCase,
    @inject(DITokens.HandleErrorPresenter)
    handleErrorPresenter: HandleErrorPresenter<Result>,
  ) {
    super(handleErrorUseCase, handleErrorPresenter);
  }

  protected async execute({ token }: InputData): Promise<Result> {
    return this.presenter.entity(
      await this.useCase.handle(await this.sessionProvider.getSession(token)),
    );
  }
}
