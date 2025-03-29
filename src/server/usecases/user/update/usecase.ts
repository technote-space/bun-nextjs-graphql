import type { Id } from '#/domains/entities/user/valueObjects';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { UserOutputDto } from '../dto';
import type { UpdateUserInputDto } from './dto';

export interface UpdateUserUseCase {
  handle(
    session: UserSession,
    id: Id,
    input: UpdateUserInputDto,
  ): Promise<UserOutputDto>;
}
