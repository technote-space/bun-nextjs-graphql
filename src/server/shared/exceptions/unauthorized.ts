import { Exception } from './exception';

export class Unauthorized extends Exception {
  public constructor() {
    super(401, '認証されていません');
  }
}
