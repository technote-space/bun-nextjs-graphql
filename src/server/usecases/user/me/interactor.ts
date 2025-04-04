import { singleton } from 'tsyringe';
import type { UserSession } from '#/usecases/shared/session/userSession';
import type { UserOutputDto } from '../dto';
import type { FetchMeUseCase } from './usecase';

@singleton()
export class FetchMeInteractor implements FetchMeUseCase {
  public async handle(session: UserSession): Promise<UserOutputDto> {
    return session.getContext().user;
  }
}
