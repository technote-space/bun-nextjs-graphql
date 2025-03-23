import type { User } from '#/domains/entities/user';
import type { FetchUserOutput } from './dto';
import type { FetchUserUseCase } from './usecase';

export class FetchUserUseCaseMock implements FetchUserUseCase {
  public constructor(private readonly user: User) {}

  public async handle(): Promise<FetchUserOutput> {
    return this.user;
  }
}
