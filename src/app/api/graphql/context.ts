import { auth0 } from '^/lib/auth0';
import type { NextRequest } from 'next/server';

export class GraphQLContext {
  constructor(readonly token?: string) {}
}

export const getContext = async (
  request: NextRequest,
): Promise<GraphQLContext> => {
  const [type, token] = request.headers.get('Authorization')?.split(' ') ?? [];
  if (type === 'Bearer' && token) {
    return new GraphQLContext(token);
  }

  const session = await auth0.getSession();
  return new GraphQLContext(session?.tokenSet.idToken);
};
