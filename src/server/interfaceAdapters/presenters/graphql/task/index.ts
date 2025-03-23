import { singleton } from 'tsyringe';
import type { Task as TaskEntity } from '#/domains/entities/task';
import type { MaybeNullable } from '#/shared/types';
import type { TaskPresenter } from '#/usecases/task/presenter';
import { type GraphQLSchemaType, toGraphQLSchema } from './utils';

@singleton()
export class GraphQLTaskPresenter implements TaskPresenter {
  public entity<T extends TaskEntity>(
    task: T | null,
  ): NonNullable<GraphQLSchemaType> | MaybeNullable<T> {
    if (task) return toGraphQLSchema(task);
    return null as MaybeNullable<T>;
  }
}
