import { auth0 } from '^/lib/auth0';

export class GraphQLContext {
  constructor(readonly token?: string) {}
}

export const getContext = async (): Promise<GraphQLContext> => {
  const session = await auth0.getSession();
  return new GraphQLContext(session?.tokenSet.idToken);
};
