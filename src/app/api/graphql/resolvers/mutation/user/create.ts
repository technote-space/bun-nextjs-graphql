import type { GraphQLContext } from '$/context';
import type { MutationResolvers } from '$/types';
import { container } from 'tsyringe';
import { CreateUserController } from '#/interfaceAdapters/controllers/user/createController';
import type { GraphQLSchemaType } from '#/interfaceAdapters/presenters/graphql/user/utils';

export const createUser: Pick<
  Required<MutationResolvers<GraphQLContext>>,
  'createUser'
> = {
  createUser: async (_parent, { input }, { token }) =>
    container
      .resolve(CreateUserController<GraphQLSchemaType>)
      .invoke({ input, token }),
};
