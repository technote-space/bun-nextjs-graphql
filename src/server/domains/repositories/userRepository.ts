import type { User } from '#/domains/entities/user';
import type { Id } from '#/domains/entities/user/valueObjects';
import type { Client, Repository } from '#/frameworks/database/repository';

export interface UserRepository<C extends Client = unknown>
  extends Repository<C> {
  // biome-ignore lint/suspicious/noExplicitAny:
  toEntity(value: any): User;

  find(client: C, id: Id): Promise<User | null>;

  save(client: C, user: User): Promise<User>;

  delete(client: C, id: Id): Promise<User | null>;
}
