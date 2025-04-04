import { Exception } from '@technote-space/vo-entity-ts';

export class Forbidden extends Exception {
  public constructor() {
    super(403, '権限がありません');
  }
}
