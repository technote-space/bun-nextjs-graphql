import type { NextApiRequest } from 'next';

export class GraphQLContext {
  constructor(readonly token?: string) {}
}

export const getContext = async (
  request: NextApiRequest,
): Promise<GraphQLContext> => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return new GraphQLContext(type === 'Bearer' ? token : undefined);
};
