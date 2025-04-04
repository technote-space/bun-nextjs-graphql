import { describe, expect, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { Task } from '#/domains/entities/task';
import { Description, Id, Title } from '#/domains/entities/task/valueObjects';
import { User } from '#/domains/entities/user';
import { UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { TaskRepositoryMock } from '#/domains/repositories/taskRepository.mock';
import { UserSession } from '#/usecases/shared/session/userSession';
import { UpdateTaskInteractor } from '#/usecases/task/update/interactor';
import { FetchTaskInteractor } from './interactor';

describe('FetchTaskInteractor', () => {
  test('指定されたIDのタスクが返却される', async () => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
    );
    const task = Task.create(
      user.id,
      new Title('title'),
      new Description('description'),
    );
    const repository = new TaskRepositoryMock([task]);
    const interactor = new FetchTaskInteractor(repository);

    // when
    const result = await interactor.handle(
      new UserSession(
        { user },
        {
          Task: DITokens.TaskPolicy,
        },
      ),
      task.id,
    );

    // then
    expect(result.userId.value).toBe(user.id.value);
    expect(result.title.value).toBe('title');
    expect(result.description.value).toBe('description');

    expect(repository.calledMethods).toHaveLength(1);
    expect(repository.calledMethods[0].method).toBe('find');
  });

  test('指定されたIDのタスクが存在しない場合、エラーが発生する', async () => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
    );
    const task = Task.create(
      user.id,
      new Title('title'),
      new Description('description'),
    );
    const repository = new TaskRepositoryMock([task]);
    const interactor = new FetchTaskInteractor(repository);

    // when
    // then
    await expect(
      interactor.handle(
        new UserSession(null, {
          Task: DITokens.TaskPolicy,
        }),
        new Id(undefined),
      ),
    ).rejects.toThrow();
    expect(repository.calledMethods).toHaveLength(1);
    expect(repository.calledMethods[0].method).toBe('find');
  });

  test.each([
    [null],
    [
      {
        user: User.create(
          new UserName('test'),
          new UserEmail('test@example.com'),
        ),
      },
    ],
  ])('権限がない場合、エラーが発生する', async (context) => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
    );
    const task = Task.create(
      user.id,
      new Title('title'),
      new Description('description'),
    );
    const repository = new TaskRepositoryMock([task]);
    const interactor = new UpdateTaskInteractor(repository);

    // when
    // then
    await expect(
      interactor.handle(
        new UserSession(context, {
          Task: DITokens.TaskPolicy,
        }),
        task.id,
        {},
      ),
    ).rejects.toThrow();
    expect(repository.calledMethods).toHaveLength(1);
    expect(repository.calledMethods[0].method).toBe('find');
  });
});
