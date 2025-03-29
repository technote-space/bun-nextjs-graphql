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
    return new UserSession(token ? this.context : null, {});
  }
}
