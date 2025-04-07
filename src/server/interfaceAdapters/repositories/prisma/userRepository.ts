import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
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
import type {
  PrismaClient,
  User as PrismaUser,
  TransactionPrismaClient,
} from '#/frameworks/database/prisma';
import type { AuthorizedUser, SSOClient } from '#/frameworks/sso/client';
import { PrismaSharedRepository } from '#/interfaceAdapters/repositories/prisma/sharedRepository';
import { BadRequest } from '#/shared/exceptions';
import { transform } from '#/shared/utils';

@singleton()
export class PrismaUserRepository
  extends PrismaSharedRepository<PrismaUser, User, 'User'>
  implements UserRepository<TransactionPrismaClient>
{
  public constructor(
    @inject(DITokens.PrismaClient) _prisma: PrismaClient,
    @inject(DITokens.SSOClient) private readonly ssoClient: SSOClient,
  ) {
    super(_prisma);
  }

  private async findSsoUser(ssoId: string): Promise<AuthorizedUser> {
    const ssoUser = await this.ssoClient.find(ssoId);
    if (!ssoUser) {
      throw new BadRequest('ユーザーが見つかりません');
    }

    return ssoUser;
  }

  public async toEntity(user: PrismaUser): Promise<User> {
    const ssoUser = await this.findSsoUser(user.ssoId);
    return User.reconstruct(
      new Id(user.id),
      new SsoId(user.ssoId),
      new UserName(user.name),
      new UserEmail(ssoUser.email),
      new Role(user.role),
      new CreatedAt(user.createdAt),
      new UpdatedAt(user.updatedAt),
    );
  }

  protected async getUpsertParams(user: User) {
    const ssoUser = await this.ssoClient.save({
      id: user.ssoId.value ?? undefined,
      email: user.email.value,
    });

    return {
      name: user.name.value,
      ssoId: ssoUser.id,
      role: user.role.value,
    };
  }

  protected get model(): Lowercase<'User'> {
    return 'user';
  }

  public async findBySsoId(
    client: TransactionPrismaClient,
    ssoId: SsoId,
  ): Promise<User | null> {
    return transform(
      ssoId.value
        ? await client.user.findFirst({ where: { ssoId: ssoId.value } })
        : null,
      this.toEntity.bind(this),
    );
  }
}
