import { ManagementClient } from 'auth0';
import { jwtDecode } from 'jwt-decode';
import { singleton } from 'tsyringe';
import type {
  AuthorizedUser,
  CreateAuthorizedUserInput,
  SSOClient,
  UpdateAuthorizedUserInput,
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

  public async find(id: string): Promise<AuthorizedUser> {
    const user = await this.client.users.get({ id });

    // TODO: remove debug code
    console.log(user);

    if (user.status !== 200) {
      throw new BadRequest('ユーザーが見つかりません');
    }

    return {
      id,
      username: user.data.username,
      email: user.data.email,
    };
  }

  public async findByEmail(email: string): Promise<AuthorizedUser | null> {
    const users = await this.client.usersByEmail.getByEmail({ email });

    // TODO: remove debug code
    console.log(users);

    if (users.status !== 200 || !users.data.length) {
      throw new BadRequest('ユーザーが見つかりません');
    }

    return {
      id: users.data[0].id,
      username: users.data[0].username,
      email: users.data[0].email,
    };
  }

  public async create(
    input: CreateAuthorizedUserInput,
  ): Promise<AuthorizedUser> {
    const user = await this.client.users.create({
      email: input.email,
      username: input.username,
      connection: this.connection,
      email_verified: false,
    });

    // TODO: remove debug code
    console.log(user);

    if (user.status !== 200) {
      throw new BadRequest('ユーザーの作成に失敗しました');
    }

    return {
      id: user.data.user_id,
      username: user.data.username,
      email: user.data.email,
    };
  }

  public async update(
    id: string,
    input: UpdateAuthorizedUserInput,
  ): Promise<void> {
    const result = await this.client.users.update(
      { id },
      {
        email: input.email,
        username: input.username,
        connection: this.connection,
      },
    );

    // TODO: remove debug code
    console.log(result);

    if (result.status !== 200) {
      throw new BadRequest('ユーザーの更新に失敗しました');
    }
  }

  public async resetPassword(id: string, password: string): Promise<void> {
    const result = await this.client.users.update(
      { id },
      {
        password,
        connection: this.connection,
      },
    );

    // TODO: remove debug code
    console.log(result);

    if (result.status !== 200) {
      throw new BadRequest('ユーザーの更新に失敗しました');
    }
  }

  public async delete(id: string): Promise<void> {
    await this.client.users.delete({ id });
  }

  public async deleteAll(): Promise<void> {
    const users = await this.client.users.getAll();
    if (users.status !== 200 || !users.data.length) return;

    await Promise.all(users.data.map((user) => this.delete(user.user_id)));

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
