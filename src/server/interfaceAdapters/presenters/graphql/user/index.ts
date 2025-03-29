import { singleton } from 'tsyringe';
import type { MaybeNullable } from '#/shared/types';
import type { UserOutputDto } from '#/usecases/user/dto';
import type { UserPresenter } from '#/usecases/user/presenter';
import { type GraphQLSchemaType, toGraphQLSchema } from './utils';

@singleton()
export class GraphQLUserPresenter implements UserPresenter<GraphQLSchemaType> {
  public entity<T extends UserOutputDto>(
    user: T | null,
  ): NonNullable<GraphQLSchemaType> | MaybeNullable<T> {
    if (user) return toGraphQLSchema(user);
    return null as MaybeNullable<T>;
  }
}
