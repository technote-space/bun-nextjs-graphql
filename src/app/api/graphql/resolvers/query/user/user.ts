import type { GraphQLContext } from '$/context';
import type { QueryResolvers } from '$/types';
import { container } from 'tsyringe';
import { FetchUserController } from '#/interfaceAdapters/controllers/user/fetchController';
import type { GraphQLSchemaType } from '#/interfaceAdapters/presenters/graphql/user/utils';

export const user: Pick<Required<QueryResolvers<GraphQLContext>>, 'user'> = {
  user: async (_parent, { id }, { token }) =>
    container
      .resolve(FetchUserController<GraphQLSchemaType>)
      .invoke({ id, token }),
};
