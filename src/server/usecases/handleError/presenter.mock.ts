import type { HandleErrorPresenter } from './presenter';

// biome-ignore lint/suspicious/noExplicitAny:
export class HandleErrorPresenterMock implements HandleErrorPresenter<any> {
  // biome-ignore lint/suspicious/noExplicitAny:
  public output(error: any): any {
    return error;
  }
}
