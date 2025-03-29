import type { HandleErrorPresenter } from '#/usecases/handleError/presenter';
import type { HandleErrorUseCase } from '#/usecases/handleError/usecase';

export abstract class BaseController<InputData, Result> {
  protected constructor(
    private readonly handleErrorUseCase: HandleErrorUseCase,
    private readonly handleErrorPresenter: HandleErrorPresenter<Result | never>,
  ) {}

  protected abstract execute(input: InputData): Promise<Result>;

  public async invoke(input: InputData): Promise<Result> {
    return this.execute(input).catch(async (error) =>
      this.handleErrorPresenter.output(
        await this.handleErrorUseCase.handle(error),
      ),
    );
  }
}
