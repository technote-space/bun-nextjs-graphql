import type { NextRequest } from 'next/server';

export class GraphQLContext {
  constructor(readonly token?: string) {}
}

export const getContext = async (
  request: NextRequest,
): Promise<GraphQLContext> => {
  const [type, token] = request.headers.get('authorization')?.split(' ') ?? [];
  return new GraphQLContext(type === 'Bearer' ? token : undefined);
};
