import { inject, singleton } from 'tsyringe';
import { DITokens } from '#/config/constants';
import type { Id } from '#/domains/entities/user/valueObjects';
import type { UserRepository } from '#/domains/repositories/userRepository';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { UserOutputDto } from '../dto';
import type { DeleteUserUseCase } from './usecase';

@singleton()
export class DeleteUserInteractor implements DeleteUserUseCase {
  public constructor(
    @inject(DITokens.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  public async handle(
    session: UserSession,
    id: Id,
  ): Promise<UserOutputDto | null> {
    return this.userRepository
      .transaction(async (client) => this.userRepository.find(client, id))
      .then(async (user) => {
        if (!user) return null;
        await session.authorize('delete', user);
        return this.userRepository.transaction(async (client) =>
          this.userRepository.delete(client, id),
        );
      });
  }
}
