import { container } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { Task } from '#/domains/entities/task';
import { User } from '#/domains/entities/user';
import { TaskPolicy } from '#/usecases/task/policy';
import { UserPolicy } from '#/usecases/user/policy';

container.registerSingleton(DITokens.TaskPolicy, TaskPolicy);
container.registerSingleton(DITokens.UserPolicy, UserPolicy);

container.registerInstance(DITokens.Policies, {
  [Task.name]: DITokens.TaskPolicy,
  [User.name]: DITokens.UserPolicy,
});
