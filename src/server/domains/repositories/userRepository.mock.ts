import type { User } from '#/domains/entities/user';
import type { SsoId } from '#/domains/entities/user/valueObjects';
import type { UserRepository } from '#/domains/repositories/userRepository';
import { RepositoryMock } from '#/frameworks/database/repository.mock';

export class UserRepositoryMock
  extends RepositoryMock<User>
  implements UserRepository
{
  public toEntity(): Promise<User> {
    throw new Error();
  }

  public async findBySsoId(_, ssoId: SsoId): Promise<User | null> {
    this.methodCalled('findBySsoId', [ssoId]);
    return this.items.find((item) => item.ssoId.equals(ssoId)) ?? null;
  }
}
