import type { Entity } from '@technote-space/vo-entity-ts';
import type { StringId } from '@technote-space/vo-entity-ts';
import type { Repository } from '#/frameworks/database/repository';
import { Mock } from '#/shared/test/mock';

export class RepositoryMock<T extends Entity & { id: StringId }>
  extends Mock
  implements Repository
{
  public constructor(public items: T[] = []) {
    super();
  }

  public async transaction<T>(
    callback: (client: unknown) => Promise<T>,
  ): Promise<T> {
    return callback(this);
  }

  public async healthCheck(): Promise<boolean> {
    this.methodCalled('healthCheck');
    return true;
  }

  public async find(_: unknown, id: StringId): Promise<T | null> {
    this.methodCalled('find', [id]);
    return this.items.find((item) => item.id.equals(id)) ?? null;
  }

  public async save(_: unknown, item: T): Promise<T> {
    this.methodCalled('save', [item]);
    const index = this.items.findIndex((item) => item.equals(item));
    if (index < 0) {
      this.items.push(item);
    } else {
      this.items[index] = item;
    }

    return item;
  }

  public async delete(_: unknown, id: StringId): Promise<T | null> {
    this.methodCalled('delete', [id]);
    const index = this.items.findIndex((item) => item.id.equals(id));
    if (index < 0) {
      return null;
    }

    return this.items.splice(index, 1)[0];
  }
}
