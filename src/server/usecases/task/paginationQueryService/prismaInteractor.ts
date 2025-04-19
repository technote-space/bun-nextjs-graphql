import { TaskStatus } from '$/types';
import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { Task } from '#/domains/entities/task';
import type { TaskRepository } from '#/domains/repositories/taskRepository';
import type { PrismaClient } from '#/frameworks/database/prisma';
import { getKeywords } from '#/shared/utils';
import { paginate } from '#/usecases/shared/prismaUtils';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { PaginateTaskOutput, PaginateTaskParams } from './dto';
import type { TaskPaginationQueryService } from './usecase';

@singleton()
export class PrismaTaskPaginationQueryService
  implements TaskPaginationQueryService
{
  public constructor(
    @inject(DITokens.PrismaClient) private readonly prisma: PrismaClient,
    @inject(DITokens.TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  public async handle(
    session: UserSession,
    params: PaginateTaskParams,
  ): Promise<PaginateTaskOutput> {
    await session.authorize('list', Task.name);

    const keywords = getKeywords(params.q);
    return paginate('Task', params, this.taskRepository.toEntity, this.prisma, {
      where: {
        userId: params.userId ?? session.getContextOrNull()?.user.id.value,
        ...(keywords.length
          ? {
              AND: keywords.map((keyword) => ({
                OR: [
                  { title: { contains: keyword } },
                  { description: { contains: keyword } },
                ],
              })),
            }
          : {}),
        ...(params.statuses?.length
          ? {
              OR: [
                ...(params.statuses?.includes(TaskStatus.Completed)
                  ? [{ completedAt: { not: null } }]
                  : []),
                ...(params.statuses?.includes(TaskStatus.Expired)
                  ? [
                      {
                        completedAt: null,
                        expiredAt: { lt: new Date() },
                      },
                    ]
                  : []),
                ...(params.statuses?.includes(TaskStatus.InProgress)
                  ? [
                      {
                        completedAt: null,
                        startedAt: { not: null },
                      },
                    ]
                  : []),
                ...(params.statuses?.includes(TaskStatus.Planned)
                  ? [
                      {
                        completedAt: null,
                        startedAt: null,
                      },
                    ]
                  : []),
              ],
            }
          : {}),
      },
    });
  }
}
