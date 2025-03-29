import type { UserOutputDto } from '../dto';
import type { DeleteUserUseCase } from './usecase';

export class DeleteUserUseCaseMock implements DeleteUserUseCase {
  public constructor(private readonly user: UserOutputDto | null) {}

  public async handle(): Promise<UserOutputDto | null> {
    return this.user;
  }
}
