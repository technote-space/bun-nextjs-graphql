import { Exception } from '@technote-space/vo-entity-ts';

export class Unexpected extends Exception {
  public constructor(reason?: string) {
    super(500, '予期せぬエラーが発生しました', { reason });
  }
}
