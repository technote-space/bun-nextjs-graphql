import type { HandleErrorPresenter } from '#/usecases/handleError/presenter';
import type { HandleErrorUseCase } from '#/usecases/handleError/usecase';

export abstract class BaseController<InputData, Result> {
  protected constructor(
    private readonly useCase: HandleErrorUseCase,
    private readonly presenter: HandleErrorPresenter<Result | never>,
  ) {}

  protected abstract execute(input: InputData): Promise<Result>;

  public async invoke(input: InputData): Promise<Result> {
    try {
      return await this.execute(input);
    } catch (error) {
      return this.presenter.output(await this.useCase.handle(error));
    }
  }
}
