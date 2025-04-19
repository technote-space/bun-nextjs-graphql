import { Entity } from '@technote-space/vo-entity-ts';
import type { Id as UserId } from '#/domains/entities/user/valueObjects/id';
import {
  CompletedAt,
  CreatedAt,
  type Description,
  ExpiredAt,
  Id,
  StartedAt,
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
    public readonly startedAt: StartedAt,
    public readonly expiredAt: ExpiredAt,
    public readonly createdAt: CreatedAt,
    public readonly updatedAt: UpdatedAt,
  ) {
    super();
  }

  public get status(): Status {
    if (this.completedAt.value) {
      return new Status('Completed');
    }
    if (this.expiredAt.value?.isBefore()) {
      return new Status('Expired');
    }
    if (this.startedAt.value) {
      return new Status('InProgress');
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
    expiredAt?: ExpiredAt,
  ): Task {
    return Task._create(
      new Id(undefined),
      userId,
      title,
      description,
      new CompletedAt(null),
      new StartedAt(null),
      expiredAt ?? new ExpiredAt(null),
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
    startedAt: StartedAt,
    expiredAt: ExpiredAt,
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
  ): Task {
    return Task._reconstruct(
      id,
      userId,
      title,
      description,
      completedAt,
      startedAt,
      expiredAt,
      createdAt,
      updatedAt,
    );
  }

  public update({
    title,
    description,
    completedAt,
    startedAt,
    expiredAt,
  }: {
    title?: Title;
    description?: Description;
    completedAt?: CompletedAt;
    startedAt?: StartedAt;
    expiredAt?: ExpiredAt;
  }): Task {
    return Task._update(
      this,
      this.id,
      this.userId,
      title ?? this.title,
      description ?? this.description,
      completedAt ?? this.completedAt,
      startedAt ?? this.startedAt,
      expiredAt ?? this.expiredAt,
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
