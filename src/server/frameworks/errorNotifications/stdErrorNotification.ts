import type { Notification } from '#/usecases/handleError/notification';

export class StdErrorNotification implements Notification {
  public async notify(error: unknown): Promise<void> {
    console.log(error);
  }
}
