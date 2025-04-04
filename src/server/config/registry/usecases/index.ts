import { container } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { HandleErrorInteractor } from '#/usecases/handleError/interactor';
import { CreateTaskInteractor } from '#/usecases/task/create/interactor';
import { DeleteTaskInteractor } from '#/usecases/task/delete/interactor';
import { FetchTaskInteractor } from '#/usecases/task/fetch/interactor';
import { OnCompleteTaskInteractor } from '#/usecases/task/onComplete/interactor';
import { PrismaTaskPaginationQueryService } from '#/usecases/task/paginationQueryService/prismaInteractor';
import { UpdateTaskInteractor } from '#/usecases/task/update/interactor';
import { CreateUserInteractor } from '#/usecases/user/create/interactor';
import { DeleteUserInteractor } from '#/usecases/user/delete/interactor';
import { FetchUserInteractor } from '#/usecases/user/fetch/interactor';
import { FetchMeInteractor } from '#/usecases/user/me/interactor';
import { PrismaUserPaginationQueryService } from '#/usecases/user/paginationQueryService/prismaInteractor';
import { UpdateUserInteractor } from '#/usecases/user/update/interactor';

container.registerSingleton(DITokens.FetchTaskUseCase, FetchTaskInteractor);
container.registerSingleton(
  DITokens.PaginateTaskQueryService,
  PrismaTaskPaginationQueryService,
);
container.registerSingleton(DITokens.CreateTaskUseCase, CreateTaskInteractor);
container.registerSingleton(DITokens.DeleteTaskUseCase, DeleteTaskInteractor);
container.registerSingleton(DITokens.UpdateTaskUseCase, UpdateTaskInteractor);
container.registerSingleton(
  DITokens.OnCompleteTaskUseCase,
  OnCompleteTaskInteractor,
);

container.registerSingleton(DITokens.FetchMeUseCase, FetchMeInteractor);
container.registerSingleton(DITokens.FetchUserUseCase, FetchUserInteractor);
container.registerSingleton(
  DITokens.PaginateUserQueryService,
  PrismaUserPaginationQueryService,
);
container.registerSingleton(DITokens.CreateUserUseCase, CreateUserInteractor);
container.registerSingleton(DITokens.DeleteUserUseCase, DeleteUserInteractor);
container.registerSingleton(DITokens.UpdateUserUseCase, UpdateUserInteractor);

container.registerSingleton(DITokens.HandleErrorUseCase, HandleErrorInteractor);
