import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import {
  Role,
  UserEmail,
  UserName,
  type UserRole,
} from '#/domains/entities/user/valueObjects';
import { BaseController } from '#/interfaceAdapters/controllers/shared/baseController';
import type { UserSessionProvider } from '#/interfaceAdapters/controllers/shared/userSessionProvider';
import type { HandleErrorPresenter } from '#/usecases/handleError/presenter';
import type { HandleErrorUseCase } from '#/usecases/handleError/usecase';
import type { CreateUserUseCase } from '#/usecases/user/create/usecase';
import type { UserPresenter } from '#/usecases/user/presenter';

type CreateUserInput = {
  name: string;
  email: string;
  role: UserRole;
};
type InputData = {
  input: CreateUserInput;
  token?: string;
};

@singleton()
export class CreateUserController<Result> extends BaseController<
  InputData,
  Result
> {
  public constructor(
    @inject(DITokens.UserSessionProvider)
    private readonly sessionProvider: UserSessionProvider,
    @inject(DITokens.CreateUserUseCase)
    private readonly useCase: CreateUserUseCase,
    @inject(DITokens.UserPresenter)
    private readonly presenter: UserPresenter<Result>,
    @inject(DITokens.HandleErrorUseCase) handleErrorUseCase: HandleErrorUseCase,
    @inject(DITokens.HandleErrorPresenter)
    handleErrorPresenter: HandleErrorPresenter<Result>,
  ) {
    super(handleErrorUseCase, handleErrorPresenter);
  }

  protected async execute({ input, token }: InputData): Promise<Result> {
    return this.presenter.entity(
      await this.useCase.handle(await this.sessionProvider.getSession(token), {
        name: new UserName(input.name),
        email: new UserEmail(input.email),
        role: new Role(input.role),
      }),
    );
  }
}
