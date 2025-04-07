import { singleton } from 'tsyringe';
import type { User } from '#/domains/entities/user';
import { PolicyBase } from '#/usecases/shared/session/policy';
import type { UserSessionContext } from '#/usecases/shared/session/userSession';

@singleton()
export class UserPolicy extends PolicyBase<User> {
  public async before(
    context: UserSessionContext | null,
  ): Promise<boolean | null> {
    if (!this.isLoggedIn(context)) return false;
    if (context.user.role.isAdmin()) return true;

    return null;
  }

  public async beforeResource(
    context: UserSessionContext | null,
    resource: User,
  ): Promise<boolean | null> {
    return !!context?.user.id.equals(resource.id);
  }
}
