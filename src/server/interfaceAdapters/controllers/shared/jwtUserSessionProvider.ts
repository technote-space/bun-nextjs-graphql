import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { Id } from '#/domains/entities/user/valueObjects';
import type { UserRepository } from '#/domains/repositories/userRepository';
import type { SSOClient } from '#/frameworks/sso/client';
import { UserSession } from '#/usecases/shared/session/userSession';
import type { UserSessionProvider } from './userSessionProvider';

@singleton()
export class JwtUserSessionProvider implements UserSessionProvider {
  public constructor(
    @inject(DITokens.UserRepository)
    private readonly repository: UserRepository,
    @inject(DITokens.SSOClient) private readonly client: SSOClient,
    @inject(DITokens.Policies)
    private readonly policies: Record<string, string>,
  ) {}

  public async getSession(token?: string): Promise<UserSession> {
    if (!token) {
      return new UserSession(null, this.policies);
    }

    const payload = await this.client.getJwtPayload(token);
    const user = await this.repository.transaction(async (client) =>
      this.repository.find(client, new Id(payload.sub)),
    );
    if (!user) {
      throw new UserSession(null, this.policies);
    }

    return new UserSession({ user }, this.policies);
  }
}
