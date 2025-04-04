import type { UserOutputDto } from '../dto';
import type { FetchMeUseCase } from './usecase';

export class FetchMeUseCaseMock implements FetchMeUseCase {
  public constructor(private readonly user: UserOutputDto) {}

  public async handle(): Promise<UserOutputDto> {
    return this.user;
  }
}
