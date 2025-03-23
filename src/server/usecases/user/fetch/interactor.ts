import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import type { Id } from '#/domains/entities/user/valueObjects';
import type { UserRepository } from '#/domains/repositories/userRepository';
import { NotFound } from '#/shared/exceptions';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { FetchUserOutput } from './dto';
import type { FetchUserUseCase } from './usecase';

@singleton()
export class FetchUserInteractor implements FetchUserUseCase {
  public constructor(
    @inject(DITokens.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  public async handle(session: UserSession, id: Id): Promise<FetchUserOutput> {
    return this.userRepository
      .transaction(async (client) => this.userRepository.find(client, id))
      .then(async (user) => {
        if (!user) throw new NotFound('タスク', 'user', id.value);
        await session.authorize('read', user);
        return user;
      });
  }
}
