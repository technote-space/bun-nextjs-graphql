import type { UserSession } from '#/usecases/shared/session/userSession';
import type { UserOutputDto } from '../dto';
import type { CreateUserInputDto } from './dto';

export interface CreateUserUseCase {
  handle(
    session: UserSession,
    input: CreateUserInputDto,
  ): Promise<UserOutputDto>;
}
