import { Unauthorized } from '#/shared/exceptions';
import { Mock } from '#/shared/test/mock';
import type {
  AuthorizedUser,
  SSOClient,
  SaveAuthorizedUserInput,
} from './client';

export class SSOClientMock extends Mock implements SSOClient {
  public constructor(public users: AuthorizedUser[]) {
    super();
  }

  public async find(id: string): Promise<AuthorizedUser | null> {
    this.methodCalled('find', [id]);
    return this.users.find((u) => u.id === id) ?? null;
  }

  public async findByEmail(email: string): Promise<AuthorizedUser | null> {
    this.methodCalled('findByEmail', [email]);
    return this.users.find((u) => u.email === email) ?? null;
  }

  public async save(input: SaveAuthorizedUserInput): Promise<AuthorizedUser> {
    this.methodCalled('save', [input]);
    const user = this.users.find((u) => u.id === input.id);
    if (!user) {
      const user = {
        id: input.email,
        email: input.email,
      };
      this.users.push(user);
      return user;
    }

    this.users = this.users.filter((u) => u.id !== input.id);
    const updated = {
      ...user,
      email: input.email,
    };
    this.users.push(updated);
    return updated;
  }

  public async resetPassword(id: string, password: string): Promise<void> {
    this.methodCalled('resetPassword', [id, password]);
  }

  public async delete(id: string): Promise<void> {
    this.methodCalled('delete', [id]);
    this.users = this.users.filter((u) => u.id === id);
  }

  public async deleteAll(): Promise<void> {
    this.methodCalled('deleteAll');
    this.users = [];
  }

  public async getJwtPayload(token: string): Promise<{ sub: string }> {
    this.methodCalled('getJwtPayload', [token]);
    if (await this.find(token)) {
      return { sub: token };
    }

    throw new Unauthorized();
  }
}
