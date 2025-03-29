export type AuthorizedUser = Readonly<{
  id: string;
  username: string;
  email: string;
}>;

export type CreateAuthorizedUserInput = Readonly<{
  username: string;
  email: string;
}>;

export type UpdateAuthorizedUserInput = Partial<CreateAuthorizedUserInput>;

export interface SSOClient {
  find(id: string): Promise<AuthorizedUser>;

  findByEmail(email: string): Promise<AuthorizedUser | null>;

  create(input: CreateAuthorizedUserInput): Promise<AuthorizedUser>;

  update(id: string, input: UpdateAuthorizedUserInput): Promise<void>;

  resetPassword(id: string, password: string): Promise<void>;

  delete(id: string): Promise<void>;

  deleteAll(): Promise<void>;

  getJwtPayload(token: string): Promise<{ sub: string }>;
}
