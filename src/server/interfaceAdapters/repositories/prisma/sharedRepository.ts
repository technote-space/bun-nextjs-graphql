import type {
  DateObject,
  Entity,
  StringId,
} from '@technote-space/vo-entity-ts';
import type {
  ModelDefinition,
  ModelName,
  TransactionPrismaClient,
} from '#/frameworks/database/prisma';
import type { Repository } from '#/frameworks/database/repository';
import { getUpsertParams } from '#/interfaceAdapters/repositories/prisma/utils';
import { tap, transform } from '#/shared/utils';
import { PrismaRepository } from './repository';

type _Model = Readonly<{
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}> &
  // biome-ignore lint/suspicious/noExplicitAny:
  Record<any, any>;
type _Entity = Entity &
  Readonly<{
    id: StringId;
    createdAt: DateObject;
    updatedAt: DateObject;
  }>;
type UpsertCreateInput<M extends ModelName> = Readonly<
  ModelDefinition<M>['operations']['upsert']['args']['create']
>;

export abstract class PrismaSharedRepository<
    P extends _Model,
    E extends _Entity,
    M extends ModelName,
  >
  extends PrismaRepository
  implements Repository
{
  public abstract toEntity(value: P): E | Promise<E>;

  protected abstract getUpsertParams(
    entity: E,
  ): UpsertCreateInput<M> | Promise<UpsertCreateInput<M>>;

  protected abstract get model(): Lowercase<M>;

  private findUnique(
    client: TransactionPrismaClient,
  ): (args: { where: { id: string } }) => Promise<P | null> {
    // biome-ignore lint/suspicious/noExplicitAny:
    return (client[this.model] as any).findUnique;
  }

  private upsert(client: TransactionPrismaClient): <
    // biome-ignore lint/suspicious/noExplicitAny:
    T extends Record<any, any>,
    // biome-ignore lint/suspicious/noExplicitAny:
    W extends { id: string } & Record<any, any>,
  >(args: {
    where: W;
    create: T & { id: string };
    update: T;
  }) => Promise<P> {
    // biome-ignore lint/suspicious/noExplicitAny:
    return (client[this.model] as any).upsert;
  }

  private updateMany(client: TransactionPrismaClient): <
    // biome-ignore lint/suspicious/noExplicitAny:
    T extends Record<any, any>,
    // biome-ignore lint/suspicious/noExplicitAny:
    W extends Record<any, any>,
  >(args: {
    where: W;
    data: T;
  }) => Promise<{ count: number }> {
    // biome-ignore lint/suspicious/noExplicitAny:
    return (client[this.model] as any).updateMany;
  }

  public async find(
    client: TransactionPrismaClient,
    id: StringId,
  ): Promise<E | null> {
    return transform(
      transform(
        await this.findUnique(client)({ where: { id: id.value } }),
        (value) => (value.deletedAt ? null : value),
      ),
      this.toEntity.bind(this),
    );
  }

  public async save(client: TransactionPrismaClient, entity: E): Promise<E> {
    return transform(
      await this.upsert(client)(
        await getUpsertParams(entity, this.getUpsertParams.bind(this)),
      ),
      this.toEntity.bind(this),
    );
  }

  public async delete(
    client: TransactionPrismaClient,
    id: StringId,
  ): Promise<E | null> {
    return transform(
      transform(
        await tap(
          await this.findUnique(client)({ where: { id: id.value } }),
          async () =>
            this.updateMany(client)({
              where: { id: id.value, deletedAt: null },
              data: { deletedAt: new Date() },
            }),
        ),
        (value) => (value.deletedAt ? null : value),
      ),
      this.toEntity.bind(this),
    );
  }
}
