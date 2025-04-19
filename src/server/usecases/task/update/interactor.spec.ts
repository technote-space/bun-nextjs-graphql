import { describe, expect, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { Task } from '#/domains/entities/task';
import {
  Description,
  ExpiredAt,
  Id,
  Title,
} from '#/domains/entities/task/valueObjects';
import { User } from '#/domains/entities/user';
import { UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { Role } from '#/domains/entities/user/valueObjects';
import { TaskRepositoryMock } from '#/domains/repositories/taskRepository.mock';
import { UserSession } from '#/usecases/shared/session/userSession';
import { UpdateTaskInteractor } from './interactor';

describe('UpdateTaskInteractor', () => {
  test.each([
    [
      new ExpiredAt(null),
      new Title('updated title'),
      new Description('updated description'),
      new ExpiredAt(new Date('2023-12-31T23:59:59Z')),
      'updated title',
      'updated description',
      '2023-12-31T23:59:59.000Z',
    ],
    [
      new ExpiredAt(null),
      undefined,
      undefined,
      undefined,
      'title',
      'description',
      null,
    ],
    [
      new ExpiredAt('2023-12-31T23:59:59Z'),
      undefined,
      undefined,
      new ExpiredAt(null),
      'title',
      'description',
      null,
    ],
    [
      new ExpiredAt('2023-12-31T23:59:59Z'),
      undefined,
      undefined,
      new ExpiredAt('2024-06-30T23:59:59Z'),
      'title',
      'description',
      '2024-06-30T23:59:59.000Z',
    ],
  ])(
    '指定されたIDのタスクが更新される',
    async (
      expiredAt,
      updateTitle,
      updateDescription,
      updateExpiredAt,
      expectedTitle,
      expectedDescription,
      expectedExpiredAt,
    ) => {
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
        expiredAt,
      );
      const repository = new TaskRepositoryMock([task]);
      const interactor = new UpdateTaskInteractor(repository);

      // when
      const result = await interactor.handle(
        new UserSession(
          { user },
          {
            Task: DITokens.TaskPolicy,
          },
        ),
        task.id,
        {
          title: updateTitle,
          description: updateDescription,
          expiredAt: updateExpiredAt,
        },
      );

      // then
      expect(result?.title.value).toBe(expectedTitle);
      expect(result?.description.value).toBe(expectedDescription);
      expect(result?.expiredAt.value?.toISOString() ?? null).toBe(
        expectedExpiredAt,
      );

      expect(repository.calledMethods).toHaveLength(2);
      expect(repository.calledMethods[0].method).toBe('find');
      expect(repository.calledMethods[1].method).toBe('save');
    },
  );

  test('指定されたIDのタスクが存在しない場合、エラーが発生する', async () => {
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
    const interactor = new UpdateTaskInteractor(repository);

    // when
    // then
    expect(
      interactor.handle(
        new UserSession(
          { user },
          {
            Task: DITokens.TaskPolicy,
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
    const interactor = new UpdateTaskInteractor(repository);

    // when
    // then
    expect(
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
