import type { HandleErrorPresenter } from './presenter';

export class HandleErrorPresenterMock<T> implements HandleErrorPresenter<T> {
  // biome-ignore lint/suspicious/noExplicitAny:
  public output(error: any): T {
    return error;
  }
}
