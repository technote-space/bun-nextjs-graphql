import type { GraphQLContext } from '$/context';
import type { TaskResolvers } from '$/types';
import { container } from 'tsyringe';
import { FetchUserController } from '#/interfaceAdapters/controllers/user/fetchController';
import type { GraphQLSchemaType } from '#/interfaceAdapters/presenters/graphql/user/utils';

export const Task: TaskResolvers<GraphQLContext> = {
  user: async (parent, _, { token }) =>
    container
      .resolve(FetchUserController<GraphQLSchemaType>)
      .invoke({ id: parent.userId, token }),
};
