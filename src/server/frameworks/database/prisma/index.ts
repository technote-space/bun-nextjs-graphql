import { type Prisma, PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export type {
  User,
  Task,
  PrismaClient,
  Prisma,
} from '@prisma/client';

export type TransactionPrismaClient = Omit<PrismaClient, ITXClientDenyList>;
export type ModelName = Prisma.ModelName;
export type ModelDefinition<M extends ModelName> = Prisma.TypeMap['model'][M];
export const prisma = new PrismaClient();
