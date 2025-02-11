import type { GraphQLContext } from '$/context';
import type { MutationResolvers } from '$/types';
import { Task } from './task';
import { User } from './user';

export const Mutation: Required<MutationResolvers<GraphQLContext>> = {
  ...User,
  ...Task,
};
