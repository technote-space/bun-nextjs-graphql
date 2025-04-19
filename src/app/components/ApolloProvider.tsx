'use client';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import type { ReactNode } from 'react';

// Create an HTTP link to the GraphQL API
const httpLink = createHttpLink({
  uri: '/api/graphql',
});

// Add authentication headers to requests
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // Auth headers are handled by Next.js middleware
    },
  };
});

// Create the Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Apollo Provider component
export function ClientApolloProvider({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
