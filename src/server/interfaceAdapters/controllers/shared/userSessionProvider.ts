import type { UserSession } from '#/usecases/shared/session/userSession';

export interface UserSessionProvider {
  getSession(token?: string): Promise<UserSession>;
}
