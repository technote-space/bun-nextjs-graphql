import { Exception } from '@technote-space/vo-entity-ts';

export class Unauthorized extends Exception {
  public constructor() {
    super(401, '認証されていません');
  }
}
