import type { User } from '#/domains/entities/user';
import type { UserRepository } from '#/domains/repositories/userRepository';
import { RepositoryMock } from '#/frameworks/database/repository.mock';

export class UserRepositoryMock
  extends RepositoryMock<User>
  implements UserRepository
{
  public toEntity(): User {
    throw new Error();
  }
}
