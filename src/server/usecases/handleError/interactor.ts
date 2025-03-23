import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import type { Notification } from './notification';
import type { HandleErrorUseCase } from './usecase';

@singleton()
export class HandleErrorInteractor implements HandleErrorUseCase {
  public constructor(
    @inject(DITokens.HandleErrorNotifications)
    private readonly notifications: Notification[],
  ) {}

  // biome-ignore lint/suspicious/noExplicitAny:
  public async handle(error: unknown): Promise<any> {
    try {
      await Promise.all(
        this.notifications.map((notification) => notification.notify(error)),
      );
    } catch {}

    return error;
  }
}
