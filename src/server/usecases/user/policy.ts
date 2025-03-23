import { singleton } from 'tsyringe';
import type { User } from '#/domains/entities/user';
import { type Action, PolicyBase } from '#/usecases/shared/session/policy';
import type { UserSessionContext } from '#/usecases/shared/session/userSession';

@singleton()
export class UserPolicy extends PolicyBase<User> {
  public async before(
    context: UserSessionContext | null,
    action: Action,
  ): Promise<boolean | null> {
    if (action === 'list') return this.isLoggedIn(context);
    return null;
  }

  public async beforeResource(
    context: UserSessionContext | null,
    resource: User,
  ): Promise<boolean | null> {
    return !!context?.user.id.equals(resource.id);
  }
}
