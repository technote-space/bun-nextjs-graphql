import { describe, expect, test } from 'bun:test';
import type { UserRole } from '#/domains/entities/user/valueObjects';
import { prisma } from '#/frameworks/database/prisma';
import { E2ETestHelper } from '#/shared/test/e2eTestHelper';

describe('User E2E Tests', () => {
  const testHelper = new E2ETestHelper();
  const GET_USER_QUERY = `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        email
        name
        role
      }
    }
  `;

  test.each([
    [testHelper.getEditorUser(), 'EDITOR'],
    [testHelper.getAdminUser(), 'ADMIN'],
    [testHelper.getEditorUser(), 'ADMIN'],
  ])('should fetch a user by id', async (u, userRole) => {
    const user = await prisma.user.findFirstOrThrow({
      where: { ssoId: u.email },
    });

    const result = await testHelper.executeQuery(
      GET_USER_QUERY,
      {
        id: user.id,
      },
      userRole as UserRole,
    );

    expect(result.user).toEqual({
      __typename: 'User',
      id: user.id,
      email: u.email,
      name: u.name,
      role: u.role,
    });
  });

  test('should throw an error when user is not found', async () => {
    expect(
      testHelper.executeAdminQuery(GET_USER_QUERY, {
        id: 'non-existent-id',
      }),
    ).rejects.toThrow();
  });

  test.each([['EDITOR'], [null]])(
    "should throw an error when EDITOR tries to access other user's data or when unauthenticated",
    async (userRole) => {
      const user = await prisma.user.findFirstOrThrow({
        where: { ssoId: testHelper.getAdminUser().email },
      });

      expect(
        testHelper.executeQuery(
          GET_USER_QUERY,
          {
            id: user.id,
          },
          userRole as UserRole,
        ),
      ).rejects.toThrow();
    },
  );
});
