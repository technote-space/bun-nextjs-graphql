import type { GraphQLContext } from '$/context';
import type { QueryResolvers } from '$/types';
import { Task } from './task';
import { User } from './user';

export const Query: Required<QueryResolvers<GraphQLContext>> = {
  ...User,
  ...Task,
};
