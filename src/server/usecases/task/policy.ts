import { singleton } from 'tsyringe';
import type { Task } from '#/domains/entities/task';
import { type Action, PolicyBase } from '#/usecases/shared/session/policy';
import type { UserSessionContext } from '#/usecases/shared/session/userSession';

@singleton()
export class TaskPolicy extends PolicyBase<Task> {
  public async before(
    context: UserSessionContext | null,
    action: Action,
  ): Promise<boolean | null> {
    if (!this.isLoggedIn(context)) return false;
    if (context.user.role.isAdmin()) return true;

    if (action === 'list') return true;
    return null;
  }

  public async beforeResource(
    context: UserSessionContext | null,
    resource: Task,
  ): Promise<boolean | null> {
    return !!context?.user.id.equals(resource.userId);
  }
}
