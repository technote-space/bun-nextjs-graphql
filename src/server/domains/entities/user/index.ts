import { Entity } from '@technote-space/vo-entity-ts';
import {
  CreatedAt,
  Id,
  type Role,
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
    public readonly role: Role,
    public readonly createdAt: CreatedAt,
    public readonly updatedAt: UpdatedAt,
  ) {
    super();
  }

  public equals(other: User): boolean {
    return this.id.equals(other.id);
  }

  public static create(name: UserName, email: UserEmail, role: Role): User {
    return User._create(
      new Id(undefined),
      new SsoId(null),
      name,
      email,
      role,
      new CreatedAt(undefined),
      new UpdatedAt(undefined),
    );
  }

  public static reconstruct(
    id: Id,
    ssoId: SsoId,
    name: UserName,
    email: UserEmail,
    role: Role,
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
  ): User {
    return User._reconstruct(
      id,
      ssoId,
      name,
      email,
      role,
      createdAt,
      updatedAt,
    );
  }

  public update({
    name,
    email,
    role,
  }: { name?: UserName; email?: UserEmail; role?: Role }): User {
    return User._update(
      this,
      this.id,
      this.ssoId,
      name ?? this.name,
      email ?? this.email,
      role ?? this.role,
      this.createdAt,
      new UpdatedAt(undefined),
    );
  }
}
