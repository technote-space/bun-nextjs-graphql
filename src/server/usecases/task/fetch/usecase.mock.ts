import type { TaskOutputDto } from '../dto';
import type { FetchTaskUseCase } from './usecase';

export class FetchTaskUseCaseMock implements FetchTaskUseCase {
  public constructor(private readonly task: TaskOutputDto) {}

  public async handle(): Promise<TaskOutputDto> {
    return this.task;
  }
}
