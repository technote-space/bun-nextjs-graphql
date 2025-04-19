import { Entity } from '@technote-space/vo-entity-ts';
import type { Id as UserId } from '#/domains/entities/user/valueObjects/id';
import {
  CompletedAt,
  CreatedAt,
  type Description,
  Id,
  Status,
  type Title,
  UpdatedAt,
} from './valueObjects';

export class Task extends Entity {
  public constructor(
    public readonly id: Id,
    public readonly userId: UserId,
    public readonly title: Title,
    public readonly description: Description,
    public readonly completedAt: CompletedAt,
    public readonly createdAt: CreatedAt,
    public readonly updatedAt: UpdatedAt,
  ) {
    super();
  }

  public get status(): Status {
    if (this.completedAt.value) {
      return new Status('Completed');
    }

    return new Status('Planned');
  }

  public equals(other: Task): boolean {
    return this.id.equals(other.id);
  }

  public static create(
    userId: UserId,
    title: Title,
    description: Description,
  ): Task {
    return Task._create(
      new Id(undefined),
      userId,
      title,
      description,
      new CompletedAt(null),
      new CreatedAt(undefined),
      new UpdatedAt(undefined),
    );
  }

  public static reconstruct(
    id: Id,
    userId: UserId,
    title: Title,
    description: Description,
    completedAt: CompletedAt,
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
  ): Task {
    return Task._reconstruct(
      id,
      userId,
      title,
      description,
      completedAt,
      createdAt,
      updatedAt,
    );
  }

  public update({
    title,
    description,
    completedAt,
  }: {
    title?: Title;
    description?: Description;
    completedAt?: CompletedAt;
  }): Task {
    return Task._update(
      this,
      this.id,
      this.userId,
      title ?? this.title,
      description ?? this.description,
      completedAt ?? this.completedAt,
      this.createdAt,
      new UpdatedAt(undefined),
    );
  }

  public onCompleted(): Task {
    return this.update({
      completedAt: new CompletedAt(undefined),
    });
  }
}
