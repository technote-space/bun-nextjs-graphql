import {
  UserSession,
  type UserSessionContext,
} from '#/usecases/shared/session/userSession';
import type { UserSessionProvider } from './userSessionProvider';

export class UserSessionProviderMock implements UserSessionProvider {
  public constructor(
    private readonly context: UserSessionContext | null = null,
  ) {}

  public async getSession(token?: string): Promise<UserSession> {
    if (!token) {
      return new UserSession(null, {});
    }

    return new UserSession(this.context, {});
  }
}
