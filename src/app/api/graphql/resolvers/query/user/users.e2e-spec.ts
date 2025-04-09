import { describe, expect, test } from 'bun:test';
import type { UserRole } from '#/domains/entities/user/valueObjects';
import { E2ETestHelper } from '#/shared/test/e2eTestHelper';
import { userFactory } from '#/shared/test/utils';

describe('Users E2E Tests', () => {
  const testHelper = new E2ETestHelper();
  const GET_USERS_QUERY = `
    query GetUsers($page: Int, $perPage: Int, $name: String, $sortKey: UserSortKey = id, $sortOrder: SortOrder = asc) {
      users(page: $page, perPage: $perPage, name: $name, sortKey: $sortKey, sortOrder: $sortOrder) {
        edges {
          node {
            id
            email
            name
            role
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

  describe('Users Query Tests', () => {
    test('should fetch users with pagination', async () => {
      // Create test users
      await Promise.all([
        userFactory.create({ name: 'Test User 1', ssoId: 'user1@example.com' }),
        userFactory.create({ name: 'Test User 2', ssoId: 'user2@example.com' }),
        userFactory.create({ name: 'Test User 3', ssoId: 'user3@example.com' }),
      ]);

      const result = await testHelper.executeAdminQuery(GET_USERS_QUERY, {
        page: 1,
        perPage: 2,
        name: 'Test User',
        sortKey: 'name',
      });

      expect(result.users.edges).toHaveLength(2);
      expect(result.users.pageInfo).toEqual({
        __typename: 'PageInfo',
        totalCount: 3,
        perPage: 2,
        totalPage: 2,
        currentPage: 1,
      });
      expect(result.users.edges[0].node.name).toBe('Test User 1');
      expect(result.users.edges[1].node.name).toBe('Test User 2');
    });

    test('should fetch next page of users', async () => {
      // Create test users
      await Promise.all([
        userFactory.create({ name: 'Test User 1', ssoId: 'user1@example.com' }),
        userFactory.create({ name: 'Test User 2', ssoId: 'user2@example.com' }),
        userFactory.create({ name: 'Test User 3', ssoId: 'user3@example.com' }),
      ]);

      const result = await testHelper.executeAdminQuery(GET_USERS_QUERY, {
        page: 2,
        perPage: 2,
        name: 'Test User',
        sortKey: 'name',
      });

      expect(result.users.edges).toHaveLength(1);
      expect(result.users.pageInfo).toEqual({
        __typename: 'PageInfo',
        totalCount: 3,
        perPage: 2,
        totalPage: 2,
        currentPage: 2,
      });
      expect(result.users.edges[0].node.name).toBe('Test User 3');
    });

    test('should search users by name', async () => {
      // Create test users
      await Promise.all([
        userFactory.create({
          name: 'Test John Doe',
          ssoId: 'user1@example.com',
        }),
        userFactory.create({
          name: 'Test Jane Smith',
          ssoId: 'user2@example.com',
        }),
        userFactory.create({
          name: 'Test Bob Johnson',
          ssoId: 'user3@example.com',
        }),
      ]);

      const result = await testHelper.executeAdminQuery(GET_USERS_QUERY, {
        page: 1,
        perPage: 10,
        name: 'Test John',
        sortKey: 'name',
      });

      expect(result.users.edges).toHaveLength(2);
      expect(result.users.pageInfo).toEqual({
        __typename: 'PageInfo',
        totalCount: 2,
        perPage: 10,
        totalPage: 1,
        currentPage: 1,
      });
      expect(result.users.edges[0].node.name).toBe('Test Bob Johnson');
      expect(result.users.edges[1].node.name).toBe('Test John Doe');
    });

    test('should sort users by name in descending order', async () => {
      // Create test users
      await Promise.all([
        userFactory.create({ name: 'Test Alice', ssoId: 'user1@example.com' }),
        userFactory.create({ name: 'Test Bob', ssoId: 'user2@example.com' }),
        userFactory.create({
          name: 'Test Charlie',
          ssoId: 'user3@example.com',
        }),
      ]);

      const result = await testHelper.executeAdminQuery(GET_USERS_QUERY, {
        page: 1,
        perPage: 10,
        name: 'Test',
        sortKey: 'name',
        sortOrder: 'desc',
      });

      expect(result.users.edges).toHaveLength(3);
      expect(result.users.pageInfo).toEqual({
        __typename: 'PageInfo',
        totalCount: 3,
        perPage: 10,
        totalPage: 1,
        currentPage: 1,
      });
      expect(result.users.edges[0].node.name).toBe('Test Charlie');
      expect(result.users.edges[1].node.name).toBe('Test Bob');
      expect(result.users.edges[2].node.name).toBe('Test Alice');
    });

    test('should return empty result when no users match search criteria', async () => {
      // Create test users
      await Promise.all([
        userFactory.create({
          name: 'Test John Doe',
          ssoId: 'user1@example.com',
        }),
        userFactory.create({
          name: 'Test Jane Smith',
          ssoId: 'user2@example.com',
        }),
      ]);

      const result = await testHelper.executeAdminQuery(GET_USERS_QUERY, {
        page: 1,
        perPage: 10,
        name: 'NonExistent',
      });

      expect(result.users.edges).toHaveLength(0);
      expect(result.users.pageInfo).toEqual({
        __typename: 'PageInfo',
        totalCount: 0,
        perPage: 10,
        totalPage: 0,
        currentPage: 1,
      });
    });

    test.each([['EDITOR'], [null]])(
      'should throw an error when EDITOR tries to fetch users or when unauthenticated',
      async (userRole) => {
        expect(
          testHelper.executeQuery(
            GET_USERS_QUERY,
            {
              page: 1,
              perPage: 10,
            },
            userRole as UserRole,
          ),
        ).rejects.toThrow();
      },
    );
  });
});
