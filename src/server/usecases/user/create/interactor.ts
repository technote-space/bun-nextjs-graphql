import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import { User } from '#/domains/entities/user';
import type { UserRepository } from '#/domains/repositories/userRepository';
import { transform } from '#/shared/utils';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { CreateUserInputDto } from '#/usecases/user/create/dto';
import type { UserOutputDto } from '../dto';
import type { CreateUserUseCase } from './usecase';

@singleton()
export class CreateUserInteractor implements CreateUserUseCase {
  public constructor(
    @inject(DITokens.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  public async handle(
    session: UserSession,
    input: CreateUserInputDto,
  ): Promise<UserOutputDto> {
    return transform(User.create(input.name, input.email), async (user) => {
      await session.authorize('create', user);
      return this.userRepository.transaction(async (client) =>
        this.userRepository.save(client, user),
      );
    });
  }
}
