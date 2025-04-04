import { ManagementClient } from 'auth0';
import { jwtDecode } from 'jwt-decode';
import { singleton } from 'tsyringe';
import type {
  AuthorizedUser,
  SSOClient,
  SaveAuthorizedUserInput,
} from '#/frameworks/sso/client';
import { BadRequest, Unauthorized } from '#/shared/exceptions';

export type Auth0Config = {
  readonly domain: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly connection: string;
};

@singleton()
export class Auth0SSOClient implements SSOClient {
  private readonly client: ManagementClient;
  private readonly connection: string;

  public constructor(config: Auth0Config) {
    this.client = new ManagementClient({
      domain: config.domain,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    });
    this.connection = config.connection;
  }

  public async find(id: string): Promise<AuthorizedUser | null> {
    const response = await this.client.users.get({ id });
    if (response.status !== 200) {
      return null;
    }

    return {
      id,
      email: response.data.email,
    };
  }

  public async findByEmail(email: string): Promise<AuthorizedUser | null> {
    const response = await this.client.usersByEmail.getByEmail({ email });
    if (response.status !== 200) {
      throw new BadRequest();
    }

    if (!response.data.length) {
      return null;
    }

    return {
      id: response.data[0].user_id,
      email: response.data[0].email,
    };
  }

  public async save(input: SaveAuthorizedUserInput): Promise<AuthorizedUser> {
    const user = await (input.id
      ? this.find(input.id)
      : this.findByEmail(input.email));
    if (!user) {
      const response = await this.client.users.create({
        email: input.email,
        password: input.password ?? 'Test1234',
        connection: this.connection,
        email_verified: false,
      });
      if (response.status !== 201) {
        throw new BadRequest('ユーザーの作成に失敗しました');
      }

      return {
        id: response.data.user_id,
        email: response.data.email,
      };
    }

    const response = await this.client.users.update(
      { id: user.id },
      {
        email: input.email,
        password: input.password,
        connection: this.connection,
      },
    );
    if (response.status !== 200) {
      throw new BadRequest('ユーザーの更新に失敗しました');
    }

    return {
      id: response.data.user_id,
      email: response.data.email,
    };
  }

  public async resetPassword(id: string, password: string): Promise<void> {
    const response = await this.client.users.update(
      { id },
      {
        password,
        connection: this.connection,
      },
    );
    if (response.status !== 200) {
      throw new BadRequest('ユーザーの更新に失敗しました');
    }
  }

  public async delete(id: string): Promise<void> {
    await this.client.users.delete({ id });
  }

  public async deleteAll(): Promise<void> {
    const response = await this.client.users.getAll();
    if (response.status !== 200 || !response.data.length) return;

    await Promise.all(response.data.map((user) => this.delete(user.user_id)));

    return this.deleteAll();
  }

  public async getJwtPayload(token: string): Promise<{ sub: string }> {
    try {
      return jwtDecode(token) as { sub: string };
    } catch (e) {
      console.error(e);
      throw new Unauthorized();
    }
  }
}
