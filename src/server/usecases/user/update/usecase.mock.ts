import { User } from '#/domains/entities/user';
import { type Id, UpdatedAt } from '#/domains/entities/user/valueObjects';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { UserOutputDto } from '../dto';
import type { UpdateUserInputDto } from './dto';
import type { UpdateUserUseCase } from './usecase';

export class UpdateUserUseCaseMock implements UpdateUserUseCase {
  public constructor(private readonly user: User) {}

  public async handle(
    _: UserSession,
    __: Id,
    input: UpdateUserInputDto,
  ): Promise<UserOutputDto> {
    return User.reconstruct(
      this.user.id,
      this.user.ssoId,
      input.name ?? this.user.name,
      input.email ?? this.user.email,
      this.user.createdAt,
      new UpdatedAt(undefined),
    );
  }
}
