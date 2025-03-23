import { container } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { prisma } from '#/frameworks/database/prisma';
import { PrismaRepository } from '#/interfaceAdapters/repositories/prisma/repository';

container.registerInstance(DITokens.PrismaClient, prisma);
container.registerSingleton(DITokens.Repository, PrismaRepository);
