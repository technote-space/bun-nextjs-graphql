import { describe, expect, test } from 'bun:test';
import type { UserRole } from '#/domains/entities/user/valueObjects';
import { E2ETestHelper } from '#/shared/test/e2eTestHelper';
import { taskFactory } from '#/shared/test/utils';

describe('Tasks E2E Tests', () => {
  const testHelper = new E2ETestHelper();
  const GET_TASKS_QUERY = `
    query GetTasks($q: String, $statuses: [TaskStatus!]) {
      tasks(q: $q, statuses: $statuses) {
        edges {
          node {
            id
            title
            description
            completedAt
            status
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

  test('should filter tasks by status', async () => {
    const currentUser = testHelper.getEditorUser();

    // Create a completed task
    const completedTask = await taskFactory.create({
      user: { connect: { ssoId: currentUser.email } },
      title: 'Completed Task',
      description: 'This task is completed',
      completedAt: new Date(),
    });

    // Create an expired task
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday
    const expiredTask = await taskFactory.create({
      user: { connect: { ssoId: currentUser.email } },
      title: 'Expired Task',
      description: 'This task is expired',
      expiredAt: pastDate,
    });

    // Create an in-progress task
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Tomorrow
    const inProgressTask = await taskFactory.create({
      user: { connect: { ssoId: currentUser.email } },
      title: 'In Progress Task',
      description: 'This task is in progress',
      startedAt: new Date(),
      expiredAt: futureDate,
    });

    // Create a planned task
    const plannedTask = await taskFactory.create({
      user: { connect: { ssoId: currentUser.email } },
      title: 'Planned Task',
      description: 'This task is planned',
      expiredAt: futureDate,
    });

    // Test filtering by Completed status
    let result = await testHelper.executeQuery(
      GET_TASKS_QUERY,
      { statuses: ['Completed'] },
      'EDITOR',
    );

    expect(result.tasks.edges).toHaveLength(1);
    expect(result.tasks.edges[0].node.id).toBe(completedTask.id);
    expect(result.tasks.edges[0].node.status).toBe('Completed');

    // Test filtering by Expired status
    result = await testHelper.executeQuery(
      GET_TASKS_QUERY,
      { statuses: ['Expired'] },
      'EDITOR',
    );

    expect(result.tasks.edges).toHaveLength(1);
    expect(result.tasks.edges[0].node.id).toBe(expiredTask.id);
    expect(result.tasks.edges[0].node.status).toBe('Expired');

    // Test filtering by InProgress status
    result = await testHelper.executeQuery(
      GET_TASKS_QUERY,
      { statuses: ['InProgress'] },
      'EDITOR',
    );

    expect(result.tasks.edges).toHaveLength(1);
    expect(result.tasks.edges[0].node.id).toBe(inProgressTask.id);
    expect(result.tasks.edges[0].node.status).toBe('InProgress');

    // Test filtering by Planned status
    result = await testHelper.executeQuery(
      GET_TASKS_QUERY,
      { statuses: ['Planned'] },
      'EDITOR',
    );

    expect(result.tasks.edges).toHaveLength(2);
    expect(result.tasks.edges.map((edge) => edge.node.id)).toEqual(
      expect.arrayContaining([expiredTask.id, plannedTask.id]),
    );

    // Test filtering by multiple statuses
    result = await testHelper.executeQuery(
      GET_TASKS_QUERY,
      { statuses: ['Completed', 'InProgress'] },
      'EDITOR',
    );

    expect(result.tasks.edges).toHaveLength(2);
    expect(result.tasks.edges.map((edge) => edge.node.id)).toEqual(
      expect.arrayContaining([completedTask.id, inProgressTask.id]),
    );

    // Test filtering by multiple statuses
    result = await testHelper.executeQuery(
      GET_TASKS_QUERY,
      { statuses: ['Completed', 'Expired', 'InProgress', 'Planned'] },
      'EDITOR',
    );

    expect(result.tasks.edges).toHaveLength(4);
    expect(result.tasks.edges.map((edge) => edge.node.id)).toEqual(
      expect.arrayContaining([
        completedTask.id,
        expiredTask.id,
        inProgressTask.id,
        plannedTask.id,
      ]),
    );

    // Test with no status filter (should return all tasks)
    result = await testHelper.executeQuery(GET_TASKS_QUERY, {}, 'EDITOR');

    expect(result.tasks.edges).toHaveLength(4);
    expect(result.tasks.edges.map((edge) => edge.node.id)).toEqual(
      expect.arrayContaining([
        completedTask.id,
        expiredTask.id,
        inProgressTask.id,
        plannedTask.id,
      ]),
    );
  });
});
