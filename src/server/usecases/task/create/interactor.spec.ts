import { describe, expect, test } from 'bun:test';
import { DITokens } from '#/config/constants';
import { Description, Title } from '#/domains/entities/task/valueObjects';
import { User } from '#/domains/entities/user';
import { UserEmail, UserName } from '#/domains/entities/user/valueObjects';
import { Role } from '#/domains/entities/user/valueObjects';
import { TaskRepositoryMock } from '#/domains/repositories/taskRepository.mock';
import { UserSession } from '#/usecases/shared/session/userSession';
import { CreateTaskInteractor } from './interactor';

describe('CreateTaskInteractor', () => {
  test('ログインユーザーはタスクを作成可能', async () => {
    // given
    const repository = new TaskRepositoryMock();
    const interactor = new CreateTaskInteractor(repository);

    // when
    const result = await interactor.handle(
      new UserSession(
        {
          user: User.create(
            new UserName('test'),
            new UserEmail('user@example.com'),
            new Role('ADMIN'),
          ),
        },
        {
          Task: DITokens.TaskPolicy,
        },
      ),
      {
        title: new Title('title'),
        description: new Description('description'),
      },
    );

    // then
    expect(result.title.value).toBe('title');
    expect(result.description.value).toBe('description');
    expect(result.completedAt.value).toBeNull();

    expect(repository.calledMethods).toHaveLength(1);
    expect(repository.calledMethods[0].method).toBe('save');
  });

  test('未ログインの場合、エラーが発生する', async () => {
    // given
    const repository = new TaskRepositoryMock();
    const interactor = new CreateTaskInteractor(repository);

    // when
    // then
    expect(
      interactor.handle(
        new UserSession(null, {
          Task: DITokens.TaskPolicy,
        }),
        {
          title: new Title('title'),
          description: new Description('description'),
        },
      ),
    ).rejects.toThrow();
    expect(repository.calledMethods).toHaveLength(0);
  });
});
