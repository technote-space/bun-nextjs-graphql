import { container } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { GraphQLHandleErrorPresenter } from '#/interfaceAdapters/presenters/graphql/handleError';
import { GraphQLTaskPresenter } from '#/interfaceAdapters/presenters/graphql/task';
import { GraphQLTaskQueryServicePresenter } from '#/interfaceAdapters/presenters/graphql/task/queryService';
import { GraphQLUserPresenter } from '#/interfaceAdapters/presenters/graphql/user';
import { GraphQLUserQueryServicePresenter } from '#/interfaceAdapters/presenters/graphql/user/queryService';

container.registerSingleton(
  DITokens.HandleErrorPresenter,
  GraphQLHandleErrorPresenter,
);

container.registerSingleton(DITokens.TaskPresenter, GraphQLTaskPresenter);
container.registerSingleton(
  DITokens.TaskQueryServicePresenter,
  GraphQLTaskQueryServicePresenter,
);

container.registerSingleton(DITokens.UserPresenter, GraphQLUserPresenter);
container.registerSingleton(
  DITokens.UserQueryServicePresenter,
  GraphQLUserQueryServicePresenter,
);
