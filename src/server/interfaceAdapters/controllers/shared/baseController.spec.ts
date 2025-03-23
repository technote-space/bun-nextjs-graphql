import { describe, expect, mock, test } from 'bun:test';
import { HandleErrorInteractor } from '#/usecases/handleError/interactor';
import { NotificationMock } from '#/usecases/handleError/notification.mock';
import { HandleErrorPresenterMock } from '#/usecases/handleError/presenter.mock';
import { BaseController } from './baseController';

class SucceededController extends BaseController<undefined, number> {
  public constructor(callable: () => void) {
    super(
      new HandleErrorInteractor([new NotificationMock(callable)]),
      new HandleErrorPresenterMock(),
    );
  }

  protected async execute(): Promise<number> {
    return Promise.resolve(123);
  }
}

class FailedController extends BaseController<undefined, never> {
  public constructor(callable: () => void) {
    super(
      new HandleErrorInteractor([new NotificationMock(callable)]),
      new HandleErrorPresenterMock(),
    );
  }

  protected async execute(): Promise<never> {
    throw new Error('test');
  }
}

describe('BaseController', () => {
  test('正常に終了した場合、結果が返却される', async () => {
    // given
    const notification = mock(() => {});
    const controller = new SucceededController(notification);

    // when
    const result = await controller.invoke(undefined);

    // then
    expect(result).toBe(123);
    expect(notification).not.toBeCalled();
  });

  test('エラーが発生した場合、通知が実行されエラーが返却される', async () => {
    // given
    const notification = mock(() => {});
    const controller = new FailedController(notification);

    // when
    const result = await controller.invoke(undefined);

    // then
    expect((result as Error).message).toBe('test');
    expect(notification).toBeCalledTimes(1);
  });
});
