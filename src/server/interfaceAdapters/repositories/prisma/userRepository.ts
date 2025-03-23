import { singleton } from 'tsyringe';
import { User } from '#/domains/entities/user';
import {
  CreatedAt,
  Id,
  Name,
  UpdatedAt,
} from '#/domains/entities/user/valueObjects';
import type { UserRepository } from '#/domains/repositories/userRepository';
import type {
  User as PrismaUser,
  TransactionPrismaClient,
} from '#/frameworks/database/prisma';
import { PrismaSharedRepository } from '#/interfaceAdapters/repositories/prisma/sharedRepository';

@singleton()
export class PrismaUserRepository
  extends PrismaSharedRepository<PrismaUser, User, 'User'>
  implements UserRepository<TransactionPrismaClient>
{
  public toEntity(user: PrismaUser): User {
    return User.reconstruct(
      new Id(user.id),
      new Name(user.name),
      new CreatedAt(user.createdAt),
      new UpdatedAt(user.updatedAt),
    );
  }

  protected getUpsertParams(user: User) {
    return {
      name: user.name.value,
    };
  }

  protected get model(): Lowercase<'User'> {
    return 'user';
  }
}
