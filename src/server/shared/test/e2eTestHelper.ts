import {
  ApolloClient,
  InMemoryCache,
  type OperationVariables,
  createHttpLink,
} from '@apollo/client';
import { gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getStringEnv } from '#/config/helper';
import users from '#/config/users';
import type { UserRole } from '#/domains/entities/user/valueObjects';

export class E2ETestHelper {
  public getAdminUser() {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    return users.find((u) => u.role === 'ADMIN')!;
  }

  public getEditorUser() {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    return users.find((u) => u.role === 'EDITOR')!;
  }

  private getClient(role?: UserRole | null) {
    const port = getStringEnv('PORT', '3000');
    const httpLink = createHttpLink({
      uri: `http://localhost:${port}/api/graphql`,
    });

    if (role === null) {
      return new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
      });
    }

    if (role === 'EDITOR') {
      return new ApolloClient({
        link: setContext(async (_, { headers }) => {
          return {
            headers: {
              ...headers,
              authorization: `Bearer ${this.getEditorUser().email}`,
            },
          };
        }).concat(httpLink),
        cache: new InMemoryCache({ resultCacheMaxSize: 1 }),
      });
    }

    return new ApolloClient({
      link: setContext(async (_, { headers }) => {
        return {
          headers: {
            ...headers,
            authorization: `Bearer ${this.getAdminUser().email}`,
          },
        };
      }).concat(httpLink),
      cache: new InMemoryCache({ resultCacheMaxSize: 1 }),
    });
  }

  // biome-ignore lint/suspicious/noExplicitAny:
  public async executeQuery<T = any, V extends OperationVariables = any>(
    query: string,
    variables?: V,
    role?: UserRole | null,
  ): Promise<T> {
    const result = await this.getClient(role).query<T, V>({
      query: gql`
        ${query}
      `,
      variables,
    });
    return result.data;
  }

  // biome-ignore lint/suspicious/noExplicitAny:
  public async executeMutation<T = any, V extends OperationVariables = any>(
    mutation: string,
    variables?: V,
    role?: UserRole | null,
  ): Promise<T> {
    const result = await this.getClient(role).mutate<T, V>({
      mutation: gql`
        ${mutation}
      `,
      variables,
    });
    return result.data as T;
  }

  // biome-ignore lint/suspicious/noExplicitAny:
  public async executeAdminQuery<T = any, V extends OperationVariables = any>(
    query: string,
    variables?: V,
  ): Promise<T> {
    return this.executeQuery(query, variables, 'ADMIN');
  }

  // biome-ignore lint/suspicious/noExplicitAny:
  public async executeEditorQuery<T = any, V extends OperationVariables = any>(
    query: string,
    variables?: V,
  ): Promise<T> {
    return this.executeQuery(query, variables, 'EDITOR');
  }

  public async executeUnauthorizedQuery<
    // biome-ignore lint/suspicious/noExplicitAny:
    T = any,
    // biome-ignore lint/suspicious/noExplicitAny:
    V extends OperationVariables = any,
  >(query: string, variables?: V): Promise<T> {
    return this.executeQuery<T, V>(query, variables, null);
  }

  public async executeAdminMutation<
    // biome-ignore lint/suspicious/noExplicitAny:
    T = any,
    // biome-ignore lint/suspicious/noExplicitAny:
    V extends OperationVariables = any,
  >(mutation: string, variables?: V): Promise<T> {
    return this.executeMutation(mutation, variables, 'ADMIN');
  }

  public async executeEditorMutation<
    // biome-ignore lint/suspicious/noExplicitAny:
    T = any,
    // biome-ignore lint/suspicious/noExplicitAny:
    V extends OperationVariables = any,
  >(mutation: string, variables?: V): Promise<T> {
    return this.executeMutation(mutation, variables, 'EDITOR');
  }

  public async executeUnauthorizedMutation<
    // biome-ignore lint/suspicious/noExplicitAny:
    T = any,
    // biome-ignore lint/suspicious/noExplicitAny:
    V extends OperationVariables = any,
  >(mutation: string, variables?: V): Promise<T> {
    return this.executeMutation<T, V>(mutation, variables, null);
  }
}
