import { Exception } from './exception';

export class Forbidden extends Exception {
  public constructor() {
    super(403, '権限がありません');
  }
}
