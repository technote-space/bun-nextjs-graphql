import { describe, expect, mock, test } from 'bun:test';
import { HandleErrorInteractor } from './interactor';
import { NotificationMock } from './notification.mock';

describe('HandleErrorInteractor', () => {
  test('全ての通知が実行される', async () => {
    // given
    const notifyCallbacks = [
      mock(),
      mock(() => {
        throw new Error();
      }),
      mock(),
    ];
    const notifications = [
      new NotificationMock(notifyCallbacks[0]),
      new NotificationMock(notifyCallbacks[1]),
      new NotificationMock(notifyCallbacks[2]),
    ];
    const error = new Error('test');
    const interactor = new HandleErrorInteractor(notifications);

    // when
    const result = await interactor.handle(error);

    // then
    expect(result.message).toBe('test');
    expect(notifyCallbacks[0]).toBeCalledTimes(1);
    expect(notifyCallbacks[1]).toBeCalledTimes(1);
    expect(notifyCallbacks[2]).toBeCalledTimes(1);
  });
});
