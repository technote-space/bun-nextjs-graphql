import assert from 'node:assert';
import { exec as originalExec } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(originalExec);

export default async () => {
  assert(process.env.NODE_ENV === 'test');

  const result = await exec('npx prisma migrate reset --force');
  console.debug(result.stdout);
  if (result.stderr) console.error(result.stderr);
};
