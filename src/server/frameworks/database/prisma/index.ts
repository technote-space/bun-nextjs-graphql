import { type Prisma, PrismaClient } from './client';
import type { ITXClientDenyList } from './client/runtime/library';

export type {
  User,
  Task,
  PrismaClient,
  Prisma,
} from './client';

export type TransactionPrismaClient = Omit<PrismaClient, ITXClientDenyList>;
export type ModelName = Prisma.ModelName;
export type ModelDefinition<M extends ModelName> = Prisma.TypeMap['model'][M];
export const prisma = new PrismaClient();
