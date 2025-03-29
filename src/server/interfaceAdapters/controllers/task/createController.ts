import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { Description, Title } from '#/domains/entities/task/valueObjects';
import { BaseController } from '#/interfaceAdapters/controllers/shared/baseController';
import type { UserSessionProvider } from '#/interfaceAdapters/controllers/shared/userSessionProvider';
import type { HandleErrorPresenter } from '#/usecases/handleError/presenter';
import type { HandleErrorUseCase } from '#/usecases/handleError/usecase';
import type { CreateTaskUseCase } from '#/usecases/task/create/usecase';
import type { TaskPresenter } from '#/usecases/task/presenter';

type CreateTaskInput = {
  title: string;
  description: string;
};
type InputData = {
  input: CreateTaskInput;
  token?: string;
};

@singleton()
export class CreateTaskController<Result> extends BaseController<
  InputData,
  Result
> {
  public constructor(
    @inject(DITokens.UserSessionProvider)
    private readonly sessionProvider: UserSessionProvider,
    @inject(DITokens.CreateTaskUseCase)
    private readonly useCase: CreateTaskUseCase,
    @inject(DITokens.TaskPresenter)
    private readonly presenter: TaskPresenter<Result>,
    @inject(DITokens.HandleErrorUseCase) handleErrorUseCase: HandleErrorUseCase,
    @inject(DITokens.HandleErrorUseCase)
    handleErrorPresenter: HandleErrorPresenter<Result>,
  ) {
    super(handleErrorUseCase, handleErrorPresenter);
  }

  protected async execute({ input, token }: InputData): Promise<Result> {
    return this.presenter.entity(
      await this.useCase.handle(await this.sessionProvider.getSession(token), {
        title: new Title(input.title),
        description: new Description(input.description),
      }),
    );
  }
}
