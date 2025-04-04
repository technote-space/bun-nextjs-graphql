export type AuthorizedUser = Readonly<{
  id: string;
  email: string;
}>;

export type SaveAuthorizedUserInput = Readonly<{
  id?: string;
  email: string;
  password?: string;
}>;

export interface SSOClient {
  find(id: string): Promise<AuthorizedUser | null>;

  findByEmail(email: string): Promise<AuthorizedUser | null>;

  save(input: SaveAuthorizedUserInput): Promise<AuthorizedUser>;

  resetPassword(id: string, password: string): Promise<void>;

  delete(id: string): Promise<void>;

  deleteAll(): Promise<void>;

  getJwtPayload(token: string): Promise<{ sub: string }>;
}
