import { Exception } from './exception';

export class BadRequest extends Exception {
  public constructor(reason?: string) {
    super(400, '不正なリクエストです', { reason });
  }
}
