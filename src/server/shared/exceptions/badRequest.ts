import { Exception } from '@technote-space/vo-entity-ts';

export class BadRequest extends Exception {
  public constructor(reason?: string) {
    super(400, '不正なリクエストです', { reason });
  }
}
