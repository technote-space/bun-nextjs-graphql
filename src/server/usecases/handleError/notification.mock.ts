import type { Notification } from './notification';

export class NotificationMock implements Notification {
  public constructor(private readonly callback: () => void) {}

  public async notify(): Promise<void> {
    this.callback();
  }
}
