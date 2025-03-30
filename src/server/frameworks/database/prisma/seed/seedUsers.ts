import { container } from 'tsyringe';
import { DITokens } from '#/config/constants';
import users from '#/config/users';
import { User } from '#/domains/entities/user';
import {
  CreatedAt,
  Id,
  Name,
  UpdatedAt,
} from '#/domains/entities/user/valueObjects';
import type { UserRepository } from '#/domains/repositories/userRepository';
import type { Client } from '#/frameworks/database/repository';
import type { SSOClient } from '#/frameworks/sso/client';

const getUserId = async (
  ssoClient: SSOClient,
  u: (typeof users)[number],
): Promise<string> => {
  const user = await ssoClient.findByEmail(u.email);
  if (!user) {
    const user = await ssoClient.create({
      username: u.username,
      email: u.email,
    });
    await ssoClient.resetPassword(user.id, u.password);
    return user.id;
  }

  return user.id;
};

const findOrCreateUser = async (
  client: Client,
  repository: UserRepository,
  ssoClient: SSOClient,
  u: (typeof users)[number],
) => {
  const id = await getUserId(ssoClient, u);
  const user =
    (await repository.find(client, new Id(id))) ??
    User.reconstruct(
      new Id(id),
      new Name(u.name),
      new CreatedAt(undefined),
      new UpdatedAt(undefined),
    );
  await repository.save(client, user.update({ name: new Name(u.name) }));
};

export const seedUsers = async () => {
  const repository = container.resolve<UserRepository>(DITokens.UserRepository);
  const ssoClient = container.resolve<SSOClient>(DITokens.SSOClient);
  await repository.transaction(async (client) => {
    await users.reduce(async (prev, u) => {
      await prev;
      await findOrCreateUser(client, repository, ssoClient, u);
    }, Promise.resolve());
  });
};
