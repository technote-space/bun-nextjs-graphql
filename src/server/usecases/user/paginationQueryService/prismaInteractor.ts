import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { User } from '#/domains/entities/user';
import type { UserRepository } from '#/domains/repositories/userRepository';
import type { PrismaClient } from '#/frameworks/database/prisma';
import { getKeywords } from '#/shared/utils';
import { paginate } from '#/usecases/shared/prismaUtils';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { PaginateUserOutput, PaginateUserParams } from './dto';
import type { UserPaginationQueryService } from './usecase';

@singleton()
export class PrismaUserPaginationQueryService
  implements UserPaginationQueryService
{
  public constructor(
    @inject(DITokens.PrismaClient) private readonly prisma: PrismaClient,
    @inject(DITokens.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  public async handle(
    session: UserSession,
    params: PaginateUserParams,
  ): Promise<PaginateUserOutput> {
    await session.authorize('list', User.name);

    const keywords = getKeywords(params.name);
    return paginate(
      'User',
      params,
      this.userRepository.toEntity.bind(this.userRepository),
      this.prisma,
      {
        where: {
          ...(keywords.length
            ? {
                AND: keywords.map((keyword) => ({
                  name: { contains: keyword },
                })),
              }
            : {}),
        },
      },
    );
  }
}
