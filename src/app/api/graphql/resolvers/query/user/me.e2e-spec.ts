import { describe, expect, test } from 'bun:test';
import { prisma } from '#/frameworks/database/prisma';
import { E2ETestHelper } from '#/shared/test/e2eTestHelper';

describe('Me E2E Tests', () => {
  const testHelper = new E2ETestHelper();
  const GET_ME_QUERY = `
    query GetMe {
      me {
        id
        email
        name
        role
      }
    }
  `;

  describe('Me Query Tests', () => {
    test('should fetch current user information for admin', async () => {
      const adminUser = testHelper.getAdminUser();
      const user = await prisma.user.findFirstOrThrow({
        where: { ssoId: adminUser.email },
      });

      const result = await testHelper.executeAdminQuery(GET_ME_QUERY);

      expect(result.me).toEqual({
        __typename: 'User',
        id: user.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      });
    });

    test('should fetch current user information for editor', async () => {
      const editorUser = testHelper.getEditorUser();
      const user = await prisma.user.findFirstOrThrow({
        where: { ssoId: editorUser.email },
      });

      const result = await testHelper.executeEditorQuery(GET_ME_QUERY);

      expect(result.me).toEqual({
        __typename: 'User',
        id: user.id,
        email: editorUser.email,
        name: editorUser.name,
        role: editorUser.role,
      });
    });

    test('should throw an error when unauthenticated', async () => {
      await expect(
        testHelper.executeQuery(GET_ME_QUERY, {}, null),
      ).rejects.toThrow();
    });
  });
});
