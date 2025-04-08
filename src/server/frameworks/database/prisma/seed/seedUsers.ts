import { container } from 'tsyringe';
import { DITokens } from '#/config/constants';
import users from '#/config/users';
import { User } from '#/domains/entities/user';
import {
  CreatedAt,
  Id,
  Role,
  SsoId,
  UpdatedAt,
  UserEmail,
  UserName,
} from '#/domains/entities/user/valueObjects';
import type { UserRepository } from '#/domains/repositories/userRepository';
import type { Client } from '#/frameworks/database/repository';
import type { SSOClient } from '#/frameworks/sso/client';

const getSsoId = async (
  ssoClient: SSOClient,
  u: (typeof users)[number],
): Promise<string> => {
  const user = await ssoClient.findByEmail(u.email);
  if (!user) {
    const user = await ssoClient.save({
      email: u.email,
      password: u.password,
    });
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
  const ssoId = await getSsoId(ssoClient, u);
  const user =
    (await repository.findBySsoId(client, new SsoId(ssoId))) ??
    User.reconstruct(
      new Id(undefined),
      new SsoId(ssoId),
      new UserName(u.name),
      new UserEmail(u.email),
      new Role(u.role),
      new CreatedAt(undefined),
      new UpdatedAt(undefined),
    );
  await repository.save(
    client,
    user.update({
      name: new UserName(u.name),
      email: new UserEmail(u.email),
      role: new Role(u.role),
    }),
  );
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
