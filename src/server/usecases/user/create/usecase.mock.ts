import { User } from '#/domains/entities/user';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { CreateUserInputDto } from '#/usecases/user/create/dto';
import type { UserOutputDto } from '../dto';
import type { CreateUserUseCase } from './usecase';

export class CreateUserUseCaseMock implements CreateUserUseCase {
  public async handle(
    _: UserSession,
    input: CreateUserInputDto,
  ): Promise<UserOutputDto> {
    return User.create(input.name);
  }
}
