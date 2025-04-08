import { describe, expect, test } from 'bun:test';
import type { UserRole } from '#/domains/entities/user/valueObjects';
import { E2ETestHelper } from '#/shared/test/e2eTestHelper';
import { taskFactory } from '#/shared/test/utils';

describe('Task E2E Tests', () => {
  const testHelper = new E2ETestHelper();
  const GET_TASK_QUERY = `
    query GetTask($id: ID!) {
      task(id: $id) {
        id
        title
        description
        completedAt
      }
    }
  `;

  test.each([
    [testHelper.getEditorUser().email, 'EDITOR'],
    [testHelper.getEditorUser().email, 'ADMIN'],
    [undefined, 'ADMIN'],
  ])('should fetch a task by id', async (ssoId, userRole) => {
    const task = await taskFactory.create({
      ...(ssoId && { user: { connect: { ssoId } } }),
      title: 'Test Task',
      description: 'Test Description',
    });

    const result = await testHelper.executeQuery(
      GET_TASK_QUERY,
      {
        id: task.id,
      },
      userRole as UserRole,
    );

    expect(result.task).toEqual({
      __typename: 'Task',
      id: task.id,
      title: 'Test Task',
      description: 'Test Description',
      completedAt: null,
    });
  });

  test('should throw an error when task is not found', async () => {
    await expect(
      testHelper.executeAdminQuery(GET_TASK_QUERY, {
        id: 'non-existent-id',
      }),
    ).rejects.toThrow();
  });

  test.each([['EDITOR'], [null]])(
    "should throw an error when EDITOR tries to access other user's task or when unauthenticated",
    async (userRole) => {
      const task = await taskFactory.create({
        title: 'Test Task',
        description: 'Test Description',
      });

      await expect(
        testHelper.executeQuery(
          GET_TASK_QUERY,
          {
            id: task.id,
          },
          userRole as UserRole,
        ),
      ).rejects.toThrow();
    },
  );
});
