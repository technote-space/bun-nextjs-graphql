import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import {
  Id,
  UserEmail,
  UserName,
  type UserRole,
} from '#/domains/entities/user/valueObjects';
import { BaseController } from '#/interfaceAdapters/controllers/shared/baseController';
import type { UserSessionProvider } from '#/interfaceAdapters/controllers/shared/userSessionProvider';
import { getUpdateValue } from '#/interfaceAdapters/controllers/shared/utils';
import type { HandleErrorPresenter } from '#/usecases/handleError/presenter';
import type { HandleErrorUseCase } from '#/usecases/handleError/usecase';
import type { UserPresenter } from '#/usecases/user/presenter';
import type { UpdateUserUseCase } from '#/usecases/user/update/usecase';

type UpdateUserInput = {
  name?: string | null;
  email?: string | null;
  role?: UserRole | null;
};
type InputData = {
  id: string;
  input: UpdateUserInput;
  token?: string;
};

@singleton()
export class UpdateUserController<Result> extends BaseController<
  InputData,
  Result
> {
  public constructor(
    @inject(DITokens.UserSessionProvider)
    private readonly sessionProvider: UserSessionProvider,
    @inject(DITokens.UpdateUserUseCase)
    private readonly useCase: UpdateUserUseCase,
    @inject(DITokens.UserPresenter)
    private readonly presenter: UserPresenter<Result>,
    @inject(DITokens.HandleErrorUseCase) handleErrorUseCase: HandleErrorUseCase,
    @inject(DITokens.HandleErrorPresenter)
    handleErrorPresenter: HandleErrorPresenter<Result>,
  ) {
    super(handleErrorUseCase, handleErrorPresenter);
  }

  protected async execute({ id, input, token }: InputData): Promise<Result> {
    return this.presenter.entity(
      await this.useCase.handle(
        await this.sessionProvider.getSession(token),
        new Id(id),
        {
          name: getUpdateValue(input.name ?? undefined, (v) => new UserName(v)),
          email: getUpdateValue(
            input.email ?? undefined,
            (v) => new UserEmail(v),
          ),
        },
      ),
    );
  }
}
