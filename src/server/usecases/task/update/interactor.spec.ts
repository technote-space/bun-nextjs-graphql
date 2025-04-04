import { describe, expect, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { Task } from '#/domains/entities/task';
import { Description, Id, Title } from '#/domains/entities/task/valueObjects';
import { User } from '#/domains/entities/user';
import { UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { TaskRepositoryMock } from '#/domains/repositories/taskRepository.mock';
import { UserSession } from '#/usecases/shared/session/userSession';
import { UpdateTaskInteractor } from './interactor';

describe('UpdateTaskInteractor', () => {
  test.each([
    [
      new Title('updated title'),
      new Description('updated title'),
      'updated title',
      'updated description',
    ],
    [undefined, undefined, 'title', 'description'],
  ])(
    '指定されたIDのタスクが更新される',
    async (title, description, expectedTitle, expectedDescription) => {
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
      const result = await interactor.handle(
        new UserSession(
          { user },
          {
            Task: DITokens.TaskRepository,
          },
        ),
        task.id,
        { title, description },
      );

      // then
      expect(result?.title.value).toBe(expectedTitle);
      expect(result?.description.value).toBe(expectedDescription);

      expect(repository.calledMethods).toHaveLength(2);
      expect(repository.calledMethods[0].method).toBe('find');
      expect(repository.calledMethods[1].method).toBe('update');
    },
  );

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
    const interactor = new UpdateTaskInteractor(repository);

    // when
    // then
    await expect(
      interactor.handle(
        new UserSession(
          { user },
          {
            Task: DITokens.TaskRepository,
          },
        ),
        new Id(undefined),
        {},
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
          Task: DITokens.TaskRepository,
        }),
        task.id,
        {},
      ),
    ).rejects.toThrow();
    expect(repository.calledMethods).toHaveLength(1);
    expect(repository.calledMethods[0].method).toBe('find');
  });
});
