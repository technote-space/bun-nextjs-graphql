import type { User } from '$/types';
import type { UserOutputDto } from '#/usecases/user/dto';

export type GraphQLSchemaType = User;

export const toGraphQLSchema = (user: UserOutputDto): GraphQLSchemaType =>
  ({
    __typename: 'User',
    id: user.id.value,
    name: user.name.value,
    email: user.email.value,
    createdAt: user.createdAt.value.toDate(),
    updatedAt: user.updatedAt.value.toDate(),
  }) as GraphQLSchemaType;
