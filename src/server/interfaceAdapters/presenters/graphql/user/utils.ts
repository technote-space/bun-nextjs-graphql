import type { User } from '$/types';
import type { User as UserEntity } from '#/domains/entities/user';

export type GraphQLSchemaType = User;

export const toGraphQLSchema = (user: UserEntity): GraphQLSchemaType =>
  ({
    __typename: 'User',
    id: user.id.value,
    name: user.name.value,
    createdAt: user.createdAt.value.toDate(),
    updatedAt: user.updatedAt.value.toDate(),
  }) as GraphQLSchemaType;
