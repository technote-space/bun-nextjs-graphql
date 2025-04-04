import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { Description, Id, Title } from '#/domains/entities/task/valueObjects';
import { BaseController } from '#/interfaceAdapters/controllers/shared/baseController';
import type { UserSessionProvider } from '#/interfaceAdapters/controllers/shared/userSessionProvider';
import { getUpdateValue } from '#/interfaceAdapters/controllers/shared/utils';
import type { HandleErrorPresenter } from '#/usecases/handleError/presenter';
import type { HandleErrorUseCase } from '#/usecases/handleError/usecase';
import type { TaskPresenter } from '#/usecases/task/presenter';
import type { UpdateTaskUseCase } from '#/usecases/task/update/usecase';

type UpdateTaskInput = {
  title?: string | null;
  description?: string | null;
};
type InputData = {
  id: string;
  input: UpdateTaskInput;
  token?: string;
};

@singleton()
export class UpdateTaskController<Result> extends BaseController<
  InputData,
  Result
> {
  public constructor(
    @inject(DITokens.UserSessionProvider)
    private readonly sessionProvider: UserSessionProvider,
    @inject(DITokens.UpdateTaskUseCase)
    private readonly useCase: UpdateTaskUseCase,
    @inject(DITokens.TaskPresenter)
    private readonly presenter: TaskPresenter<Result>,
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
          title: getUpdateValue(input.title ?? undefined, (v) => new Title(v)),
          description: getUpdateValue(
            input.description ?? undefined,
            (v) => new Description(v),
          ),
        },
      ),
    );
  }
}
