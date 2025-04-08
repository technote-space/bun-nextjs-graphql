import '#/config/registry';
import { afterEach, beforeEach } from 'bun:test';
import assert from 'node:assert';
import { exec as originalExec } from 'node:child_process';
import { promisify } from 'node:util';
import { initialize } from '@quramy/prisma-fabbrica';
import { container } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { prisma } from '#/frameworks/database/prisma';
import { seedUsers } from '#/frameworks/database/prisma/seed/seedUsers';
import type { SSOClient } from '#/frameworks/sso/client';

const clearSSOClient = async () => {
  return container.resolve<SSOClient>(DITokens.SSOClient).deleteAll();
};

const clearDatabase = async () => {
  await prisma.user.deleteMany();
  await seedUsers();
};

const setupDatabase = async () => {
  const exec = promisify(originalExec);
  const result = await exec('npx prisma migrate reset --force');
  console.debug(result.stdout);
  if (result.stderr) console.error(result.stderr);
};

const setup = async () => {
  assert(process.env.NODE_ENV === 'test');

  await setupDatabase();

  initialize({ prisma });

  beforeEach(async () => {
    await clearSSOClient();
    await clearDatabase();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });
};

await setup();
