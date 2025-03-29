import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { Id } from '#/domains/entities/user/valueObjects';
import { BaseController } from '#/interfaceAdapters/controllers/shared/baseController';
import type { UserSessionProvider } from '#/interfaceAdapters/controllers/shared/userSessionProvider';
import type { HandleErrorPresenter } from '#/usecases/handleError/presenter';
import type { HandleErrorUseCase } from '#/usecases/handleError/usecase';
import type { FetchUserUseCase } from '#/usecases/user/fetch/usecase';
import type { UserPresenter } from '#/usecases/user/presenter';

type InputData = {
  id: string;
  token?: string;
};

@singleton()
export class FetchUserController<Result> extends BaseController<
  InputData,
  Result
> {
  public constructor(
    @inject(DITokens.UserSessionProvider)
    private readonly sessionProvider: UserSessionProvider,
    @inject(DITokens.FetchUserUseCase)
    private readonly useCase: FetchUserUseCase,
    @inject(DITokens.UserPresenter)
    private readonly presenter: UserPresenter<Result>,
    @inject(DITokens.HandleErrorUseCase) handleErrorUseCase: HandleErrorUseCase,
    @inject(DITokens.HandleErrorUseCase)
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
