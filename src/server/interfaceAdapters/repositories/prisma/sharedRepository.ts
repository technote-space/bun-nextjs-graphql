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
    // biome-ignore lint/suspicious/noExplicitAny:
    P extends Record<any, any>,
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
  >(args: {
    where: { id: string };
    create: T & { id: string };
    update: T;
  }) => Promise<P> {
    // biome-ignore lint/suspicious/noExplicitAny:
    return (client[this.model] as any).upsert;
  }

  private deleteMany(
    client: TransactionPrismaClient,
  ): (args: { where: { id: string } }) => Promise<{ count: number }> {
    // biome-ignore lint/suspicious/noExplicitAny:
    return (client[this.model] as any).deleteMany;
  }

  public async find(
    client: TransactionPrismaClient,
    id: StringId,
  ): Promise<E | null> {
    return transform(
      await this.findUnique(client)({ where: { id: id.value } }),
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
      await tap(
        await this.findUnique(client)({ where: { id: id.value } }),
        async () => this.deleteMany(client)({ where: { id: id.value } }),
      ),
      this.toEntity.bind(this),
    );
  }
}
