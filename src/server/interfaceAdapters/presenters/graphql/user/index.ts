import { singleton } from 'tsyringe';
import type { User as UserEntity } from '#/domains/entities/user';
import type { MaybeNullable } from '#/shared/types';
import type { UserPresenter } from '#/usecases/user/presenter';
import { type GraphQLSchemaType, toGraphQLSchema } from './utils';

@singleton()
export class GraphQLUserPresenter implements UserPresenter {
  public entity<T extends UserEntity>(
    user: T | null,
  ): NonNullable<GraphQLSchemaType> | MaybeNullable<T> {
    if (user) return toGraphQLSchema(user);
    return null as MaybeNullable<T>;
  }
}
