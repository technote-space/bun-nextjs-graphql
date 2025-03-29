import { singleton } from 'tsyringe';
import type { MaybeNullable } from '#/shared/types';
import type { TaskOutputDto } from '#/usecases/task/dto';
import type { TaskPresenter } from '#/usecases/task/presenter';
import { type GraphQLSchemaType, toGraphQLSchema } from './utils';

@singleton()
export class GraphQLTaskPresenter implements TaskPresenter<GraphQLSchemaType> {
  public entity<T extends TaskOutputDto>(
    task: T | null,
  ): NonNullable<GraphQLSchemaType> | MaybeNullable<T> {
    if (task) return toGraphQLSchema(task);
    return null as MaybeNullable<T>;
  }
}
