import type { Entity } from '@technote-space/vo-entity-ts';
import type { UserSessionContext } from './userSession';

export type Action = 'create' | 'read' | 'list' | 'update' | 'delete';

export interface Policy<T extends Entity> {
  before(
    context: UserSessionContext | null,
    action: Action,
  ): Promise<boolean | null>;

  beforeResource(
    context: UserSessionContext | null,
    resource: T,
    action: Action,
  ): Promise<boolean | null>;

  create(context: UserSessionContext | null, resource: T): Promise<boolean>;

  read(context: UserSessionContext | null, resource: T): Promise<boolean>;

  list(context: UserSessionContext | null): Promise<boolean>;

  update(context: UserSessionContext | null, resource: T): Promise<boolean>;

  delete(context: UserSessionContext | null, resource: T): Promise<boolean>;
}

export abstract class PolicyBase<T extends Entity> implements Policy<T> {
  public async before(
    _context: UserSessionContext | null,
    _action: Action,
  ): Promise<boolean | null> {
    return null;
  }

  public async beforeResource(
    _context: UserSessionContext | null,
    _resource: T,
    _action: Action,
  ): Promise<boolean | null> {
    return null;
  }

  public async create(
    _context: UserSessionContext | null,
    _resource: T,
  ): Promise<boolean> {
    return false;
  }

  public async read(
    _context: UserSessionContext | null,
    _resource: T,
  ): Promise<boolean> {
    return false;
  }

  public async list(_context: UserSessionContext | null): Promise<boolean> {
    return false;
  }

  public async update(
    _context: UserSessionContext | null,
    _resource: T,
  ): Promise<boolean> {
    return false;
  }

  public async delete(
    _context: UserSessionContext | null,
    _resource: T,
  ): Promise<boolean> {
    return false;
  }

  protected isLoggedIn(
    context: UserSessionContext | null,
  ): context is UserSessionContext {
    return context !== null;
  }
}
