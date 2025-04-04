import type { GraphQLContext } from '$/context';
import type { QueryResolvers } from '$/types';
import { container } from 'tsyringe';
import { FetchMeController } from '#/interfaceAdapters/controllers/user/meController';
import type { GraphQLSchemaType } from '#/interfaceAdapters/presenters/graphql/user/utils';

export const me: Pick<Required<QueryResolvers<GraphQLContext>>, 'me'> = {
  me: async (_parent, _, { token }) =>
    container.resolve(FetchMeController<GraphQLSchemaType>).invoke({ token }),
};
