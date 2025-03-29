import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import type { Id } from '#/domains/entities/user/valueObjects';
import type { UserRepository } from '#/domains/repositories/userRepository';
import { NotFound } from '#/shared/exceptions';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { UserOutputDto } from '../dto';
import type { UpdateUserInputDto } from './dto';
import type { UpdateUserUseCase } from './usecase';

@singleton()
export class UpdateUserInteractor implements UpdateUserUseCase {
  public constructor(
    @inject(DITokens.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  public async handle(
    session: UserSession,
    id: Id,
    input: UpdateUserInputDto,
  ): Promise<UserOutputDto> {
    return this.userRepository
      .transaction(async (client) => this.userRepository.find(client, id))
      .then(async (user) => {
        if (!user) throw new NotFound('ユーザー', 'user', id.value);
        await session.authorize('update', user);
        return this.userRepository.transaction(async (client) =>
          this.userRepository.save(client, user.update(input)),
        );
      });
  }
}
