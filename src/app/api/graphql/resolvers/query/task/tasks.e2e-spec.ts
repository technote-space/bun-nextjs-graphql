import { describe, expect, test } from 'bun:test';
import type { UserRole } from '#/domains/entities/user/valueObjects';
import { E2ETestHelper } from '#/shared/test/e2eTestHelper';
import { taskFactory } from '#/shared/test/utils';

describe('Tasks E2E Tests', () => {
  const testHelper = new E2ETestHelper();
  const GET_TASKS_QUERY = `
    query GetTasks($q: String) {
      tasks(q: $q) {
        edges {
          node {
            id
            title
            description
            completedAt
          }
        }
        pageInfo {
          totalCount
          perPage
          totalPage
          currentPage
        }
      }
    }
  `;

  test.each([['EDITOR'], ['ADMIN']])(
    'should allow access for %s role',
    async (userRole) => {
      const result = await testHelper.executeQuery(
        GET_TASKS_QUERY,
        {},
        userRole as UserRole,
      );

      expect(result.tasks).toBeDefined();
    },
  );

  test('should throw an error when unauthenticated', async () => {
    expect(
      testHelper.executeQuery(GET_TASKS_QUERY, {}, null),
    ).rejects.toThrow();
  });

  test('should only list tasks owned by the current user', async () => {
    const currentUser = testHelper.getEditorUser();
    const otherUser = testHelper.getAdminUser();

    // Create tasks for current user
    const currentUserTasks = await Promise.all([
      taskFactory.create({
        user: { connect: { ssoId: currentUser.email } },
      }),
      taskFactory.create({
        user: { connect: { ssoId: currentUser.email } },
      }),
    ]);

    // Create tasks for other user
    await Promise.all([
      taskFactory.create({
        user: { connect: { ssoId: otherUser.email } },
      }),
      taskFactory.create({
        user: { connect: { ssoId: otherUser.email } },
      }),
    ]);

    const result = await testHelper.executeQuery(GET_TASKS_QUERY, {}, 'EDITOR');

    expect(result.tasks.edges).toHaveLength(2);
    expect(result.tasks.edges.map((edge) => edge.node.id)).toEqual(
      expect.arrayContaining(currentUserTasks.map((task) => task.id)),
    );
  });

  test('should filter tasks by query in title and description', async () => {
    const currentUser = testHelper.getEditorUser();

    // Create tasks with different titles and descriptions
    const matchingTasks = await Promise.all([
      taskFactory.create({
        user: { connect: { ssoId: currentUser.email } },
        title: 'Search Term in Title',
        description: 'Some description',
      }),
      taskFactory.create({
        user: { connect: { ssoId: currentUser.email } },
        title: 'Some title',
        description: 'Search Term in Description',
      }),
    ]);

    await taskFactory.create({
      user: { connect: { ssoId: currentUser.email } },
    });

    const result = await testHelper.executeQuery(
      GET_TASKS_QUERY,
      { q: 'Search Term' },
      'EDITOR',
    );

    expect(result.tasks.edges).toHaveLength(2);
    expect(result.tasks.edges.map((edge) => edge.node.id)).toEqual(
      expect.arrayContaining(matchingTasks.map((task) => task.id)),
    );
  });
});
