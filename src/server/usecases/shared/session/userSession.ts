import type { Entity } from '@technote-space/vo-entity-ts';
import { container } from 'tsyringe';
import type { User } from '#/domains/entities/user';
import { Forbidden, Unauthorized } from '#/shared/exceptions';
import type { Action, Policy } from './policy';

export interface UserSessionContext {
  user: User;
}

type Resource<A extends Action> = A extends 'list' ? string : Entity;

export class UserSession {
  public constructor(
    public readonly context: UserSessionContext | null,
    // biome-ignore lint/suspicious/noExplicitAny:
    protected readonly policies: Record<string, string | Policy<any>>,
  ) {}

  public async can<A extends Action>(
    action: A,
    resource: Resource<A>,
  ): Promise<boolean> {
    const key =
      typeof resource === 'string' ? resource : resource.constructor.name;
    if (!(key in this.policies)) {
      return false;
    }

    const tokenOrPolicy = this.policies[key];
    const policy =
      typeof tokenOrPolicy === 'string'
        ? // biome-ignore lint/suspicious/noExplicitAny:
          container.resolve<Policy<any>>(tokenOrPolicy)
        : tokenOrPolicy;
    const beforeResult = await policy.before(this.context, action);
    if (typeof beforeResult === 'boolean') {
      return beforeResult;
    }

    if (action === 'list') {
      return policy.list(this.context);
    }

    const beforeResourceResult = await policy.beforeResource(
      this.context,
      resource,
      action,
    );
    if (typeof beforeResourceResult === 'boolean') {
      return beforeResourceResult;
    }

    return policy[action](this.context, resource);
  }

  public async cannot<A extends Action>(
    action: A,
    resource: Resource<A>,
  ): Promise<boolean> {
    return !(await this.can(action, resource));
  }

  public async authorize<A extends Action>(
    action: A,
    resource: Resource<A>,
  ): Promise<void> | never {
    if (await this.cannot(action, resource)) {
      if (!this.context) {
        throw new Unauthorized();
      }

      throw new Forbidden();
    }
  }
}
