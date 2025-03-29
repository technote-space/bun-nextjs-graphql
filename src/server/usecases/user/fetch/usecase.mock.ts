import type { UserOutputDto } from '../dto';
import type { FetchUserUseCase } from './usecase';

export class FetchUserUseCaseMock implements FetchUserUseCase {
  public constructor(private readonly user: UserOutputDto) {}

  public async handle(): Promise<UserOutputDto> {
    return this.user;
  }
}
