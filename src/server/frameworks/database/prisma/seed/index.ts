import '#/config/registry';
import { container } from 'tsyringe';
import { DITokens } from '#/config/constants';
import type { PrismaClient } from '#/frameworks/database/prisma';
import { seedUsers } from '#/frameworks/database/prisma/seed/seedUsers';

const prisma = container.resolve<PrismaClient>(DITokens.PrismaClient);

const main = async () => {
  console.debug('seeding...');

  await seedUsers();

  console.debug('seeding done!');
};

main().finally(async () => {
  await prisma.$disconnect();
});
