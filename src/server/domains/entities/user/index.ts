import { Entity } from '@technote-space/vo-entity-ts';
import { CreatedAt, Id, type Name, UpdatedAt } from './valueObjects';

export class User extends Entity {
  public constructor(
    public readonly id: Id,
    public readonly name: Name,
    public readonly createdAt: CreatedAt,
    public readonly updatedAt: UpdatedAt,
  ) {
    super();
  }

  public equals(other: User): boolean {
    return this.id.equals(other.id);
  }

  public static create(name: Name): User {
    return User._create(
      new Id(undefined),
      name,
      new CreatedAt(undefined),
      new UpdatedAt(undefined),
    );
  }

  public static reconstruct(
    id: Id,
    name: Name,
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
  ): User {
    return User._reconstruct(id, name, createdAt, updatedAt);
  }

  public update({ name }: { name?: Name }): User {
    return User._update(
      this,
      this.id,
      name ?? this.name,
      this.createdAt,
      new UpdatedAt(undefined),
    );
  }
}
