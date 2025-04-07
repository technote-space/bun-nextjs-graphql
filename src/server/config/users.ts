import type { UserRole } from '#/domains/entities/user/valueObjects';

export default [
  {
    name: '田中太郎',
    email: 'tanaka.tarou@example.com',
    password: 'Test1234',
    role: 'EDITOR' as UserRole,
  },
  {
    name: '管理者',
    email: 'admin@example.com',
    password: 'Test1234',
    role: 'ADMIN' as UserRole,
  },
];
