import type { TaskOutputDto } from '../dto';
import type { DeleteTaskUseCase } from './usecase';

export class DeleteTaskUseCaseMock implements DeleteTaskUseCase {
  public constructor(private readonly task: TaskOutputDto | null) {}

  public async handle(): Promise<TaskOutputDto | null> {
    return this.task;
  }
}
