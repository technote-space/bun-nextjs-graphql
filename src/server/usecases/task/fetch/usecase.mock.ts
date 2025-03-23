import type { Task } from '#/domains/entities/task';
import type { FetchTaskOutput } from './dto';
import type { FetchTaskUseCase } from './usecase';

export class FetchTaskUseCaseMock implements FetchTaskUseCase {
  public constructor(private readonly task: Task) {}

  public async handle(): Promise<FetchTaskOutput> {
    return this.task;
  }
}
