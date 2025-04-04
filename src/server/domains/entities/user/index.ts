import { Entity } from '@technote-space/vo-entity-ts';
import {
  CreatedAt,
  Id,
  SsoId,
  UpdatedAt,
  type UserEmail,
  type UserName,
} from './valueObjects';

export class User extends Entity {
  public constructor(
    public readonly id: Id,
    public readonly ssoId: SsoId,
    public readonly name: UserName,
    public readonly email: UserEmail,
    public readonly createdAt: CreatedAt,
    public readonly updatedAt: UpdatedAt,
  ) {
    super();
  }

  public equals(other: User): boolean {
    return this.id.equals(other.id);
  }

  public static create(name: UserName, email: UserEmail): User {
    return User._create(
      new Id(undefined),
      new SsoId(null),
      name,
      email,
      new CreatedAt(undefined),
      new UpdatedAt(undefined),
    );
  }

  public static reconstruct(
    id: Id,
    ssoId: SsoId,
    name: UserName,
    email: UserEmail,
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
  ): User {
    return User._reconstruct(id, ssoId, name, email, createdAt, updatedAt);
  }

  public update({ name, email }: { name?: UserName; email?: UserEmail }): User {
    return User._update(
      this,
      this.id,
      this.ssoId,
      name ?? this.name,
      email ?? this.email,
      this.createdAt,
      new UpdatedAt(undefined),
    );
  }
}
