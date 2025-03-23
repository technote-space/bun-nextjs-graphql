import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import type {
  PrismaClient,
  TransactionPrismaClient,
} from '#/frameworks/database/prisma';
import type { Repository } from '#/frameworks/database/repository';

@singleton()
export class PrismaRepository implements Repository {
  public constructor(
    @inject(DITokens.PrismaClient) protected readonly prisma: PrismaClient,
  ) {}

  public async transaction<T>(
    callback: (client: TransactionPrismaClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (prisma) => callback(prisma), {
      maxWait: 10000,
      timeout: 20000,
    });
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRawUnsafe('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}
