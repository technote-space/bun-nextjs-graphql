import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { Task } from '#/domains/entities/task';
import {
  CompletedAt,
  CreatedAt,
  Description,
  ExpiredAt,
  Id,
  StartedAt,
  Title,
  UpdatedAt,
} from '#/domains/entities/task/valueObjects';
import { Id as UserId } from '#/domains/entities/user/valueObjects';
import type { TaskRepository } from '#/domains/repositories/taskRepository';
import type {
  PrismaClient,
  Task as PrismaTask,
  TransactionPrismaClient,
} from '#/frameworks/database/prisma';
import { PrismaSharedRepository } from './sharedRepository';

@singleton()
export class PrismaTaskRepository
  extends PrismaSharedRepository<PrismaTask, Task, 'Task'>
  implements TaskRepository<TransactionPrismaClient>
{
  public constructor(@inject(DITokens.PrismaClient) _prisma: PrismaClient) {
    super(_prisma);
  }

  public toEntity(task: PrismaTask): Task {
    return Task.reconstruct(
      new Id(task.id),
      new UserId(task.userId),
      new Title(task.title),
      new Description(task.description),
      new CompletedAt(task.completedAt),
      new StartedAt(task.startedAt),
      new ExpiredAt(task.expiredAt),
      new CreatedAt(task.createdAt),
      new UpdatedAt(task.updatedAt),
    );
  }

  protected getUpsertParams(task: Task) {
    return {
      userId: task.userId.value,
      title: task.title.value,
      description: task.description.value,
      completedAt: task.completedAt.value?.toDate(),
      startedAt: task.startedAt.value?.toDate(),
      expiredAt: task.expiredAt.value?.toDate(),
    };
  }

  protected get model(): Lowercase<'Task'> {
    return 'task';
  }
}
