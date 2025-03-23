import '#/config/registry';
import { afterEach, beforeEach } from 'bun:test';
import { initialize } from '@quramy/prisma-fabbrica';
import { container } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { prisma } from '#/frameworks/database/prisma';
import { seedUsers } from '#/frameworks/database/prisma/seed/seedUsers';
import type { SSOClient } from '#/frameworks/sso/client';

initialize({ prisma });

const clearSSOClient = async () => {
  return container.resolve<SSOClient>(DITokens.SSOClient).deleteAll();
};

const clearDatabase = async () => {
  await prisma.user.deleteMany();
  await seedUsers();
};

beforeEach(async () => {
  await Promise.all([clearSSOClient(), clearDatabase()]);
});

afterEach(async () => {
  await prisma.$disconnect();
});
