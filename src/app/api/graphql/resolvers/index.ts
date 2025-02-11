import type { GraphQLContext } from '$/context';
import type { Resolvers } from '$/types';
import { DateResolver, DateTimeResolver } from 'graphql-scalars';
import * as Entity from './entity';
import { Mutation } from './mutation';
import { Query } from './query';

export const resolvers: Resolvers<GraphQLContext> = {
  DateTime: DateTimeResolver,
  Date: DateResolver,
  Query,
  Mutation,
  ...Entity,
};
