import { describe, expect, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { Task } from '#/domains/entities/task';
import { Description, Id, Title } from '#/domains/entities/task/valueObjects';
import { User } from '#/domains/entities/user';
import {
  Id as UserId,
  Name as UserName,
} from '#/domains/entities/user/valueObjects';
import { TaskRepositoryMock } from '#/domains/repositories/taskRepository.mock';
import { UserSession } from '#/usecases/shared/session/userSession';
import { FetchTaskInteractor } from './interactor';

describe('FetchTaskInteractor', () => {
  test.each([[null], [{ user: User.create(new UserName('test')) }]])(
    '指定されたIDのタスクが返却される',
    async (context) => {
      // given
      const task = Task.create(
        new UserId('user-id'),
        new Title('title'),
        new Description('description'),
      );
      const repository = new TaskRepositoryMock([task]);
      const interactor = new FetchTaskInteractor(repository);

      // when
      const result = await interactor.handle(
        new UserSession(context, {
          Task: DITokens.TaskRepository,
        }),
        task.id,
      );

      // then
      expect(result.userId.value).toBe('user-id');
      expect(result.title.value).toBe('title');
      expect(result.description.value).toBe('description');

      expect(repository.calledMethods).toHaveLength(1);
      expect(repository.calledMethods[0].method).toBe('find');
    },
  );

  test('指定されたIDのタスクが存在しない場合、エラーが発生する', async () => {
    // given
    const repository = new TaskRepositoryMock();
    const interactor = new FetchTaskInteractor(repository);

    // when
    // then
    await expect(
      interactor.handle(
        new UserSession(null, {
          Task: DITokens.TaskRepository,
        }),
        new Id('id'),
      ),
    ).rejects.toThrow();
    expect(repository.calledMethods).toHaveLength(1);
    expect(repository.calledMethods[0].method).toBe('find');
  });
});
