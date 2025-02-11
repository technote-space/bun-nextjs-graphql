import type {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from '@apollo/server';
import { GraphQLError } from 'graphql';
import {
  directiveEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';

export class ComplexityPlugin implements ApolloServerPlugin {
  async requestDidStart({
    schema,
    // biome-ignore lint/suspicious/noExplicitAny:
  }: GraphQLRequestContext<any>): Promise<GraphQLRequestListener<any>> {
    const maxComplexity = 10000;

    return {
      async didResolveOperation({ request, document }) {
        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [
            directiveEstimator(),
            simpleEstimator({ defaultComplexity: 1 }),
          ],
        });

        if (complexity > maxComplexity) {
          throw new GraphQLError('クエリが複雑すぎます', {
            extensions: {
              status: 422,
              code: 'QUERY_TOO_COMPLEX',
              complexity,
              maxComplexity,
            },
          });
        }
      },
    };
  }
}
