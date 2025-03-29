import { container } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { prisma } from '#/frameworks/database/prisma';
import { PrismaRepository } from '#/interfaceAdapters/repositories/prisma/repository';
import { PrismaTaskRepository } from '#/interfaceAdapters/repositories/prisma/taskRepository';
import { PrismaUserRepository } from '#/interfaceAdapters/repositories/prisma/userRepository';

container.registerInstance(DITokens.PrismaClient, prisma);
container.registerSingleton(DITokens.Repository, PrismaRepository);
container.registerSingleton(DITokens.TaskRepository, PrismaTaskRepository);
container.registerSingleton(DITokens.UserRepository, PrismaUserRepository);
