import { describe, expect, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { Task } from '#/domains/entities/task';
import { Description, Id, Title } from '#/domains/entities/task/valueObjects';
import { User } from '#/domains/entities/user';
import { UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { Role } from '#/domains/entities/user/valueObjects';
import { TaskRepositoryMock } from '#/domains/repositories/taskRepository.mock';
import { UserSession } from '#/usecases/shared/session/userSession';
import { DeleteTaskInteractor } from './interactor';

describe('DeleteTaskInteractor', () => {
  test('指定されたIDのタスクが削除される', async () => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
      new Role('EDITOR'),
    );
    const task = Task.create(
      user.id,
      new Title('title'),
      new Description('description'),
    );
    const repository = new TaskRepositoryMock([task]);
    const interactor = new DeleteTaskInteractor(repository);

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
    expect(result?.title.value).toBe('title');
    expect(result?.description.value).toBe('description');

    expect(repository.calledMethods).toHaveLength(2);
    expect(repository.calledMethods[0].method).toBe('find');
    expect(repository.calledMethods[1].method).toBe('delete');
  });

  test('指定されたIDのタスクが存在しない場合、nullが返却される', async () => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
      new Role('EDITOR'),
    );
    const task = Task.create(
      user.id,
      new Title('title'),
      new Description('description'),
    );
    const repository = new TaskRepositoryMock([task]);
    const interactor = new DeleteTaskInteractor(repository);

    // when
    const result = await interactor.handle(
      new UserSession(
        { user },
        {
          Task: DITokens.TaskPolicy,
        },
      ),
      new Id(undefined),
    );

    // then
    expect(result).toBeNull();

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
          new Role('EDITOR'),
        ),
      },
    ],
  ])('権限がない場合、エラーが発生する', async (context) => {
    // given
    const user = User.create(
      new UserName('name'),
      new UserEmail('user@example.com'),
      new Role('EDITOR'),
    );
    const task = Task.create(
      user.id,
      new Title('title'),
      new Description('description'),
    );
    const repository = new TaskRepositoryMock([task]);
    const interactor = new DeleteTaskInteractor(repository);

    // when
    // then
    await expect(
      interactor.handle(
        new UserSession(context, {
          Task: DITokens.TaskPolicy,
        }),
        task.id,
      ),
    ).rejects.toThrow();
    expect(repository.calledMethods).toHaveLength(1);
    expect(repository.calledMethods[0].method).toBe('find');
  });
});
